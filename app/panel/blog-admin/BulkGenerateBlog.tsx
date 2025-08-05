// app/panel/blog-admin/BulkGenerateBlog.tsx
'use client';

import React, { useState } from 'react';
import { SparklesIcon, Loader2, PlusIcon, MinusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeminiAPI } from '@/lib/gemini';

interface BulkGenerateBlogProps {
  onBlogsGenerated: () => void;
}

export default function BulkGenerateBlog({ onBlogsGenerated }: BulkGenerateBlogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [topics, setTopics] = useState(['']);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    currentTopic: string;
  } | null>(null);

  const addTopic = () => {
    setTopics([...topics, '']);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleBulkGenerate = async () => {
    const validTopics = topics.filter(topic => topic.trim());
    
    if (validTopics.length === 0) {
      alert('Mohon masukkan minimal satu topik');
      return;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total: validTopics.length, currentTopic: '' });

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < validTopics.length; i++) {
      const topic = validTopics[i];
      setProgress({ current: i + 1, total: validTopics.length, currentTopic: topic });

      try {
        // Generate content with Gemini
        const blogData = await GeminiAPI.generateBlog(topic);
        
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
            category: 'General',
            status: 'draft',
            image_url: ''
          })
        });

        const result = await response.json();
        if (result.status === 'success') {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`${topic}: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${topic}: ${(error as Error).message}`);
      }

      // Add delay between requests to avoid rate limiting
      if (i < validTopics.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsGenerating(false);
    setProgress(null);
    
    let message = `Bulk generate selesai!\nBerhasil: ${results.success}\nGagal: ${results.failed}`;
    if (results.errors.length > 0) {
      message += `\n\nError:\n${results.errors.slice(0, 3).join('\n')}`;
      if (results.errors.length > 3) {
        message += `\n... dan ${results.errors.length - 3} error lainnya`;
      }
    }
    
    alert(message);
    
    if (results.success > 0) {
      setTopics(['']);
      setShowDialog(false);
      onBlogsGenerated();
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="bg-gradient-to-r from-indigo-400 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-600 px-6 py-2 rounded-xl flex items-center gap-2"
      >
        <SparklesIcon className="h-5 w-5" />
        Bulk Generate
      </Button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Bulk Generate Blog dengan AI
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daftar Topik Blog
              </label>
              
              {topics.map((topic, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    placeholder={`Topik ${index + 1}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isGenerating}
                  />
                  {topics.length > 1 && (
                    <Button
                      onClick={() => removeTopic(index)}
                      variant="outline"
                      size="sm"
                      disabled={isGenerating}
                      className="px-2"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                onClick={addTopic}
                variant="outline"
                size="sm"
                disabled={isGenerating}
                className="mt-2"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Tambah Topik
              </Button>
            </div>

            {progress && (
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-indigo-800">
                    Progress: {progress.current} / {progress.total}
                  </span>
                  <span className="text-sm text-indigo-600">
                    {Math.round((progress.current / progress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-indigo-700">
                  Sedang generate: {progress.currentTopic}
                </p>
              </div>
            )}

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
                onClick={handleBulkGenerate}
                disabled={isGenerating || topics.every(t => !t.trim())}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Semua'
                )}
              </Button>
            </div>

            {isGenerating && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                AI sedang membuat {topics.filter(t => t.trim()).length} artikel untuk Anda... 
                <br />Proses ini mungkin memakan waktu beberapa menit.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
