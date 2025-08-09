'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Document, Outline, GenerationJob } from '@/lib/types/admin-content';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';
import { 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Target,
  Play,
  Pause,
  Clock,
  DollarSign
} from 'lucide-react';

interface GenerationControlsProps {
  document: Document | null;
  outline: Outline | null;
  currentJobs: GenerationJob[];
  onJobCreated: (job: GenerationJob) => void;
  onJobUpdated: (job: GenerationJob) => void;
}

export function GenerationControls({ 
  document, 
  outline, 
  currentJobs,
  onJobCreated, 
  onJobUpdated 
}: GenerationControlsProps) {
  const [batchSizes, setBatchSizes] = useState({
    lessons: ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.lessons,
    quizzes: ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.quizzes,
    flashcards: ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.flashcards,
    takeaways: ADMIN_CONTENT_CONFIG.GENERATION.DEFAULT_BATCH_SIZES.takeaways
  });

  const [estimates, setEstimates] = useState({
    lessons: { items: 0, cost: 0, time: 0 },
    quizzes: { items: 0, cost: 0, time: 0 },
    flashcards: { items: 0, cost: 0, time: 0 },
    takeaways: { items: 0, cost: 0, time: 0 }
  });

  if (!document || !outline) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Upload a document and generate an outline first.</p>
      </Card>
    );
  }

  const totalLessons = outline.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  
  const handleBatchSizeChange = (type: keyof typeof batchSizes, value: number) => {
    setBatchSizes(prev => ({ ...prev, [type]: value }));
    
    // Update estimates
    const itemCount = type === 'lessons' ? totalLessons : 
                     type === 'quizzes' ? totalLessons * value :
                     type === 'flashcards' ? totalLessons * value :
                     totalLessons;
    
    const estimatedCost = itemCount * 0.02; // Mock cost calculation
    const estimatedTime = Math.ceil(itemCount / value) * 30; // Mock time calculation
    
    setEstimates(prev => ({
      ...prev,
      [type]: { items: itemCount, cost: estimatedCost, time: estimatedTime }
    }));
  };

  const handleStartGeneration = async (type: 'lessons' | 'quizzes' | 'flashcards' | 'takeaways') => {
    const job: GenerationJob = {
      id: crypto.randomUUID(),
      document_id: document.id,
      job_type: type,
      status: 'pending',
      progress: 0,
      batch_size: batchSizes[type],
      total_items: estimates[type].items,
      completed_items: 0,
      started_at: new Date().toISOString(),
      cost_estimate: estimates[type].cost
    };

    onJobCreated(job);

    // Simulate job progress
    setTimeout(() => {
      onJobUpdated({ ...job, status: 'running', progress: 10 });
    }, 1000);
  };

  const activeJob = currentJobs.find(job => job.status === 'running');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Content Generation</h2>
          <div className="text-sm text-gray-500">
            {totalLessons} lessons available for generation
          </div>
        </div>

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lessons" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="takeaways" className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Takeaways
            </TabsTrigger>
          </TabsList>

          {/* Lessons */}
          <TabsContent value="lessons" className="space-y-4">
            <GenerationTab
              type="lessons"
              title="Generate Lessons"
              description="Create detailed lesson content with citations and pitfalls"
              batchSize={batchSizes.lessons}
              maxBatchSize={ADMIN_CONTENT_CONFIG.GENERATION.MAX_BATCH_SIZES.lessons}
              estimates={estimates.lessons}
              onBatchSizeChange={(value) => handleBatchSizeChange('lessons', value)}
              onStartGeneration={() => handleStartGeneration('lessons')}
              isDisabled={!!activeJob}
              currentJob={currentJobs.find(j => j.job_type === 'lessons' && j.status === 'running')}
            />
          </TabsContent>

          {/* Quizzes */}
          <TabsContent value="quizzes" className="space-y-4">
            <GenerationTab
              type="quizzes"
              title="Generate Quizzes"
              description="Create multiple choice questions with rationale and citations"
              batchSize={batchSizes.quizzes}
              maxBatchSize={ADMIN_CONTENT_CONFIG.GENERATION.MAX_BATCH_SIZES.quizzes}
              estimates={estimates.quizzes}
              onBatchSizeChange={(value) => handleBatchSizeChange('quizzes', value)}
              onStartGeneration={() => handleStartGeneration('quizzes')}
              isDisabled={!!activeJob}
              currentJob={currentJobs.find(j => j.job_type === 'quizzes' && j.status === 'running')}
            />
          </TabsContent>

          {/* Flashcards */}
          <TabsContent value="flashcards" className="space-y-4">
            <GenerationTab
              type="flashcards"
              title="Generate Flashcards"
              description="Create concise Q&A pairs for quick review"
              batchSize={batchSizes.flashcards}
              maxBatchSize={ADMIN_CONTENT_CONFIG.GENERATION.MAX_BATCH_SIZES.flashcards}
              estimates={estimates.flashcards}
              onBatchSizeChange={(value) => handleBatchSizeChange('flashcards', value)}
              onStartGeneration={() => handleStartGeneration('flashcards')}
              isDisabled={!!activeJob}
              currentJob={currentJobs.find(j => j.job_type === 'flashcards' && j.status === 'running')}
            />
          </TabsContent>

          {/* Takeaways */}
          <TabsContent value="takeaways" className="space-y-4">
            <GenerationTab
              type="takeaways"
              title="Generate Takeaways"
              description="Create key bullet points with citations"
              batchSize={batchSizes.takeaways}
              maxBatchSize={ADMIN_CONTENT_CONFIG.GENERATION.MAX_BATCH_SIZES.takeaways}
              estimates={estimates.takeaways}
              onBatchSizeChange={(value) => handleBatchSizeChange('takeaways', value)}
              onStartGeneration={() => handleStartGeneration('takeaways')}
              isDisabled={!!activeJob}
              currentJob={currentJobs.find(j => j.job_type === 'takeaways' && j.status === 'running')}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Active Job Monitor */}
      {activeJob && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="font-medium capitalize">Generating {activeJob.job_type}</span>
                <Badge variant="outline">{activeJob.status}</Badge>
              </div>
              <div className="text-sm text-gray-500">
                {activeJob.completed_items} / {activeJob.total_items} items
              </div>
            </div>
            
            <Progress value={activeJob.progress} className="w-full" />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>~{Math.round((Date.now() - new Date(activeJob.started_at!).getTime()) / 1000)}s</span>
                </div>
                {activeJob.cost_estimate && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>${activeJob.cost_estimate.toFixed(3)}</span>
                  </div>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => {}}>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

interface GenerationTabProps {
  type: string;
  title: string;
  description: string;
  batchSize: number;
  maxBatchSize: number;
  estimates: { items: number; cost: number; time: number };
  onBatchSizeChange: (value: number) => void;
  onStartGeneration: () => void;
  isDisabled: boolean;
  currentJob?: GenerationJob;
}

function GenerationTab({
  type,
  title,
  description,
  batchSize,
  maxBatchSize,
  estimates,
  onBatchSizeChange,
  onStartGeneration,
  isDisabled,
  currentJob
}: GenerationTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Batch Size (items per run)
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max={maxBatchSize}
              value={batchSize}
              onChange={(e) => onBatchSizeChange(parseInt(e.target.value))}
              className="flex-1"
              disabled={isDisabled}
            />
            <span className="text-sm font-medium w-8">{batchSize}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Estimated items:</span>
            <span className="font-medium">{estimates.items}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated cost:</span>
            <span className="font-medium">${estimates.cost.toFixed(3)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated time:</span>
            <span className="font-medium">{Math.round(estimates.time / 60)}min</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onStartGeneration}
          disabled={isDisabled}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Run Generation
        </Button>
        <Button variant="outline" disabled={isDisabled}>
          Dry Run
        </Button>
        {currentJob && currentJob.status === 'paused' && (
          <Button variant="outline" onClick={() => {}}>
            Resume
          </Button>
        )}
      </div>
    </div>
  );
}