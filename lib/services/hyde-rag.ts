import { HyDEProbe, RetrievalResult, DocumentChunk, OutlineLesson } from '@/lib/types/admin-content';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';

export class HyDERAGService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateOutlineProbes(lesson: OutlineLesson): Promise<HyDEProbe> {
    const prompt = this.buildOutlineProbePrompt(lesson);
    
    const response = await this.callLLM(prompt, {
      temperature: 0.7,
      max_tokens: 800
    });

    return this.parseHyDEProbeResponse(response);
  }

  async retrieveRelevantContext(
    probe: HyDEProbe,
    documentChunks: DocumentChunk[]
  ): Promise<RetrievalResult[]> {
    // Step 1: Vector similarity search for each probe component
    const vectorResults = await Promise.all([
      this.vectorSearch(probe.synopsis, documentChunks),
      this.vectorSearch(probe.anchor_terms.join(' '), documentChunks),
      this.vectorSearch(`${probe.question} ${probe.answer}`, documentChunks)
    ]);

    // Step 2: Combine and deduplicate results
    const combinedResults = this.combineResults(vectorResults);

    // Step 3: Reciprocal Rank Fusion (RRF)
    const fusedResults = this.applyRRF(combinedResults);

    // Step 4: LLM re-ranking
    const rerankedResults = await this.rerank(probe, fusedResults);

    // Step 5: Select diverse, high-quality results within token limit
    return this.selectFinalResults(rerankedResults);
  }

  private buildOutlineProbePrompt(lesson: OutlineLesson): string {
    return `Generate three complementary probes for retrieving content about this lesson:

LESSON: ${lesson.title}
DESCRIPTION: ${lesson.description}
CONCEPTS: ${lesson.concepts.join(', ')}
LEARNING OBJECTIVES: ${lesson.learning_objectives.join('; ')}

Generate exactly:

1. SYNOPSIS (${ADMIN_CONTENT_CONFIG.HYDE.SYNOPSIS_WORD_RANGE[0]}-${ADMIN_CONTENT_CONFIG.HYDE.SYNOPSIS_WORD_RANGE[1]} words):
A comprehensive overview that would appear in educational content about this topic.

2. ANCHOR TERMS (${ADMIN_CONTENT_CONFIG.HYDE.ANCHOR_TERMS_RANGE[0]}-${ADMIN_CONTENT_CONFIG.HYDE.ANCHOR_TERMS_RANGE[1]} terms):
Key technical terms, concepts, and phrases that would appear in relevant content.

3. Q&A PAIR:
- Question: A specific question a student might ask about this topic
- Answer (${ADMIN_CONTENT_CONFIG.HYDE.ANSWER_WORD_RANGE[0]}-${ADMIN_CONTENT_CONFIG.HYDE.ANSWER_WORD_RANGE[1]} words): A detailed answer that would appear in educational materials

Format your response as JSON:
{
  "synopsis": "...",
  "anchor_terms": ["term1", "term2", ...],
  "question": "...",
  "answer": "..."
}`;
  }

  private async vectorSearch(query: string, chunks: DocumentChunk[]): Promise<Array<{chunk: DocumentChunk, score: number}>> {
    // In real implementation, this would use vector database or embedding similarity
    // Mock implementation with random scores for demonstration
    const results = chunks.map(chunk => ({
      chunk,
      score: Math.random() * 0.5 + 0.5 // Random score between 0.5-1.0
    }));

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, ADMIN_CONTENT_CONFIG.RETRIEVAL.VECTOR_TOP_K);
  }

  private combineResults(vectorResults: Array<Array<{chunk: DocumentChunk, score: number}>>): Array<{chunk: DocumentChunk, scores: number[]}> {
    const chunkMap = new Map<string, {chunk: DocumentChunk, scores: number[]}>();

    vectorResults.forEach((results, probeIndex) => {
      results.forEach(({chunk, score}) => {
        if (!chunkMap.has(chunk.id)) {
          chunkMap.set(chunk.id, {chunk, scores: [0, 0, 0]});
        }
        chunkMap.get(chunk.id)!.scores[probeIndex] = score;
      });
    });

    return Array.from(chunkMap.values());
  }

  private applyRRF(results: Array<{chunk: DocumentChunk, scores: number[]}>): Array<{chunk: DocumentChunk, rrfScore: number}> {
    const k = ADMIN_CONTENT_CONFIG.RETRIEVAL.RRF_CONSTANT;
    
    return results.map(({chunk, scores}) => {
      const rrfScore = scores.reduce((sum, score, index) => {
        if (score > 0) {
          const rank = results
            .map(r => r.scores[index])
            .sort((a, b) => b - a)
            .indexOf(score) + 1;
          return sum + (1 / (k + rank));
        }
        return sum;
      }, 0);

      return {chunk, rrfScore};
    }).sort((a, b) => b.rrfScore - a.rrfScore);
  }

  private async rerank(probe: HyDEProbe, results: Array<{chunk: DocumentChunk, rrfScore: number}>): Promise<RetrievalResult[]> {
    const rerankPrompt = `Rank these document chunks by relevance to the learning objective.

LEARNING CONTEXT:
- Synopsis: ${probe.synopsis}
- Key Terms: ${probe.anchor_terms.join(', ')}
- Focus Question: ${probe.question}

CHUNKS TO RANK:
${results.slice(0, 15).map((result, i) => `
[${i}] (Page ${result.chunk.page_number})
${result.chunk.content.slice(0, 300)}...
`).join('\n')}

Rank by: coverage of key concepts, specificity to learning objectives, authority of information.
Return JSON array of chunk indices in order of relevance: [2, 5, 0, ...]`;

    const response = await this.callLLM(rerankPrompt, { temperature: 0.1, max_tokens: 200 });
    
    try {
      const rankedIndices = JSON.parse(response);
      return rankedIndices.slice(0, 10).map((index: number, rank: number) => ({
        chunk_id: results[index].chunk.id,
        content: results[index].chunk.content,
        page_number: results[index].chunk.page_number,
        relevance_score: 1 - (rank / 10), // Decreasing relevance score
        citation: `[Doc p.${results[index].chunk.page_number}]`
      }));
    } catch (error) {
      // Fallback to RRF ranking if parsing fails
      return results.slice(0, 10).map((result, index) => ({
        chunk_id: result.chunk.id,
        content: result.chunk.content,
        page_number: result.chunk.page_number,
        relevance_score: result.rrfScore,
        citation: `[Doc p.${result.chunk.page_number}]`
      }));
    }
  }

  private selectFinalResults(results: RetrievalResult[]): RetrievalResult[] {
    const selectedResults: RetrievalResult[] = [];
    let totalTokens = 0;
    const maxTokens = ADMIN_CONTENT_CONFIG.RETRIEVAL.MAX_CONTEXT_TOKENS;
    const seenPages = new Set<number>();

    for (const result of results) {
      const resultTokens = this.estimateTokens(result.content);
      
      // Ensure diversity by page and respect token limits
      if (
        totalTokens + resultTokens <= maxTokens &&
        result.relevance_score >= ADMIN_CONTENT_CONFIG.RETRIEVAL.MIN_RELEVANCE_SCORE &&
        (!seenPages.has(result.page_number) || selectedResults.length < 3)
      ) {
        selectedResults.push(result);
        totalTokens += resultTokens;
        seenPages.add(result.page_number);
      }
    }

    return selectedResults;
  }

  private parseHyDEProbeResponse(response: string): HyDEProbe {
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback parsing if JSON is malformed
      const synopsis = this.extractSection(response, 'synopsis', 'SYNOPSIS');
      const question = this.extractSection(response, 'question', 'QUESTION');
      const answer = this.extractSection(response, 'answer', 'ANSWER');
      const anchorTerms = this.extractArraySection(response, 'anchor_terms', 'ANCHOR TERMS');

      return { synopsis, anchor_terms: anchorTerms, question, answer };
    }
  }

  private extractSection(text: string, key: string, fallbackKey?: string): string {
    const patterns = [
      new RegExp(`"${key}":\\s*"([^"]*)"`, 'i'),
      new RegExp(`${key}:([^\\n]*?)(?=\\n|$)`, 'i'),
      new RegExp(`${fallbackKey}:([^\\n]*?)(?=\\n|$)`, 'i')
    ].filter(Boolean);

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Content not found';
  }

  private extractArraySection(text: string, key: string, fallbackKey?: string): string[] {
    try {
      const arrayMatch = text.match(new RegExp(`"${key}":\\s*\\[([^\\]]*)\\]`, 'i'));
      if (arrayMatch) {
        return JSON.parse(`[${arrayMatch[1]}]`);
      }
    } catch (error) {
      // Fallback to comma-separated extraction
    }

    const lineMatch = text.match(new RegExp(`${fallbackKey || key}:([^\\n]*?)(?=\\n|$)`, 'i'));
    if (lineMatch) {
      return lineMatch[1].split(',').map(term => term.trim().replace(/['"]/g, ''));
    }

    return ['term1', 'term2', 'term3'];
  }

  private async callLLM(prompt: string, options: { temperature: number; max_tokens: number }): Promise<string> {
    // Mock LLM response for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (prompt.includes('Generate three complementary probes')) {
      return JSON.stringify({
        synopsis: "This lesson covers fundamental concepts in machine learning, focusing on supervised learning algorithms and their applications in classification and regression tasks. Students will learn about decision trees, linear models, and ensemble methods.",
        anchor_terms: ["supervised learning", "classification", "regression", "decision trees", "linear models", "ensemble methods", "training data", "feature engineering", "model validation", "cross-validation", "overfitting", "bias-variance tradeoff"],
        question: "What is the difference between classification and regression in supervised learning?",
        answer: "Classification and regression are two main types of supervised learning tasks. Classification involves predicting discrete categories or classes, such as determining whether an email is spam or not spam. The output is categorical and finite. Regression, on the other hand, involves predicting continuous numerical values, such as predicting house prices based on features like size and location. The output is a continuous value that can take any number within a range."
      });
    }

    return '[0, 2, 1, 4, 3]'; // Mock reranking response
  }

  private estimateTokens(text: string): number {
    return Math.floor(text.length / 4); // Rough estimation: 4 characters per token
  }
}