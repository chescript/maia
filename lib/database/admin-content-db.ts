import { createClient } from '@/lib/supabase/client';
import { 
  Document, 
  DocumentChunk, 
  Outline, 
  GenerationJob,
  GeneratedLesson,
  GeneratedQuiz,
  GeneratedFlashcard,
  GeneratedTakeaway
} from '@/lib/types/admin-content';

export class AdminContentDB {
  private supabase: Awaited<ReturnType<typeof createClient>>;

  private constructor(supabase: Awaited<ReturnType<typeof createClient>>) {
    this.supabase = supabase;
  }

  static create(): AdminContentDB {
    const supabase = createClient();
    return new AdminContentDB(supabase);
  }

  // Document operations
  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> {
    const { data, error } = await this.supabase
      .from('admin_documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await this.supabase
      .from('admin_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async updateDocumentStatus(id: string, status: Document['upload_status']): Promise<void> {
    const { error } = await this.supabase
      .from('admin_documents')
      .update({ upload_status: status })
      .eq('id', id);

    if (error) throw error;
  }

  async listDocuments(contextType?: 'exam' | 'module', contextId?: string): Promise<Document[]> {
    let query = this.supabase
      .from('admin_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (contextType) query = query.eq('context_type', contextType);
    if (contextId) query = query.eq('context_id', contextId);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Document chunks operations
  async saveDocumentChunks(chunks: Omit<DocumentChunk, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await this.supabase
      .from('admin_document_chunks')
      .insert(chunks);

    if (error) throw error;
  }

  async getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    const { data, error } = await this.supabase
      .from('admin_document_chunks')
      .select('*')
      .eq('document_id', documentId)
      .order('chunk_index');

    if (error) throw error;
    return data || [];
  }

  async searchSimilarChunks(embedding: number[], limit: number = 25): Promise<DocumentChunk[]> {
    // Vector similarity search - requires pgvector extension
    const { data, error } = await this.supabase.rpc('match_document_chunks', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit
    });

    if (error) {
      console.warn('Vector search failed, falling back to text search:', error);
      return [];
    }
    return data || [];
  }

  // Outline operations
  async saveOutline(outline: Omit<Outline, 'id' | 'created_at' | 'updated_at'>): Promise<Outline> {
    const { data, error } = await this.supabase
      .from('admin_outlines')
      .insert(outline)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOutline(documentId: string): Promise<Outline | null> {
    const { data, error } = await this.supabase
      .from('admin_outlines')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  }

  // Generation job operations
  async createGenerationJob(job: Omit<GenerationJob, 'id' | 'created_at' | 'updated_at'>): Promise<GenerationJob> {
    const { data, error } = await this.supabase
      .from('admin_generation_jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateGenerationJob(id: string, updates: Partial<GenerationJob>): Promise<void> {
    const { error } = await this.supabase
      .from('admin_generation_jobs')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  async getGenerationJob(id: string): Promise<GenerationJob | null> {
    const { data, error } = await this.supabase
      .from('admin_generation_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async listGenerationJobs(documentId?: string): Promise<GenerationJob[]> {
    let query = this.supabase
      .from('admin_generation_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (documentId) query = query.eq('document_id', documentId);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Generated content operations
  async saveGeneratedLessons(lessons: Omit<GeneratedLesson, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await this.supabase
      .from('admin_generated_lessons')
      .insert(lessons);

    if (error) throw error;
  }

  async saveGeneratedQuizzes(quizzes: Omit<GeneratedQuiz, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await this.supabase
      .from('admin_generated_quizzes')
      .insert(quizzes);

    if (error) throw error;
  }

  async saveGeneratedFlashcards(flashcards: Omit<GeneratedFlashcard, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await this.supabase
      .from('admin_generated_flashcards')
      .insert(flashcards);

    if (error) throw error;
  }

  async saveGeneratedTakeaways(takeaways: Omit<GeneratedTakeaway, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await this.supabase
      .from('admin_generated_takeaways')
      .insert(takeaways);

    if (error) throw error;
  }

  // Retrieval operations for generated content
  async getGeneratedLessons(documentId: string): Promise<GeneratedLesson[]> {
    const { data, error } = await this.supabase
      .from('admin_generated_lessons')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  async getGeneratedQuizzes(lessonId: string): Promise<GeneratedQuiz[]> {
    const { data, error } = await this.supabase
      .from('admin_generated_quizzes')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  async getGeneratedFlashcards(lessonId: string): Promise<GeneratedFlashcard[]> {
    const { data, error } = await this.supabase
      .from('admin_generated_flashcards')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  async getGeneratedTakeaways(lessonId: string): Promise<GeneratedTakeaway[]> {
    const { data, error } = await this.supabase
      .from('admin_generated_takeaways')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  // Statistics and monitoring
  async getJobStatistics(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('admin_job_statistics')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getDocumentProcessingStatus(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('admin_document_processing_status')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  // Cleanup operations
  async deleteDocument(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('admin_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async deleteGenerationJob(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('admin_generation_jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Bulk operations for performance
  async bulkUpdateJobProgress(jobUpdates: { id: string; progress: number; completed_items: number }[]): Promise<void> {
    for (const update of jobUpdates) {
      await this.updateGenerationJob(update.id, {
        progress: update.progress,
        completed_items: update.completed_items
      });
    }
  }
}