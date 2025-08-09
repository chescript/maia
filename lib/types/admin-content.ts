export interface Document {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  pages: number;
  upload_status: 'uploading' | 'uploaded' | 'extracted' | 'chunked' | 'embedded' | 'indexed' | 'failed';
  created_at: string;
  updated_at: string;
  context_type: 'exam' | 'module';
  context_id: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  page_number: number;
  chunk_index: number;
  token_count: number;
  embedding?: number[];
  created_at: string;
}

export interface Outline {
  id: string;
  document_id: string;
  title: string;
  modules: OutlineModule[];
  created_at: string;
  updated_at: string;
}

export interface OutlineModule {
  id: string;
  title: string;
  description: string;
  lessons: OutlineLesson[];
  order_index: number;
}

export interface OutlineLesson {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  learning_objectives: string[];
  order_index: number;
}

export interface GenerationJob {
  id: string;
  document_id: string;
  job_type: 'outline' | 'lessons' | 'quizzes' | 'flashcards' | 'takeaways';
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number;
  cursor?: string;
  batch_size: number;
  total_items: number;
  completed_items: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  cost_estimate?: number;
  token_usage?: {
    input: number;
    output: number;
  };
}

export interface HyDEProbe {
  synopsis: string;
  anchor_terms: string[];
  question: string;
  answer: string;
}

export interface RetrievalResult {
  chunk_id: string;
  content: string;
  page_number: number;
  relevance_score: number;
  citation: string;
}

export interface GeneratedLesson {
  id: string;
  outline_lesson_id: string;
  title: string;
  objectives: string[];
  content: string;
  pitfalls: string[];
  citations: string[];
  created_at: string;
}

export interface GeneratedQuiz {
  id: string;
  lesson_id: string;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correct_answer: number;
  rationale: string;
  citation: string;
}

export interface GeneratedFlashcard {
  id: string;
  lesson_id: string;
  question: string;
  answer: string;
  citation?: string;
  created_at: string;
}

export interface GeneratedTakeaway {
  id: string;
  lesson_id: string;
  takeaways: string[];
  citations: string[];
  created_at: string;
}

export interface IngestionProgress {
  stage: 'uploading' | 'extracting' | 'chunking' | 'embedding' | 'indexing';
  progress: number;
  message: string;
  preview?: {
    headings: string[];
    pages: number;
    token_estimate: number;
  };
}