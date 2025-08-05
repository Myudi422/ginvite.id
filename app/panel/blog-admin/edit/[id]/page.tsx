// app/panel/blog-admin/edit/[id]/page.tsx
'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditBlogForm from '../../EditBlogForm';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const handleBack = () => {
    router.back();
  };

  const handleUpdateSuccess = () => {
    // Redirect back to blog list after successful update
    router.push('/panel/blog-admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 
                     bg-clip-text text-transparent mb-2"
        >
          Edit Artikel
        </h1>
        <p className="text-sm text-pink-600">
          Perbarui artikel blog dengan mudah
        </p>
      </div>

      {/* FORM EDIT */}
      <EditBlogForm blogId={blogId} onUpdateSuccess={handleUpdateSuccess} />
    </div>
  );
}
