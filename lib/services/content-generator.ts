import { 
  GeneratedLesson, 
  GeneratedQuiz, 
  QuizQuestion, 
  GeneratedFlashcard, 
  GeneratedTakeaway,
  OutlineLesson,
  RetrievalResult,
  GenerationJob
} from '@/lib/types/admin-content';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';
import { HyDERAGService } from './hyde-rag';

export class ContentGenerator {
  private hydeRag: HyDERAGService;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.hydeRag = new HyDERAGService(apiKey);
  }

  async generateLessons(
    outlineLessons: OutlineLesson[],
    documentChunks: any[],
    batchSize: number = ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.lessons,
    onProgress?: (completed: number, total: number) => void
  ): Promise<GeneratedLesson[]> {
    const lessons: GeneratedLesson[] = [];
    
    for (let i = 0; i < outlineLessons.length; i += batchSize) {
      const batch = outlineLessons.slice(i, i + batchSize);
      const batchLessons = await Promise.all(
        batch.map(lesson => this.generateSingleLesson(lesson, documentChunks))
      );
      
      lessons.push(...batchLessons);
      onProgress?.(lessons.length, outlineLessons.length);
      
      // Small delay to prevent rate limiting
      await this.delay(500);
    }
    
    return lessons;
  }

  async generateQuizzes(
    lessons: GeneratedLesson[],
    outlineLessons: OutlineLesson[],
    documentChunks: any[],
    batchSize: number = ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.quizzes,
    onProgress?: (completed: number, total: number) => void
  ): Promise<GeneratedQuiz[]> {
    const quizzes: GeneratedQuiz[] = [];
    
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const outlineLesson = outlineLessons.find(ol => ol.id === lesson.outline_lesson_id);
      
      if (outlineLesson) {
        const quiz = await this.generateSingleQuiz(lesson, outlineLesson, documentChunks, batchSize);
        quizzes.push(quiz);
        onProgress?.(quizzes.length, lessons.length);
        
        await this.delay(500);
      }
    }
    
    return quizzes;
  }

  async generateFlashcards(
    lessons: GeneratedLesson[],
    outlineLessons: OutlineLesson[],
    documentChunks: any[],
    batchSize: number = ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.flashcards,
    onProgress?: (completed: number, total: number) => void
  ): Promise<GeneratedFlashcard[]> {
    const allFlashcards: GeneratedFlashcard[] = [];
    
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const outlineLesson = outlineLessons.find(ol => ol.id === lesson.outline_lesson_id);
      
      if (outlineLesson) {
        const flashcards = await this.generateLessonFlashcards(lesson, outlineLesson, documentChunks, batchSize);
        allFlashcards.push(...flashcards);
        onProgress?.(i + 1, lessons.length);
        
        await this.delay(300);
      }
    }
    
    return allFlashcards;
  }

  async generateTakeaways(
    lessons: GeneratedLesson[],
    outlineLessons: OutlineLesson[],
    documentChunks: any[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<GeneratedTakeaway[]> {
    const takeaways: GeneratedTakeaway[] = [];
    
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const outlineLesson = outlineLessons.find(ol => ol.id === lesson.outline_lesson_id);
      
      if (outlineLesson) {
        const takeaway = await this.generateLessonTakeaways(lesson, outlineLesson, documentChunks);
        takeaways.push(takeaway);
        onProgress?.(takeaways.length, lessons.length);
        
        await this.delay(300);
      }
    }
    
    return takeaways;
  }

  private async generateSingleLesson(
    outlineLesson: OutlineLesson,
    documentChunks: any[]
  ): Promise<GeneratedLesson> {
    // Step 1: Generate HyDE probes for retrieval
    const probe = await this.hydeRag.generateOutlineProbes(outlineLesson);
    
    // Step 2: Retrieve relevant context
    const retrievedContext = await this.hydeRag.retrieveRelevantContext(probe, documentChunks);
    
    // Step 3: Generate lesson content
    const lessonPrompt = this.buildLessonPrompt(outlineLesson, retrievedContext);
    const response = await this.callLLM(lessonPrompt, {
      temperature: 0.4,
      max_tokens: 1500
    });
    
    const parsedLesson = this.parseLessonResponse(response);
    
    return {
      id: crypto.randomUUID(),
      outline_lesson_id: outlineLesson.id,
      title: outlineLesson.title,
      objectives: outlineLesson.learning_objectives,
      content: parsedLesson.content,
      pitfalls: parsedLesson.pitfalls,
      citations: parsedLesson.citations,
      created_at: new Date().toISOString()
    };
  }

  private async generateSingleQuiz(
    lesson: GeneratedLesson,
    outlineLesson: OutlineLesson,
    documentChunks: any[],
    questionsCount: number
  ): Promise<GeneratedQuiz> {
    const probe = await this.hydeRag.generateOutlineProbes(outlineLesson);
    const retrievedContext = await this.hydeRag.retrieveRelevantContext(probe, documentChunks);
    
    const quizPrompt = this.buildQuizPrompt(lesson, outlineLesson, retrievedContext, questionsCount);
    const response = await this.callLLM(quizPrompt, {
      temperature: 0.3,
      max_tokens: 2000
    });
    
    const questions = this.parseQuizResponse(response);
    
    return {
      id: crypto.randomUUID(),
      lesson_id: lesson.id,
      questions,
      created_at: new Date().toISOString()
    };
  }

  private async generateLessonFlashcards(
    lesson: GeneratedLesson,
    outlineLesson: OutlineLesson,
    documentChunks: any[],
    count: number
  ): Promise<GeneratedFlashcard[]> {
    const probe = await this.hydeRag.generateOutlineProbes(outlineLesson);
    const retrievedContext = await this.hydeRag.retrieveRelevantContext(probe, documentChunks);
    
    const flashcardPrompt = this.buildFlashcardPrompt(lesson, outlineLesson, retrievedContext, count);
    const response = await this.callLLM(flashcardPrompt, {
      temperature: 0.2,
      max_tokens: 1200
    });
    
    return this.parseFlashcardResponse(response, lesson.id);
  }

  private async generateLessonTakeaways(
    lesson: GeneratedLesson,
    outlineLesson: OutlineLesson,
    documentChunks: any[]
  ): Promise<GeneratedTakeaway> {
    const probe = await this.hydeRag.generateOutlineProbes(outlineLesson);
    const retrievedContext = await this.hydeRag.retrieveRelevantContext(probe, documentChunks);
    
    const takeawayPrompt = this.buildTakeawayPrompt(lesson, outlineLesson, retrievedContext);
    const response = await this.callLLM(takeawayPrompt, {
      temperature: 0.3,
      max_tokens: 600
    });
    
    const parsedTakeaways = this.parseTakeawayResponse(response);
    
    return {
      id: crypto.randomUUID(),
      lesson_id: lesson.id,
      takeaways: parsedTakeaways.takeaways,
      citations: parsedTakeaways.citations,
      created_at: new Date().toISOString()
    };
  }

  private buildLessonPrompt(outlineLesson: OutlineLesson, context: RetrievalResult[]): string {
    const contextText = context.map(c => `${c.content} ${c.citation}`).join('\n\n');
    
    return `Create a comprehensive lesson based on this outline and source material.

LESSON: ${outlineLesson.title}
DESCRIPTION: ${outlineLesson.description}
CONCEPTS: ${outlineLesson.concepts.join(', ')}
LEARNING OBJECTIVES: ${outlineLesson.learning_objectives.join('; ')}

SOURCE MATERIAL:
${contextText}

Create a lesson with:
1. CONTENT: Detailed explanation covering all concepts (800-1200 words)
2. PITFALLS: Common mistakes or misconceptions students should avoid
3. CITATIONS: Reference specific sources using the provided citation format

Format as JSON:
{
  "content": "Detailed lesson content with inline citations...",
  "pitfalls": ["Common mistake 1", "Misconception 2", ...],
  "citations": ["[Doc p.X]", "[Doc p.Y]", ...]
}

Requirements:
- Ground all claims in the provided source material
- Use inline citations throughout the content
- Focus on practical understanding and application
- Address the learning objectives explicitly`;
  }

  private buildQuizPrompt(
    lesson: GeneratedLesson,
    outlineLesson: OutlineLesson,
    context: RetrievalResult[],
    questionCount: number
  ): string {
    const contextText = context.map(c => `${c.content} ${c.citation}`).join('\n\n');
    
    return `Create ${questionCount} multiple choice questions for this lesson.

LESSON: ${lesson.title}
CONCEPTS: ${outlineLesson.concepts.join(', ')}
OBJECTIVES: ${outlineLesson.learning_objectives.join('; ')}

SOURCE MATERIAL:
${contextText}

Create questions that:
- Test understanding of key concepts
- Have 4 answer choices each
- Include detailed rationale explaining why the correct answer is right
- Include citations to source material

Format as JSON array:
[
  {
    "question": "Question text?",
    "choices": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correct_answer": 0,
    "rationale": "Explanation with citation...",
    "citation": "[Doc p.X]"
  }
]

Make questions challenging but fair, covering different difficulty levels.`;
  }

  private buildFlashcardPrompt(
    lesson: GeneratedLesson,
    outlineLesson: OutlineLesson,
    context: RetrievalResult[],
    count: number
  ): string {
    const contextText = context.map(c => `${c.content} ${c.citation}`).join('\n\n');
    
    return `Create ${count} flashcards for this lesson.

LESSON: ${lesson.title}
CONCEPTS: ${outlineLesson.concepts.join(', ')}

SOURCE MATERIAL:
${contextText}

Create concise Q&A pairs covering:
- Key definitions
- Important processes
- Critical relationships
- Practical applications

Format as JSON array:
[
  {
    "question": "Concise question?",
    "answer": "Clear, focused answer",
    "citation": "[Doc p.X]"
  }
]

Keep answers under 50 words. Include citations when referencing specific facts.`;
  }

  private buildTakeawayPrompt(
    lesson: GeneratedLesson,
    outlineLesson: OutlineLesson,
    context: RetrievalResult[]
  ): string {
    const contextText = context.map(c => `${c.content} ${c.citation}`).join('\n\n');
    
    return `Create 5 key takeaways for this lesson (max 20 words each).

LESSON: ${lesson.title}
CONCEPTS: ${outlineLesson.concepts.join(', ')}

SOURCE MATERIAL:
${contextText}

Format as JSON:
{
  "takeaways": ["Takeaway 1", "Takeaway 2", ...],
  "citations": ["[Doc p.X]", "[Doc p.Y]", ...]
}

Focus on the most important, memorable points that students should retain.`;
  }

  private parseLessonResponse(response: string): { content: string; pitfalls: string[]; citations: string[] } {
    try {
      return JSON.parse(response);
    } catch {
      return {
        content: response.slice(0, 1000) + '...',
        pitfalls: ['Review source material carefully'],
        citations: ['[Doc p.1]']
      };
    }
  }

  private parseQuizResponse(response: string): QuizQuestion[] {
    try {
      const questions = JSON.parse(response);
      return questions.map((q: any) => ({
        id: crypto.randomUUID(),
        question: q.question,
        choices: q.choices,
        correct_answer: q.correct_answer,
        rationale: q.rationale,
        citation: q.citation
      }));
    } catch {
      return [{
        id: crypto.randomUUID(),
        question: 'What is the main concept covered in this lesson?',
        choices: ['A) Concept 1', 'B) Concept 2', 'C) Concept 3', 'D) Concept 4'],
        correct_answer: 0,
        rationale: 'Based on the lesson content.',
        citation: '[Doc p.1]'
      }];
    }
  }

  private parseFlashcardResponse(response: string, lessonId: string): GeneratedFlashcard[] {
    try {
      const flashcards = JSON.parse(response);
      return flashcards.map((f: any) => ({
        id: crypto.randomUUID(),
        lesson_id: lessonId,
        question: f.question,
        answer: f.answer,
        citation: f.citation,
        created_at: new Date().toISOString()
      }));
    } catch {
      return [{
        id: crypto.randomUUID(),
        lesson_id: lessonId,
        question: 'What is the key concept?',
        answer: 'The main concept from this lesson.',
        citation: '[Doc p.1]',
        created_at: new Date().toISOString()
      }];
    }
  }

  private parseTakeawayResponse(response: string): { takeaways: string[]; citations: string[] } {
    try {
      return JSON.parse(response);
    } catch {
      return {
        takeaways: ['Key concept from the lesson'],
        citations: ['[Doc p.1]']
      };
    }
  }

  private async callLLM(prompt: string, options: { temperature: number; max_tokens: number }): Promise<string> {
    // Mock responses for demonstration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (prompt.includes('Create a comprehensive lesson')) {
      return JSON.stringify({
        content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed [Doc p.5]. The field encompasses various approaches including supervised learning, where algorithms learn from labeled examples [Doc p.7], and unsupervised learning, which finds patterns in unlabeled data [Doc p.12]. Key concepts include training datasets, feature selection, and model validation [Doc p.15]. Understanding these fundamentals is crucial for applying ML techniques effectively in real-world scenarios.",
        pitfalls: [
          "Confusing correlation with causation in data analysis",
          "Overfitting models to training data without proper validation",
          "Ignoring data quality and preprocessing steps"
        ],
        citations: ["[Doc p.5]", "[Doc p.7]", "[Doc p.12]", "[Doc p.15]"]
      });
    }
    
    if (prompt.includes('multiple choice questions')) {
      return JSON.stringify([
        {
          question: "What is the primary difference between supervised and unsupervised learning?",
          choices: [
            "A) Supervised learning uses labeled data, unsupervised uses unlabeled data",
            "B) Supervised learning is faster than unsupervised learning",
            "C) Supervised learning requires more computational power",
            "D) There is no significant difference between them"
          ],
          correct_answer: 0,
          rationale: "Supervised learning algorithms learn from labeled examples where the correct output is provided, while unsupervised learning finds patterns in data without labeled examples [Doc p.7].",
          citation: "[Doc p.7]"
        }
      ]);
    }
    
    if (prompt.includes('flashcards')) {
      return JSON.stringify([
        {
          question: "What is machine learning?",
          answer: "A subset of AI that enables computers to learn from data without explicit programming.",
          citation: "[Doc p.5]"
        },
        {
          question: "What is supervised learning?",
          answer: "Learning approach that uses labeled examples to train algorithms.",
          citation: "[Doc p.7]"
        }
      ]);
    }
    
    if (prompt.includes('key takeaways')) {
      return JSON.stringify({
        takeaways: [
          "Machine learning enables computers to learn from data automatically",
          "Supervised learning requires labeled training examples",
          "Data quality significantly impacts model performance",
          "Feature selection is crucial for effective ML models",
          "Model validation prevents overfitting issues"
        ],
        citations: ["[Doc p.5]", "[Doc p.7]", "[Doc p.12]", "[Doc p.15]", "[Doc p.18]"]
      });
    }
    
    return '{}';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}