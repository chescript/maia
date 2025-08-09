export const ADMIN_CONTENT_CONFIG = {
  UPLOAD: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['.pdf', '.docx'],
    ALLOWED_MIME_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  CHUNKING: {
    CHUNK_SIZE: 1000, // tokens
    OVERLAP_SIZE: 200, // tokens
    MAX_CHUNKS_PER_BATCH: 100
  },
  GENERATION: {
    MAX_JOB_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
    WARNING_THRESHOLD: 13 * 60 * 1000, // 13 minutes warning
    DEFAULT_BATCH_SIZES: {
      lessons: 2,
      quizzes: 4,
      flashcards: 10,
      takeaways: 5
    },
    MAX_BATCH_SIZES: {
      lessons: 3,
      quizzes: 6,
      flashcards: 20,
      takeaways: 5
    }
  },
  RETRIEVAL: {
    VECTOR_TOP_K: 25,
    MAX_CONTEXT_TOKENS: 1200,
    MIN_RELEVANCE_SCORE: 0.7,
    RRF_CONSTANT: 60
  },
  HYDE: {
    SYNOPSIS_WORD_RANGE: [200, 300],
    ANCHOR_TERMS_RANGE: [12, 20],
    ANSWER_WORD_RANGE: [120, 180]
  },
  COSTS: {
    EMBEDDING_MODEL: 'text-embedding-3-small',
    LLM_MODEL: 'gpt-4o-mini',
    EMBEDDING_COST_PER_TOKEN: 0.00002 / 1000, // $0.02 per 1M tokens
    LLM_INPUT_COST_PER_TOKEN: 0.150 / 1000000, // $0.150 per 1M tokens
    LLM_OUTPUT_COST_PER_TOKEN: 0.600 / 1000000 // $0.600 per 1M tokens
  }
} as const;