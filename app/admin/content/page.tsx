'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { ContentSystemDashboard } from '@/components/admin/ContentSystemDashboard';

export default function AdminContentPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Content Generation System</h1>
            <p className="text-gray-600 mt-2">
              Upload documents and generate lessons, quizzes, and flashcards with HyDE RAG
            </p>
          </div>
          
          <ContentSystemDashboard />
        </div>
      </div>
    </AdminGuard>
  );
}