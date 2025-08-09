-- Maia Admin Content System Database Schema
-- This schema extends the existing database to support document ingestion and content generation

-- Documents table for uploaded files
CREATE TABLE IF NOT EXISTS admin_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  pages INTEGER DEFAULT 0,
  upload_status TEXT NOT NULL DEFAULT 'uploading' 
    CHECK (upload_status IN ('uploading', 'uploaded', 'extracted', 'chunked', 'embedded', 'indexed', 'failed')),
  context_type TEXT NOT NULL DEFAULT 'exam' 
    CHECK (context_type IN ('exam', 'module')),
  context_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document chunks for RAG retrieval
CREATE TABLE IF NOT EXISTS admin_document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES admin_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page_number INTEGER DEFAULT 1,
  chunk_index INTEGER NOT NULL,
  token_count INTEGER DEFAULT 0,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated outlines
CREATE TABLE IF NOT EXISTS admin_outlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES admin_documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generation jobs for tracking progress
CREATE TABLE IF NOT EXISTS admin_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES admin_documents(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL 
    CHECK (job_type IN ('outline', 'lessons', 'quizzes', 'flashcards', 'takeaways')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  cursor TEXT, -- Resume point for interrupted jobs
  batch_size INTEGER DEFAULT 1,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  cost_estimate DECIMAL(10,6),
  token_usage JSONB, -- {input: number, output: number}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated lessons
CREATE TABLE IF NOT EXISTS admin_generated_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outline_lesson_id TEXT NOT NULL, -- References outline JSON structure
  document_id UUID NOT NULL REFERENCES admin_documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  objectives JSONB DEFAULT '[]'::jsonb,
  content TEXT NOT NULL,
  pitfalls JSONB DEFAULT '[]'::jsonb,
  citations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated quizzes
CREATE TABLE IF NOT EXISTS admin_generated_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES admin_generated_lessons(id) ON DELETE CASCADE,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated flashcards
CREATE TABLE IF NOT EXISTS admin_generated_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES admin_generated_lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  citation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated takeaways
CREATE TABLE IF NOT EXISTS admin_generated_takeaways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES admin_generated_lessons(id) ON DELETE CASCADE,
  takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_documents_context ON admin_documents(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_admin_documents_status ON admin_documents(upload_status);
CREATE INDEX IF NOT EXISTS idx_admin_document_chunks_document_id ON admin_document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_admin_document_chunks_page ON admin_document_chunks(document_id, page_number);
CREATE INDEX IF NOT EXISTS idx_admin_outlines_document_id ON admin_outlines(document_id);
CREATE INDEX IF NOT EXISTS idx_admin_generation_jobs_document_id ON admin_generation_jobs(document_id);
CREATE INDEX IF NOT EXISTS idx_admin_generation_jobs_status ON admin_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_admin_generation_jobs_type ON admin_generation_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_admin_generated_lessons_document_id ON admin_generated_lessons(document_id);
CREATE INDEX IF NOT EXISTS idx_admin_generated_quizzes_lesson_id ON admin_generated_quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_admin_generated_flashcards_lesson_id ON admin_generated_flashcards(lesson_id);
CREATE INDEX IF NOT EXISTS idx_admin_generated_takeaways_lesson_id ON admin_generated_takeaways(lesson_id);

-- Vector similarity search index (requires pgvector extension)
-- CREATE INDEX IF NOT EXISTS idx_admin_document_chunks_embedding ON admin_document_chunks 
-- USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS (Row Level Security) policies
ALTER TABLE admin_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_generated_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_generated_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_generated_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_generated_takeaways ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin documents access" ON admin_documents
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin document chunks access" ON admin_document_chunks
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin outlines access" ON admin_outlines
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin generation jobs access" ON admin_generation_jobs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin generated lessons access" ON admin_generated_lessons
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin generated quizzes access" ON admin_generated_quizzes
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin generated flashcards access" ON admin_generated_flashcards
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin generated takeaways access" ON admin_generated_takeaways
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_admin_documents_updated_at 
  BEFORE UPDATE ON admin_documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_outlines_updated_at 
  BEFORE UPDATE ON admin_outlines 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_generation_jobs_updated_at 
  BEFORE UPDATE ON admin_generation_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for job statistics
CREATE OR REPLACE VIEW admin_job_statistics AS
SELECT 
  job_type,
  COUNT(*) as total_jobs,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
  COUNT(CASE WHEN status = 'running' THEN 1 END) as running_jobs,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_jobs,
  COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_jobs,
  AVG(CASE WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (completed_at - started_at)) END) as avg_duration_seconds,
  SUM(COALESCE(cost_estimate, 0)) as total_estimated_cost,
  SUM(COALESCE((token_usage->>'input')::integer, 0)) as total_input_tokens,
  SUM(COALESCE((token_usage->>'output')::integer, 0)) as total_output_tokens
FROM admin_generation_jobs
GROUP BY job_type;

-- View for document processing status
CREATE OR REPLACE VIEW admin_document_processing_status AS
SELECT 
  d.*,
  COUNT(c.id) as chunk_count,
  COUNT(o.id) as outline_count,
  COUNT(l.id) as lesson_count,
  COUNT(DISTINCT j.id) as job_count,
  COUNT(CASE WHEN j.status = 'running' THEN 1 END) as active_jobs
FROM admin_documents d
LEFT JOIN admin_document_chunks c ON d.id = c.document_id
LEFT JOIN admin_outlines o ON d.id = o.document_id  
LEFT JOIN admin_generated_lessons l ON d.id = l.document_id
LEFT JOIN admin_generation_jobs j ON d.id = j.document_id
GROUP BY d.id;