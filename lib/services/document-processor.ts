import { Document, DocumentChunk, IngestionProgress } from '@/lib/types/admin-content';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';
import { AdminContentDB } from '@/lib/database/admin-content-db';

export class DocumentProcessor {
  private onProgress?: (progress: IngestionProgress) => void;

  constructor(onProgress?: (progress: IngestionProgress) => void) {
    this.onProgress = onProgress;
  }

  async processDocument(file: File, contextType: 'exam' | 'module', contextId: string): Promise<Document> {
    const documentId = crypto.randomUUID();
    
    try {
      // Stage 1: Upload
      this.updateProgress('uploading', 10, 'Uploading file...');
      const filePath = await this.uploadFile(file);
      
      // Stage 2: Extract text
      this.updateProgress('extracting', 30, 'Extracting text content...');
      const { text, pages, headings } = await this.extractText(filePath, file.type);
      
      // Stage 3: Chunk text
      this.updateProgress('chunking', 50, 'Creating text chunks...');
      const chunks = await this.chunkText(text, documentId);
      
      // Stage 4: Generate embeddings
      this.updateProgress('embedding', 70, `Generating embeddings for ${chunks.length} chunks...`);
      const chunksWithEmbeddings = await this.generateEmbeddings(chunks);
      
      // Stage 5: Index in database
      this.updateProgress('indexing', 90, 'Indexing in database...');
      const document = await this.saveToDatabase(
        documentId,
        file,
        filePath,
        pages,
        contextType,
        contextId,
        chunksWithEmbeddings
      );
      
      // Show preview
      const tokenEstimate = chunks.reduce((sum, chunk) => sum + chunk.token_count, 0);
      this.updateProgress('indexing', 100, 'Indexing complete!', {
        headings: headings.slice(0, 10),
        pages,
        token_estimate: tokenEstimate
      });
      
      return document;
    } catch (error) {
      console.error('Document processing failed:', error);
      throw error;
    }
  }

  private async uploadFile(file: File): Promise<string> {
    // In a real implementation, upload to your storage service (e.g., Supabase Storage)
    // For now, we'll simulate this
    await this.delay(1000);
    return `documents/${crypto.randomUUID()}-${file.name}`;
  }

  private async extractText(filePath: string, mimeType: string): Promise<{
    text: string;
    pages: number;
    headings: string[];
  }> {
    // This would use libraries like pdf-parse for PDFs or mammoth for DOCX
    // Simulating extraction for now
    await this.delay(2000);
    
    const mockText = "This is extracted text content from the document. ".repeat(1000);
    const mockHeadings = [
      "Chapter 1: Introduction",
      "Chapter 2: Core Concepts", 
      "Chapter 3: Advanced Topics",
      "Chapter 4: Applications",
      "Chapter 5: Conclusion"
    ];
    
    return {
      text: mockText,
      pages: 25,
      headings: mockHeadings
    };
  }

  private async chunkText(text: string, documentId: string): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    const chunkSize = ADMIN_CONTENT_CONFIG.CHUNKING.CHUNK_SIZE;
    const overlap = ADMIN_CONTENT_CONFIG.CHUNKING.OVERLAP_SIZE;
    
    // Simple token-based chunking (in real implementation, use proper tokenizer)
    const words = text.split(' ');
    const tokensPerWord = 1.3; // rough estimate
    const wordsPerChunk = Math.floor(chunkSize / tokensPerWord);
    const overlapWords = Math.floor(overlap / tokensPerWord);
    
    let chunkIndex = 0;
    let currentPage = 1;
    
    for (let i = 0; i < words.length; i += (wordsPerChunk - overlapWords)) {
      const chunkWords = words.slice(i, i + wordsPerChunk);
      const content = chunkWords.join(' ');
      const tokenCount = Math.floor(chunkWords.length * tokensPerWord);
      
      chunks.push({
        id: crypto.randomUUID(),
        document_id: documentId,
        content,
        page_number: currentPage,
        chunk_index: chunkIndex,
        token_count: tokenCount,
        created_at: new Date().toISOString()
      });
      
      chunkIndex++;
      // Simulate page progression
      if (chunkIndex % 4 === 0) currentPage++;
    }
    
    return chunks;
  }

  private async generateEmbeddings(chunks: DocumentChunk[]): Promise<DocumentChunk[]> {
    // This would call OpenAI's embedding API or similar
    // Simulating embeddings generation
    const chunksWithEmbeddings = chunks.map(chunk => ({
      ...chunk,
      embedding: Array.from({ length: 1536 }, () => Math.random() - 0.5) // Mock embedding
    }));
    
    await this.delay(3000);
    return chunksWithEmbeddings;
  }

  private async saveToDatabase(
    documentId: string,
    file: File,
    filePath: string,
    pages: number,
    contextType: 'exam' | 'module',
    contextId: string,
    chunks: DocumentChunk[]
  ): Promise<Document> {
    const db = AdminContentDB.create();
    
    // Create document record
    const document = await db.createDocument({
      name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      pages,
      upload_status: 'indexed',
      context_type: contextType,
      context_id: contextId
    });
    
    // Save document chunks
    if (chunks.length > 0) {
      await db.saveDocumentChunks(chunks.map(chunk => ({
        document_id: document.id,
        content: chunk.content,
        page_number: chunk.page_number,
        chunk_index: chunk.chunk_index,
        token_count: chunk.token_count,
        embedding: chunk.embedding
      })));
    }
    
    return document;
  }

  private updateProgress(
    stage: IngestionProgress['stage'],
    progress: number,
    message: string,
    preview?: IngestionProgress['preview']
  ) {
    if (this.onProgress) {
      this.onProgress({ stage, progress, message, preview });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}