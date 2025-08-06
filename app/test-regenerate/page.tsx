// app/test-regenerate/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GeminiAPI } from '@/lib/gemini';

export default function TestRegeneratePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock blog data untuk testing
  const mockBlog = {
    id: 1,
    title: 'Tips Wedding Sederhana',
    slug: 'tips-wedding-sederhana', 
    content: 'Wedding adalah momen spesial. Perlu persiapan yang matang untuk membuat acara wedding yang berkesan.',
    category: 'Wedding',
    status: 'draft',
    image_url: ''
  };

  const testRegenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing regenerate with mock blog:', mockBlog);
      
      // Step 1: Generate improved content
      const blogData = await GeminiAPI.regenerateBlog(mockBlog.title, mockBlog.content);
      console.log('Generated blog data:', blogData);
      
      // Step 2: Test the update API call
      const newSlug = blogData.title !== mockBlog.title 
        ? GeminiAPI.generateSlug(blogData.title)
        : mockBlog.slug;

      const formData = new FormData();
      formData.append('id', mockBlog.id.toString());
      formData.append('title', blogData.title);
      formData.append('slug', newSlug);
      formData.append('content', blogData.content);
      formData.append('category', mockBlog.category);
      formData.append('status', mockBlog.status);

      console.log('Sending update request...');
      const updateResponse = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=update',
        {
          method: 'POST',
          body: formData
        }
      );

      const updateResult = await updateResponse.json();
      console.log('Update API response:', updateResult);
      
      setResult({
        generatedData: blogData,
        updateResponse: updateResult
      });
    } catch (err) {
      setError((err as Error).message);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Regenerate API</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Mock Blog Data:</h3>
        <pre className="text-sm">{JSON.stringify(mockBlog, null, 2)}</pre>
      </div>
      
      <div className="space-y-4">
        <div>
          <Button onClick={testRegenerate} disabled={loading}>
            {loading ? 'Testing Regenerate...' : 'Test Regenerate Blog'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <h3 className="font-bold">Generated Content:</h3>
            <div className="mt-2">
              <strong>New Title:</strong> {result.generatedData.title}
            </div>
            <div className="mt-2">
              <strong>Content Length:</strong> {result.generatedData.content.length} characters
            </div>
          </div>
          
          <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <h3 className="font-bold">Update API Response:</h3>
            <pre className="text-sm mt-2">{JSON.stringify(result.updateResponse, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
