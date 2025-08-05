// app/test-gemini/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GeminiAPI } from '@/lib/gemini';

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
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Success!</h3>
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
    </div>
  );
}
