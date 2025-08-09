import { GenerationJob } from '@/lib/types/admin-content';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';

export class JobManager {
  private jobs: Map<string, GenerationJob> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private onJobUpdated: (job: GenerationJob) => void,
    private onJobCompleted: (job: GenerationJob) => void
  ) {}

  startJob(job: GenerationJob): void {
    this.jobs.set(job.id, { ...job, status: 'running', started_at: new Date().toISOString() });
    
    // Set up time limit monitoring
    const timeoutTimer = setTimeout(() => {
      this.pauseJob(job.id, 'Time limit approaching - auto-paused for safety');
    }, ADMIN_CONTENT_CONFIG.GENERATION.WARNING_THRESHOLD);
    
    this.timers.set(`timeout-${job.id}`, timeoutTimer);
    
    // Start actual job processing
    this.processJob(job.id);
  }

  pauseJob(jobId: string, reason?: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    // Clear timers
    this.clearJobTimers(jobId);
    
    // Update job status
    const updatedJob: GenerationJob = {
      ...job,
      status: 'paused',
      cursor: this.generateResumeCursor(job),
      error_message: reason
    };
    
    this.jobs.set(jobId, updatedJob);
    this.onJobUpdated(updatedJob);
  }

  resumeJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'paused') return;

    const updatedJob: GenerationJob = {
      ...job,
      status: 'running',
      error_message: undefined
    };
    
    this.jobs.set(jobId, updatedJob);
    this.onJobUpdated(updatedJob);
    
    // Restart processing from cursor
    this.processJob(jobId);
  }

  cancelJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    this.clearJobTimers(jobId);
    
    const updatedJob: GenerationJob = {
      ...job,
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: 'Job cancelled by user'
    };
    
    this.jobs.set(jobId, updatedJob);
    this.onJobCompleted(updatedJob);
  }

  getJob(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): GenerationJob[] {
    return Array.from(this.jobs.values());
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'running') return;

    try {
      const startTime = Date.now();
      let currentProgress = job.progress || 0;
      let completedItems = job.completed_items;
      
      // Parse cursor to determine where to resume
      const startingItem = this.parseResumeCursor(job.cursor);
      
      // Process items in batches
      while (completedItems < job.total_items && job.status === 'running') {
        const batchStart = startingItem + completedItems;
        const batchEnd = Math.min(batchStart + job.batch_size, job.total_items);
        const batchSize = batchEnd - batchStart;
        
        // Check time limit
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > ADMIN_CONTENT_CONFIG.GENERATION.WARNING_THRESHOLD) {
          this.pauseJob(jobId, 'Time limit reached - paused for safety');
          return;
        }

        // Process batch
        await this.processBatch(job, batchStart, batchSize);
        
        // Update progress
        completedItems += batchSize;
        currentProgress = Math.round((completedItems / job.total_items) * 100);
        
        const updatedJob: GenerationJob = {
          ...job,
          progress: currentProgress,
          completed_items: completedItems,
          cursor: this.generateResumeCursor({ ...job, completed_items: completedItems })
        };
        
        this.jobs.set(jobId, updatedJob);
        this.onJobUpdated(updatedJob);
        
        // Small delay between batches
        await this.delay(500);
      }
      
      // Job completed successfully
      if (completedItems >= job.total_items) {
        const completedJob: GenerationJob = {
          ...job,
          status: 'completed',
          progress: 100,
          completed_items: job.total_items,
          completed_at: new Date().toISOString()
        };
        
        this.clearJobTimers(jobId);
        this.jobs.set(jobId, completedJob);
        this.onJobCompleted(completedJob);
      }
      
    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      
      const failedJob: GenerationJob = {
        ...job,
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      
      this.clearJobTimers(jobId);
      this.jobs.set(jobId, failedJob);
      this.onJobCompleted(failedJob);
    }
  }

  private async processBatch(job: GenerationJob, startIndex: number, batchSize: number): Promise<void> {
    // Simulate actual content generation work
    const processingTime = this.estimateBatchProcessingTime(job.job_type, batchSize);
    
    // Simulate incremental progress within the batch
    const progressSteps = Math.max(1, Math.floor(batchSize / 2));
    for (let i = 0; i < progressSteps; i++) {
      await this.delay(processingTime / progressSteps);
      
      // Check if job was paused or cancelled
      const currentJob = this.jobs.get(job.id);
      if (!currentJob || currentJob.status !== 'running') {
        break;
      }
    }
  }

  private estimateBatchProcessingTime(jobType: GenerationJob['job_type'], batchSize: number): number {
    // Estimated processing time per item in milliseconds
    const timePerItem = {
      outline: 5000,    // 5 seconds for outline generation
      lessons: 8000,    // 8 seconds per lesson
      quizzes: 3000,    // 3 seconds per quiz question
      flashcards: 1000, // 1 second per flashcard
      takeaways: 2000   // 2 seconds per takeaway set
    };
    
    return timePerItem[jobType] * batchSize;
  }

  private generateResumeCursor(job: GenerationJob): string {
    // Create a cursor that encodes where to resume processing
    const cursor = {
      jobType: job.job_type,
      completedItems: job.completed_items,
      batchSize: job.batch_size,
      timestamp: new Date().toISOString()
    };
    
    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }

  private parseResumeCursor(cursor?: string): number {
    if (!cursor) return 0;
    
    try {
      const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());
      return decoded.completedItems || 0;
    } catch {
      return 0;
    }
  }

  private clearJobTimers(jobId: string): void {
    const timeoutTimer = this.timers.get(`timeout-${jobId}`);
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      this.timers.delete(`timeout-${jobId}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clean up resources
  destroy(): void {
    for (const [key, timer] of this.timers) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.jobs.clear();
  }
}