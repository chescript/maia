'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from './DocumentUpload';
import { OutlineViewer } from './OutlineViewer';
import { GenerationControls } from './GenerationControls';
import { JobHistoryViewer } from './JobHistoryViewer';
import { Document, Outline, GenerationJob, IngestionProgress } from '@/lib/types/admin-content';

export function ContentSystemDashboard() {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [currentOutline, setCurrentOutline] = useState<Outline | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [ingestionProgress, setIngestionProgress] = useState<IngestionProgress | null>(null);

  const handleDocumentUploaded = useCallback((document: Document) => {
    setCurrentDocument(document);
    setCurrentOutline(null);
    setIngestionProgress(null);
  }, []);

  const handleIngestionProgress = useCallback((progress: IngestionProgress) => {
    setIngestionProgress(progress);
  }, []);

  const handleOutlineGenerated = useCallback((outline: Outline) => {
    setCurrentOutline(outline);
  }, []);

  const handleJobCreated = useCallback((job: GenerationJob) => {
    setJobs(prev => [job, ...prev]);
  }, []);

  const handleJobUpdated = useCallback((updatedJob: GenerationJob) => {
    setJobs(prev => prev.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    ));
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload & Ingest</TabsTrigger>
          <TabsTrigger value="outline" disabled={!currentDocument}>
            Outline
          </TabsTrigger>
          <TabsTrigger value="generate" disabled={!currentOutline}>
            Generate Content
          </TabsTrigger>
          <TabsTrigger value="jobs">Job History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Document Upload & Ingestion</h2>
            <DocumentUpload 
              onDocumentUploaded={handleDocumentUploaded}
              onProgress={handleIngestionProgress}
              currentProgress={ingestionProgress}
            />
          </Card>
          
          {currentDocument && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-3">Current Document</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {currentDocument.name}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      currentDocument.upload_status === 'indexed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentDocument.upload_status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Pages:</span> {currentDocument.pages}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {Math.round(currentDocument.file_size / 1024)}KB
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="outline" className="space-y-6">
          <OutlineViewer 
            document={currentDocument}
            outline={currentOutline}
            onOutlineGenerated={handleOutlineGenerated}
          />
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <GenerationControls 
            document={currentDocument}
            outline={currentOutline}
            onJobCreated={handleJobCreated}
            onJobUpdated={handleJobUpdated}
            currentJobs={jobs.filter(job => 
              ['pending', 'running', 'paused'].includes(job.status)
            )}
          />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <JobHistoryViewer jobs={jobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}