// app/panel/blog-admin/AutoGenerateBlog.tsx
'use client';

import React, { useState } from 'react';
import { SparklesIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeminiAPI } from '@/lib/gemini';

interface AutoGenerateBlogProps {
  onBlogGenerated: () => void;
}

export default function AutoGenerateBlog({ onBlogGenerated }: AutoGenerateBlogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Mohon masukkan topik atau ide untuk blog');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate content with Gemini
      const blogData = await GeminiAPI.generateBlog(prompt);
      
      // Create slug from title
      const slug = GeminiAPI.generateSlug(blogData.title);
      
      // Save to database via API
      const response = await fetch('https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: blogData.title,
          slug: slug,
          content: blogData.content,
          category: 'General', // Default category
          status: 'draft', // Save as draft first
          image_url: '' // No image for auto-generated blogs
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        alert('Blog berhasil di-generate dan disimpan sebagai draft!');
        setPrompt('');
        setShowDialog(false);
        onBlogGenerated();
      } else {
        throw new Error(result.message || 'Gagal menyimpan blog');
      }
    } catch (error) {
      console.error('Error generating blog:', error);
      alert('Gagal generate blog: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 px-6 py-2 rounded-xl flex items-center gap-2"
      >
        <SparklesIcon className="h-5 w-5" />
        Generate Blog AI
      </Button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Generate Blog dengan AI
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topik atau Ide Blog
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Tips memilih tema wedding yang tepat, cara merencanakan pernikahan dengan budget terbatas, dll..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
                disabled={isGenerating}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
              >
                Batal
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>

            {isGenerating && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                AI sedang membuat artikel untuk Anda... Mohon tunggu sebentar.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
