'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenerationJob } from '@/lib/types/admin-content';
import { 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play,
  MoreHorizontal,
  FileText,
  Download
} from 'lucide-react';

interface JobHistoryViewerProps {
  jobs: GenerationJob[];
}

export function JobHistoryViewer({ jobs }: JobHistoryViewerProps) {
  const [selectedJob, setSelectedJob] = useState<GenerationJob | null>(null);

  const getStatusIcon = (status: GenerationJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'running':
        return <Play className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: GenerationJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds % 60}s`;
    }
    return `${diffSeconds}s`;
  };

  if (jobs.length === 0) {
    return (
      <Card className="p-6 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No generation jobs yet</p>
        <p className="text-sm text-gray-400">
          Start generating content to see job history here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generation Job History</h2>
        <div className="text-sm text-gray-500">
          {jobs.length} total jobs
        </div>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{job.job_type}</span>
                    <Badge variant="outline" className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {job.completed_items} / {job.total_items} items completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    {job.started_at && formatDuration(job.started_at, job.completed_at)}
                  </div>
                  {job.cost_estimate && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="w-3 h-3" />
                      ${job.cost_estimate.toFixed(3)}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {job.progress > 0 && job.progress < 100 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            )}

            {selectedJob?.id === job.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Job ID:</span>
                      <div className="text-gray-600 font-mono text-xs">{job.id}</div>
                    </div>
                    <div>
                      <span className="font-medium">Batch Size:</span>
                      <div className="text-gray-600">{job.batch_size} items/run</div>
                    </div>
                    <div>
                      <span className="font-medium">Started:</span>
                      <div className="text-gray-600">
                        {job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Completed:</span>
                      <div className="text-gray-600">
                        {job.completed_at ? new Date(job.completed_at).toLocaleString() : 'In progress'}
                      </div>
                    </div>
                  </div>

                  {job.cursor && (
                    <div className="text-sm">
                      <span className="font-medium">Resume Point:</span>
                      <div className="text-gray-600 font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                        {job.cursor}
                      </div>
                    </div>
                  )}

                  {job.error_message && (
                    <div className="text-sm">
                      <span className="font-medium text-red-600">Error:</span>
                      <div className="text-red-600 bg-red-50 p-2 rounded mt-1">
                        {job.error_message}
                      </div>
                    </div>
                  )}

                  {job.token_usage && (
                    <div className="text-sm">
                      <span className="font-medium">Token Usage:</span>
                      <div className="text-gray-600 mt-1">
                        Input: {job.token_usage.input.toLocaleString()}, 
                        Output: {job.token_usage.output.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {job.status === 'paused' && (
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Resume
                      </Button>
                    )}
                    {job.status === 'running' && (
                      <Button size="sm" variant="outline">
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {job.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download Results
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Summary Statistics</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(j => j.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {jobs.filter(j => j.status === 'running').length}
            </div>
            <div className="text-gray-600">Running</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {jobs.filter(j => j.status === 'paused').length}
            </div>
            <div className="text-gray-600">Paused</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {jobs.filter(j => j.status === 'failed').length}
            </div>
            <div className="text-gray-600">Failed</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span>Total estimated cost:</span>
            <span className="font-medium">
              ${jobs.reduce((sum, job) => sum + (job.cost_estimate || 0), 0).toFixed(3)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}