// app/test-gemini/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GeminiAPI } from '@/lib/gemini';
import { testJsonParsing } from '@/lib/test-json-parsing';

export default function TestGeminiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await GeminiAPI.generateBlog('Tips memilih tema wedding yang tepat');
      setResult(result);
      console.log('Test result:', result);
    } catch (err) {
      setError((err as Error).message);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testRegenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await GeminiAPI.regenerateBlog(
        'Tips Wedding',
        'Wedding adalah momen spesial dalam hidup. Perlu persiapan yang matang.'
      );
      setResult(result);
      console.log('Regenerate result:', result);
    } catch (err) {
      setError((err as Error).message);
      console.error('Regenerate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testCreateAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Generate blog data
      const blogData = await GeminiAPI.generateBlog('Tips memilih dekorasi wedding minimalis');
      console.log('Generated blog data for create test:', blogData);
      
      // Step 2: Test create API with FormData
      const slug = GeminiAPI.generateSlug(blogData.title);
      
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('slug', slug);
      formData.append('content', blogData.content);
      formData.append('category', 'Wedding');
      formData.append('status', 'draft');
      
      console.log('Sending create request...');
      const createResponse = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=create',
        {
          method: 'POST',
          body: formData
        }
      );

      const createResult = await createResponse.json();
      console.log('Create API response:', createResult);
      
      setResult({
        generatedData: blogData,
        createResponse: createResult,
        slug: slug
      });
    } catch (err) {
      setError((err as Error).message);
      console.error('Create test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Gemini API</h1>
      
      <div className="space-y-4">
        <div>
          <Button onClick={testGenerate} disabled={loading}>
            {loading ? 'Testing Generate...' : 'Test Generate Blog'}
          </Button>
        </div>
        
        <div>
          <Button onClick={testCreateAPI} disabled={loading}>
            {loading ? 'Testing Create API...' : 'Test Create API'}
          </Button>
        </div>
        
        <div>
          <Button onClick={testRegenerate} disabled={loading}>
            {loading ? 'Testing Regenerate...' : 'Test Regenerate Blog'}
          </Button>
        </div>
        
        <div>
          <Button onClick={() => testJsonParsing()} variant="outline">
            Test JSON Parsing
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
          {/* Generate-only result */}
          {result.title && !result.createResponse && !result.updateResponse && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <h3 className="font-bold">Generated Content:</h3>
              <div className="mt-2">
                <strong>Title:</strong> {result.title}
              </div>
              <div className="mt-2">
                <strong>Content Length:</strong> {result.content.length} characters
              </div>
              <div className="mt-2">
                <strong>Generated Slug:</strong> {GeminiAPI.generateSlug(result.title)}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-semibold">View Content</summary>
                <div className="mt-2 p-2 bg-white border rounded text-sm max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{result.content}</pre>
                </div>
              </details>
            </div>
          )}
          
          {/* Create API test result */}
          {result.createResponse && (
            <>
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <h3 className="font-bold">Generated Content:</h3>
                <div className="mt-2">
                  <strong>Title:</strong> {result.generatedData.title}
                </div>
                <div className="mt-2">
                  <strong>Content Length:</strong> {result.generatedData.content.length} characters
                </div>
                <div className="mt-2">
                  <strong>Generated Slug:</strong> {result.slug}
                </div>
              </div>
              
              <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                <h3 className="font-bold">Create API Response:</h3>
                <pre className="text-sm mt-2">{JSON.stringify(result.createResponse, null, 2)}</pre>
              </div>
            </>
          )}
          
          {/* Regenerate test result */}
          {result.updateResponse && (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
