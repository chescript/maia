'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Document, Outline } from '@/lib/types/admin-content';
import { OutlineGenerator } from '@/lib/services/outline-generator';
import { BookOpen, Target, Lightbulb, RefreshCw } from 'lucide-react';

interface OutlineViewerProps {
  document: Document | null;
  outline: Outline | null;
  onOutlineGenerated: (outline: Outline) => void;
}

export function OutlineViewer({ document, outline, onOutlineGenerated }: OutlineViewerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutline = async () => {
    if (!document) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Mock document chunks - in real implementation, fetch from database
      const mockChunks = Array.from({ length: 50 }, (_, i) => ({
        id: `chunk-${i}`,
        document_id: document.id,
        content: `This is chunk ${i} content from the document. It contains relevant information about the topic covered in this section of the document.`,
        page_number: Math.floor(i / 2) + 1,
        chunk_index: i,
        token_count: 100,
        created_at: new Date().toISOString()
      }));

      const generator = new OutlineGenerator(process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'mock-key');
      const generatedOutline = await generator.generateOutline(document, mockChunks);
      
      onOutlineGenerated(generatedOutline);
    } catch (err) {
      console.error('Outline generation failed:', err);
      setError('Failed to generate outline. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!document) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Upload and process a document first to generate an outline.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Document Outline</h2>
          <Button 
            onClick={handleGenerateOutline}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : outline ? 'Regenerate' : 'Generate Outline'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {outline ? (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">{outline.title}</h3>
              <div className="text-sm text-blue-700">
                <span className="font-medium">{outline.modules.length}</span> modules • 
                <span className="font-medium ml-1">
                  {outline.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
                </span> lessons total
              </div>
            </div>

            <div className="space-y-4">
              {outline.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="p-4">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Module {moduleIndex + 1}
                      </Badge>
                      <h4 className="font-semibold text-gray-900">{module.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>

                  <div className="space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {moduleIndex + 1}.{lessonIndex + 1}
                          </Badge>
                          <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-1 mb-2">
                              <Lightbulb className="w-3 h-3 text-orange-500" />
                              <span className="text-xs font-medium text-gray-700">Key Concepts</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {lesson.concepts.map((concept, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 mb-2">
                              <Target className="w-3 h-3 text-green-500" />
                              <span className="text-xs font-medium text-gray-700">Learning Objectives</span>
                            </div>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {lesson.learning_objectives.slice(0, 2).map((objective, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-green-500 mt-0.5">•</span>
                                  <span>{objective}</span>
                                </li>
                              ))}
                              {lesson.learning_objectives.length > 2 && (
                                <li className="text-gray-400">
                                  +{lesson.learning_objectives.length - 2} more...
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Outline Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Modules:</span> {outline.modules.length}
                </div>
                <div>
                  <span className="font-medium">Total Lessons:</span> {' '}
                  {outline.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
                </div>
                <div>
                  <span className="font-medium">Total Concepts:</span> {' '}
                  {outline.modules.reduce((acc, mod) => 
                    acc + mod.lessons.reduce((lacc, lesson) => lacc + lesson.concepts.length, 0), 0
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : !isGenerating ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No outline generated yet</p>
            <p className="text-sm text-gray-400">
              Click "Generate Outline" to create a structured outline from your document
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-blue-600 font-medium">Analyzing document...</p>
            <p className="text-sm text-gray-500 mt-1">
              Creating modules, lessons, and learning objectives
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}