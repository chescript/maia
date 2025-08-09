import { GenerationJob } from '@/lib/types/admin-content';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  jobId?: string;
  documentId?: string;
}

export interface CostMetrics {
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  embeddingTokens: number;
  breakdown: {
    llmCost: number;
    embeddingCost: number;
  };
}

export interface PerformanceMetrics {
  processingTime: number;
  throughput: number; // items per second
  avgResponseTime: number;
  errorRate: number;
}

export class ObservabilityService {
  private logs: LogEntry[] = [];
  private metrics: Map<string, any> = new Map();
  private costTracking: Map<string, CostMetrics> = new Map();
  private performanceTracking: Map<string, PerformanceMetrics> = new Map();

  // Logging methods
  log(level: LogEntry['level'], message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    this.logs.push(entry);
    
    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? console.error : 
                       level === 'warn' ? console.warn : 
                       console.log;
      logMethod(`[${level.toUpperCase()}] ${message}`, context || '');
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(entry).catch(console.error);
    }
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  // Job-specific logging
  logJobEvent(jobId: string, event: string, context?: Record<string, any>): void {
    this.info(`Job ${event}`, { jobId, ...context });
  }

  logJobError(jobId: string, error: string, context?: Record<string, any>): void {
    this.error(`Job error: ${error}`, { jobId, ...context });
  }

  // Cost tracking
  trackCost(jobId: string, inputTokens: number, outputTokens: number, embeddingTokens: number = 0): void {
    const llmInputCost = inputTokens * ADMIN_CONTENT_CONFIG.COSTS.LLM_INPUT_COST_PER_TOKEN;
    const llmOutputCost = outputTokens * ADMIN_CONTENT_CONFIG.COSTS.LLM_OUTPUT_COST_PER_TOKEN;
    const embeddingCost = embeddingTokens * ADMIN_CONTENT_CONFIG.COSTS.EMBEDDING_COST_PER_TOKEN;

    const metrics: CostMetrics = {
      totalCost: llmInputCost + llmOutputCost + embeddingCost,
      inputTokens,
      outputTokens,
      embeddingTokens,
      breakdown: {
        llmCost: llmInputCost + llmOutputCost,
        embeddingCost
      }
    };

    this.costTracking.set(jobId, metrics);
    
    this.info('Cost tracked', {
      jobId,
      totalCost: metrics.totalCost,
      inputTokens,
      outputTokens,
      embeddingTokens
    });
  }

  getCostMetrics(jobId: string): CostMetrics | null {
    return this.costTracking.get(jobId) || null;
  }

  getTotalCosts(): CostMetrics {
    const costs = Array.from(this.costTracking.values());
    return costs.reduce((acc, cost) => ({
      totalCost: acc.totalCost + cost.totalCost,
      inputTokens: acc.inputTokens + cost.inputTokens,
      outputTokens: acc.outputTokens + cost.outputTokens,
      embeddingTokens: acc.embeddingTokens + cost.embeddingTokens,
      breakdown: {
        llmCost: acc.breakdown.llmCost + cost.breakdown.llmCost,
        embeddingCost: acc.breakdown.embeddingCost + cost.breakdown.embeddingCost
      }
    }), {
      totalCost: 0,
      inputTokens: 0,
      outputTokens: 0,
      embeddingTokens: 0,
      breakdown: { llmCost: 0, embeddingCost: 0 }
    });
  }

  // Performance tracking
  startTimer(id: string): void {
    this.metrics.set(`timer_${id}`, Date.now());
  }

  endTimer(id: string): number {
    const startTime = this.metrics.get(`timer_${id}`);
    if (!startTime) return 0;
    
    const duration = Date.now() - startTime;
    this.metrics.delete(`timer_${id}`);
    return duration;
  }

  trackPerformance(jobId: string, itemsProcessed: number, duration: number, errors: number = 0): void {
    const throughput = itemsProcessed / (duration / 1000); // items per second
    const avgResponseTime = duration / itemsProcessed;
    const errorRate = errors / itemsProcessed;

    const metrics: PerformanceMetrics = {
      processingTime: duration,
      throughput,
      avgResponseTime,
      errorRate
    };

    this.performanceTracking.set(jobId, metrics);
    
    this.info('Performance tracked', {
      jobId,
      itemsProcessed,
      duration,
      throughput,
      avgResponseTime,
      errorRate
    });
  }

  getPerformanceMetrics(jobId: string): PerformanceMetrics | null {
    return this.performanceTracking.get(jobId) || null;
  }

  // Real-time monitoring
  subscribeToJob(jobId: string, callback: (event: LogEntry) => void): () => void {
    const handler = (entry: LogEntry) => {
      if (entry.jobId === jobId || entry.context?.jobId === jobId) {
        callback(entry);
      }
    };

    // In a real implementation, this would set up SSE or WebSocket connection
    const interval = setInterval(() => {
      const recentLogs = this.logs.slice(-10).filter(log => 
        log.jobId === jobId || log.context?.jobId === jobId
      );
      recentLogs.forEach(handler);
    }, 1000);

    return () => clearInterval(interval);
  }

  // System health monitoring
  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: {
      activeJobs: number;
      errorRate: number;
      avgProcessingTime: number;
      memoryUsage: number;
    };
  } {
    const recentLogs = this.logs.slice(-100);
    const errorCount = recentLogs.filter(log => log.level === 'error').length;
    const errorRate = errorCount / recentLogs.length;
    
    const performanceValues = Array.from(this.performanceTracking.values());
    const avgProcessingTime = performanceValues.length > 0 
      ? performanceValues.reduce((sum, p) => sum + p.processingTime, 0) / performanceValues.length
      : 0;

    const status = errorRate > 0.1 ? 'unhealthy' : 
                  errorRate > 0.05 ? 'degraded' : 'healthy';

    return {
      status,
      metrics: {
        activeJobs: this.performanceTracking.size,
        errorRate,
        avgProcessingTime,
        memoryUsage: this.getMemoryUsage()
      }
    };
  }

  // Alerting
  checkAlerts(job: GenerationJob): void {
    const metrics = this.getPerformanceMetrics(job.id);
    const costs = this.getCostMetrics(job.id);
    
    // Check for long-running jobs
    if (job.started_at) {
      const runtime = Date.now() - new Date(job.started_at).getTime();
      if (runtime > ADMIN_CONTENT_CONFIG.GENERATION.WARNING_THRESHOLD) {
        this.warn('Job exceeding time limit', {
          jobId: job.id,
          runtime: runtime / 1000,
          threshold: ADMIN_CONTENT_CONFIG.GENERATION.WARNING_THRESHOLD / 1000
        });
      }
    }

    // Check for high costs
    if (costs && costs.totalCost > 1.0) { // $1 threshold
      this.warn('High cost detected', {
        jobId: job.id,
        totalCost: costs.totalCost,
        inputTokens: costs.inputTokens,
        outputTokens: costs.outputTokens
      });
    }

    // Check for poor performance
    if (metrics && metrics.errorRate > 0.1) {
      this.warn('High error rate detected', {
        jobId: job.id,
        errorRate: metrics.errorRate,
        throughput: metrics.throughput
      });
    }
  }

  // Export logs for analysis
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'jobId', 'documentId'];
      const csvRows = [headers.join(',')];
      
      this.logs.forEach(log => {
        const row = [
          log.timestamp,
          log.level,
          `"${log.message.replace(/"/g, '""')}"`,
          log.jobId || '',
          log.documentId || ''
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    }
    
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear old data
  cleanup(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    this.logs = this.logs.filter(log => 
      new Date(log.timestamp).getTime() > cutoffTime
    );
    
    // Keep only recent metrics
    const recentJobIds = new Set(this.logs.map(log => log.jobId).filter(Boolean));
    
    for (const jobId of this.costTracking.keys()) {
      if (!recentJobIds.has(jobId)) {
        this.costTracking.delete(jobId);
      }
    }
    
    for (const jobId of this.performanceTracking.keys()) {
      if (!recentJobIds.has(jobId)) {
        this.performanceTracking.delete(jobId);
      }
    }
  }

  // Private methods
  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    // In production, send to external logging service (e.g., Datadog, Sentry, etc.)
    // For now, we'll just simulate this
    if (entry.level === 'error') {
      // Send to error tracking service
    }
  }

  private getMemoryUsage(): number {
    // Rough estimate of memory usage
    const logMemory = JSON.stringify(this.logs).length;
    const metricsMemory = this.metrics.size * 100; // rough estimate
    return (logMemory + metricsMemory) / 1024 / 1024; // MB
  }
}

// Global observability instance
export const observability = new ObservabilityService();