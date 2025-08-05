// lib/test-gemini.ts
import { GeminiAPI } from './gemini';

// Test function untuk memverifikasi Gemini API
export async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API...');
    
    const testPrompt = 'Tips memilih tema wedding yang tepat';
    console.log('Test prompt:', testPrompt);
    
    const result = await GeminiAPI.generateBlog(testPrompt);
    
    console.log('✅ Test berhasil!');
    console.log('Title:', result.title);
    console.log('Content length:', result.content.length);
    console.log('Generated slug:', GeminiAPI.generateSlug(result.title));
    
    return result;
  } catch (error) {
    console.error('❌ Test gagal:', error);
    throw error;
  }
}

// Test function untuk regenerate
export async function testRegenerateAPI() {
  try {
    console.log('Testing Regenerate API...');
    
    const originalTitle = 'Tips Wedding';
    const originalContent = 'Wedding adalah momen spesial dalam hidup. Perlu persiapan yang matang.';
    
    const result = await GeminiAPI.regenerateBlog(originalTitle, originalContent);
    
    console.log('✅ Regenerate test berhasil!');
    console.log('New title:', result.title);
    console.log('New content length:', result.content.length);
    
    return result;
  } catch (error) {
    console.error('❌ Regenerate test gagal:', error);
    throw error;
  }
}

// Untuk testing di browser console
if (typeof window !== 'undefined') {
  (window as any).testGemini = testGeminiAPI;
  (window as any).testRegenerate = testRegenerateAPI;
}
