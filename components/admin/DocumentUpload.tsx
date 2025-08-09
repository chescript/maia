'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Document, IngestionProgress } from '@/lib/types/admin-content';
import { DocumentProcessor } from '@/lib/services/document-processor';
import { ADMIN_CONTENT_CONFIG } from '@/lib/config/admin-content';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentUploaded: (document: Document) => void;
  onProgress: (progress: IngestionProgress) => void;
  currentProgress: IngestionProgress | null;
}

export function DocumentUpload({ onDocumentUploaded, onProgress, currentProgress }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contextType, setContextType] = useState<'exam' | 'module'>('exam');
  const [contextId, setContextId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase() as '.pdf' | '.docx';
    if (!ADMIN_CONTENT_CONFIG.UPLOAD.ALLOWED_TYPES.includes(fileExtension)) {
      setError(`File type not supported. Please upload: ${ADMIN_CONTENT_CONFIG.UPLOAD.ALLOWED_TYPES.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > ADMIN_CONTENT_CONFIG.UPLOAD.MAX_FILE_SIZE) {
      setError(`File too large. Maximum size: ${ADMIN_CONTENT_CONFIG.UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !contextId.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const processor = new DocumentProcessor(onProgress);
      const processedDocument = await processor.processDocument(selectedFile, contextType, contextId.trim());
      onDocumentUploaded(processedDocument);
      
      // Reset form
      setSelectedFile(null);
      setContextId('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, contextType, contextId, onProgress, onDocumentUploaded]);

  const isUploadDisabled = !selectedFile || !contextId.trim() || isProcessing;

  return (
    <div className="space-y-6">
      {/* Context Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Context Type</Label>
          <RadioGroup 
            value={contextType} 
            onValueChange={(value: 'exam' | 'module') => setContextType(value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exam" id="exam" />
              <Label htmlFor="exam">Exam Preparation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="module" id="module" />
              <Label htmlFor="module">Course Module</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="context-id" className="text-sm font-medium">
            Context ID
          </Label>
          <Input
            id="context-id"
            value={contextId}
            onChange={(e) => setContextId(e.target.value)}
            placeholder="Enter exam or module identifier"
            className="mt-1"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          id="file-upload"
          type="file"
          accept={ADMIN_CONTENT_CONFIG.UPLOAD.ALLOWED_MIME_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          
          <div>
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
            >
              Choose file to upload
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Supported: {ADMIN_CONTENT_CONFIG.UPLOAD.ALLOWED_TYPES.join(', ')} 
              (max {ADMIN_CONTENT_CONFIG.UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {Math.round(selectedFile.size / 1024)}KB • {selectedFile.type}
              </p>
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploadDisabled}
              size="sm"
            >
              {isProcessing ? 'Processing...' : 'Upload & Process'}
            </Button>
          </div>
        </Card>
      )}

      {/* Progress Indicator */}
      {currentProgress && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Processing Document</h3>
              <span className="text-sm text-gray-500">{currentProgress.progress}%</span>
            </div>
            
            <Progress value={currentProgress.progress} className="w-full" />
            
            <div className="flex items-center gap-2 text-sm">
              {currentProgress.progress === 100 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span>{currentProgress.message}</span>
            </div>

            {currentProgress.preview && (
              <div className="bg-gray-50 rounded p-3 text-sm">
                <h4 className="font-medium mb-2">Document Preview</h4>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="font-medium">Pages:</span> {currentProgress.preview.pages}
                  </div>
                  <div>
                    <span className="font-medium">Est. Tokens:</span> {currentProgress.preview.token_estimate.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Headings:</span> {currentProgress.preview.headings.length}
                  </div>
                </div>
                
                {currentProgress.preview.headings.length > 0 && (
                  <div>
                    <span className="font-medium">Sample Headings:</span>
                    <ul className="list-disc list-inside mt-1 text-gray-600">
                      {currentProgress.preview.headings.slice(0, 3).map((heading, i) => (
                        <li key={i}>{heading}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}
    </div>
  );
}