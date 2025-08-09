# Maia Admin Content System Implementation

## Overview

The Maia Admin Content System is a comprehensive document ingestion and educational content generation platform built with **HyDE (Hypothetical Document Embeddings) RAG** and **piece-meal generation** capabilities. This system allows administrators to upload documents (PDF/DOCX) and automatically generate structured educational content including lessons, quizzes, flashcards, and key takeaways.

## 🚀 Key Features

### Core Functionality
- **Document Ingestion Pipeline**: Upload, extract, chunk, embed, and index documents
- **HyDE RAG System**: Advanced retrieval using outline-anchored hypothetical document probes
- **Piece-meal Generation**: Generate content in batches with configurable sizes
- **Job Management**: Resumable jobs with 15-minute time limits and auto-pause
- **Multi-format Support**: PDF and DOCX document processing
- **Real-time Progress**: Live updates during ingestion and generation

### Content Generation
- **Structured Outlines**: Auto-generated hierarchical outlines with modules and lessons
- **Detailed Lessons**: Comprehensive lesson content with citations and common pitfalls
- **Interactive Quizzes**: Multiple choice questions with detailed rationales
- **Study Flashcards**: Concise Q&A pairs for quick review
- **Key Takeaways**: Bullet-point summaries with source citations

### Advanced Features
- **Resume Functionality**: Continue interrupted jobs from exact stopping points
- **Cost Tracking**: Real-time monitoring of API usage and costs
- **Observability**: Comprehensive logging, metrics, and performance tracking
- **Admin Security**: Role-based access control with Supabase RLS

## 🏗️ Architecture

### Frontend Components
```
app/admin/content/page.tsx              # Main admin content page
components/admin/
├── ContentSystemDashboard.tsx          # Main dashboard with tabs
├── DocumentUpload.tsx                  # File upload and ingestion
├── OutlineViewer.tsx                   # Outline generation and display
├── GenerationControls.tsx              # Content generation controls
└── JobHistoryViewer.tsx                # Job monitoring and history
```

### Backend Services
```
lib/services/
├── document-processor.ts               # Document ingestion pipeline
├── hyde-rag.ts                        # HyDE RAG retrieval system
├── outline-generator.ts               # Outline creation service
├── content-generator.ts               # Content generation service
├── job-manager.ts                     # Job lifecycle management
└── observability-service.ts           # Logging and monitoring
```

### Configuration & Types
```
lib/
├── types/admin-content.ts             # TypeScript interfaces
├── config/admin-content.ts            # System configuration
└── database/
    ├── schema.sql                     # Database schema
    └── admin-content-db.ts            # Database operations
```

## 🗄️ Database Schema

### Required Database Changes

#### New Tables to Create

Run the following SQL to set up the admin content system:

```sql
-- Execute the complete schema from lib/database/schema.sql
\i lib/database/schema.sql
```

#### Key Tables Added:

1. **`admin_documents`** - Stores uploaded document metadata
2. **`admin_document_chunks`** - Text chunks with embeddings for RAG
3. **`admin_outlines`** - Generated document outlines (JSON structure)
4. **`admin_generation_jobs`** - Job tracking with resume capabilities
5. **`admin_generated_lessons`** - Generated lesson content
6. **`admin_generated_quizzes`** - Quiz questions with rationales
7. **`admin_generated_flashcards`** - Study flashcards
8. **`admin_generated_takeaways`** - Key takeaways with citations

#### Required Extensions

```sql
-- Enable vector similarity search (optional but recommended)
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Database Views

- **`admin_job_statistics`** - Aggregated job metrics by type
- **`admin_document_processing_status`** - Document status with counts

## ⚙️ Configuration

### Environment Variables

Add these to your `.env.local`:

```bash
# OpenAI API (for content generation and embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### System Configuration

The system is configured in `lib/config/admin-content.ts`:

```typescript
export const ADMIN_CONTENT_CONFIG = {
  UPLOAD: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['.pdf', '.docx'],
  },
  GENERATION: {
    MAX_JOB_DURATION: 15 * 60 * 1000, // 15 minutes
    DEFAULT_BATCH_SIZES: {
      lessons: 2,
      quizzes: 4,
      flashcards: 10,
      takeaways: 5
    }
  },
  RETRIEVAL: {
    VECTOR_TOP_K: 25,
    MAX_CONTEXT_TOKENS: 1200,
  }
}
```

## 🚦 Getting Started

### 1. Database Setup

```sql
-- Connect to your Supabase database and run:
\i lib/database/schema.sql
```

### 2. Install Dependencies

The system uses existing project dependencies. If you need additional document processing libraries:

```bash
# For PDF processing (future enhancement)
npm install pdf-parse

# For DOCX processing (future enhancement)  
npm install mammoth
```

### 3. Access the System

1. Navigate to `/admin/content` (admin access required)
2. Upload a PDF or DOCX document
3. Wait for ingestion to complete
4. Generate an outline
5. Use generation controls to create content

## 📋 Usage Workflow

### Document Ingestion
1. **Upload**: Select PDF/DOCX file and set context (exam/module)
2. **Extract**: Text extraction with page references
3. **Chunk**: Split into ~1k token chunks with overlap
4. **Embed**: Generate vector embeddings
5. **Index**: Store in database with search capabilities

### Content Generation
1. **Outline**: Generate hierarchical structure from document
2. **HyDE Probes**: Create synopsis, anchor terms, and Q&A for each lesson
3. **Retrieval**: Use probes to find relevant document chunks
4. **Generation**: Create lessons, quizzes, flashcards, and takeaways
5. **Citations**: All content includes source references

### Job Management
- **Time Limits**: Jobs auto-pause at 13-minute warning threshold
- **Resume**: Continue from exact cursor position
- **Monitoring**: Real-time progress and cost tracking
- **History**: Complete job logs with performance metrics

## 🔧 Technical Details

### HyDE RAG Implementation

The system uses **Hypothetical Document Embeddings (HyDE)** for improved retrieval:

1. **Synopsis Generation**: Create 200-300 word overviews for each lesson topic
2. **Anchor Terms**: Extract 12-20 key technical terms
3. **Q&A Pairs**: Generate question-answer pairs that would appear in educational content
4. **Multi-vector Search**: Use all three probes for comprehensive retrieval
5. **Reciprocal Rank Fusion**: Combine and re-rank results
6. **LLM Re-ranking**: Final ranking by coverage, specificity, and authority

### Piece-meal Generation

Content is generated in configurable batches:
- **Lessons**: 2-3 per batch (detailed content generation)
- **Quizzes**: 4-6 questions per lesson
- **Flashcards**: 10-20 per lesson  
- **Takeaways**: 5 key points per lesson

### Resume Functionality

Jobs can be paused and resumed using base64-encoded cursors:
```typescript
interface Cursor {
  jobType: string;
  completedItems: number;
  batchSize: number;
  timestamp: string;
}
```

## 🔒 Security

### Access Control
- **Admin Only**: All tables use Supabase RLS with admin role requirement
- **File Validation**: Strict file type and size limits
- **Input Sanitization**: All user inputs validated and sanitized

### Data Protection
- **Sensitive Content**: No secrets or API keys in generated content
- **Audit Logging**: All operations logged with timestamps
- **Error Handling**: Graceful failure without data exposure

## 📊 Monitoring & Observability

### Metrics Tracked
- **Cost Tracking**: Input/output tokens, embedding costs, total spend
- **Performance**: Processing time, throughput, error rates
- **Job Statistics**: Success rates, average duration, failure reasons
- **System Health**: Memory usage, active jobs, error rate

### Logging
- **Structured Logs**: JSON format with job IDs and context
- **Real-time Monitoring**: SSE-style updates for active jobs
- **Export Capability**: CSV and JSON log exports
- **Alerting**: Automatic alerts for high costs or poor performance

## 🔄 Future Enhancements

### Planned Features
1. **Document Formats**: Support for additional formats (TXT, MD, EPUB)
2. **Advanced RAG**: Graph-based knowledge extraction
3. **Multi-language**: Support for non-English documents
4. **Export Options**: PDF, Word, JSON export of generated content
5. **Template System**: Customizable content generation templates
6. **Batch Processing**: Multiple document processing
7. **API Access**: RESTful API for programmatic access

### Performance Optimizations
1. **Streaming Generation**: Real-time content streaming
2. **Caching**: Outline and probe caching for repeated use
3. **Parallel Processing**: Multi-threaded document processing
4. **Vector Database**: Dedicated vector DB for improved search

## 🛠️ Troubleshooting

### Common Issues

**Upload Fails**
- Check file size (max 50MB)
- Verify file type (.pdf or .docx only)
- Ensure admin role permissions

**Generation Stalls**
- Check OpenAI API key and quota
- Monitor job logs for errors
- Use resume functionality if timed out

**Poor Content Quality**
- Verify document quality and structure
- Adjust batch sizes for better context
- Check retrieval relevance scores

**Database Errors**
- Ensure schema is properly installed
- Check RLS policies are active
- Verify user has admin role

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development
```

View real-time logs in browser console and check job history for detailed error messages.

## 📈 Performance Considerations

### Scaling Guidelines
- **Small Documents** (< 20 pages): Default settings work well
- **Large Documents** (> 50 pages): Increase batch sizes, monitor costs
- **Multiple Users**: Consider rate limiting and queue management
- **High Volume**: Implement document processing queues

### Cost Management
- Monitor token usage in job history
- Set up cost alerts in observability service
- Use smaller batch sizes for cost control
- Consider caching for repeated content generation

## 📞 Support

For issues or questions:
1. Check job history and logs first
2. Review this README for common solutions
3. Check database schema is correctly installed
4. Verify all environment variables are set
5. Ensure admin role is properly configured

---

**Implementation Status**: ✅ Complete  
**Last Updated**: January 2025  
**Version**: 1.0.0