// lib/test-json-parsing.ts
import { GeminiAPI } from './gemini';

// Test cases for different response formats from Gemini
const testResponses = [
  // Case 1: Clean JSON
  `{"title":"Tips Wedding","content":"<h2>Wedding Planning</h2><p>Wedding adalah momen spesial...</p>"}`,
  
  // Case 2: JSON with markdown
  `\`\`\`json
{"title":"Tips Wedding","content":"<h2>Wedding Planning</h2><p>Wedding adalah momen spesial...</p>"}
\`\`\``,
  
  // Case 3: JSON with extra text
  `Here is the blog post:
{"title":"Tips Wedding","content":"<h2>Wedding Planning</h2><p>Wedding adalah momen spesial...</p>"}
This should work well.`,
  
  // Case 4: JSON with quotes in content (problematic)
  `{"title":"Tips Wedding","content":"<h2>Wedding "Perfect" Planning</h2><p>Wedding adalah momen spesial...</p>"}`,
  
  // Case 5: Formatted JSON
  `{
  "title": "Tips Wedding",
  "content": "<h2>Wedding Planning</h2><p>Wedding adalah momen spesial...</p>"
}`
];

export function testJsonParsing() {
  console.log('Testing JSON parsing methods...');
  
  testResponses.forEach((response, index) => {
    console.log(`\n--- Test Case ${index + 1} ---`);
    console.log('Input:', response.substring(0, 100) + '...');
    
    try {
      // Simulate the cleaning process
      const cleaned = (GeminiAPI as any).cleanGeneratedText(response);
      console.log('Cleaned:', cleaned.substring(0, 100) + '...');
      
      const fixed = (GeminiAPI as any).fixJsonQuotes(cleaned);
      const parsed = JSON.parse(fixed);
      
      console.log('✅ Success:', {
        title: parsed.title,
        contentLength: parsed.content?.length || 0
      });
    } catch (error) {
      console.log('❌ Failed:', (error as Error).message);
    }
  });
}

// Make it available in browser console
if (typeof window !== 'undefined') {
  (window as any).testJsonParsing = testJsonParsing;
}
