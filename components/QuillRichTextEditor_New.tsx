'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  blogId?: string | number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Tulis konten artikel di sini...",
  height = 400,
  blogId
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Quill dynamically to avoid SSR issues
    const loadQuill = async () => {
      if (typeof window !== 'undefined' && !quillInstance.current) {
        const Quill = (await import('quill')).default;
        
        if (editorRef.current) {
          // Custom toolbar configuration
          const toolbarOptions = [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
          ];

          // Initialize Quill
          quillInstance.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: placeholder,
            modules: {
              toolbar: {
                container: toolbarOptions,
                handlers: {
                  image: () => handleImageUpload()
                }
              }
            }
          });

          // Set initial content
          if (value) {
            quillInstance.current.root.innerHTML = value;
          }

          // Listen for text changes
          quillInstance.current.on('text-change', () => {
            const content = quillInstance.current.root.innerHTML;
            onChange(content);
          });

          // Handle paste events for images
          quillInstance.current.root.addEventListener('paste', handlePaste);

          setIsLoaded(true);
        }
      }
    };

    loadQuill();

    // Cleanup
    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change');
        quillInstance.current.root.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (quillInstance.current && isLoaded && value !== quillInstance.current.root.innerHTML) {
      const selection = quillInstance.current.getSelection();
      quillInstance.current.root.innerHTML = value;
      if (selection) {
        quillInstance.current.setSelection(selection);
      }
    }
  }, [value, isLoaded]);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        await uploadImage(file);
      }
    };
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (blogId) {
      formData.append('blog_id', blogId.toString());
    }

    try {
      const response = await fetch('https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.location && quillInstance.current) {
        // Insert image into editor
        const range = quillInstance.current.getSelection(true);
        quillInstance.current.insertEmbed(range.index, 'image', data.location);
        quillInstance.current.setSelection(range.index + 1);
      } else {
        alert('Gagal mengupload gambar: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar');
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            await uploadImage(file);
          }
        }
      }
    }
  };

  return (
    <div className="rich-text-editor">
      <div 
        ref={editorRef} 
        style={{ height: `${height}px` }}
        className="bg-white border border-pink-200 rounded-lg"
      />
      <p className="text-sm text-pink-500 mt-2">
        Anda dapat menyisipkan gambar dengan:
        <br />• Klik tombol gambar di toolbar
        <br />• Copy paste gambar dari clipboard
      </p>
      
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: 1px solid #f9a8d4 !important;
          border-bottom: none !important;
          border-radius: 8px 8px 0 0 !important;
          background: linear-gradient(to right, #fce7f3, #fdf2f8) !important;
        }
        
        .ql-container.ql-snow {
          border: 1px solid #f9a8d4 !important;
          border-radius: 0 0 8px 8px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        .ql-editor {
          min-height: ${height - 42}px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        .ql-toolbar .ql-stroke {
          stroke: #ec4899 !important;
        }
        
        .ql-toolbar .ql-fill {
          fill: #ec4899 !important;
        }
        
        .ql-toolbar button:hover {
          background-color: #f9a8d4 !important;
          border-radius: 4px !important;
        }
        
        .ql-toolbar button.ql-active {
          background-color: #ec4899 !important;
          color: white !important;
          border-radius: 4px !important;
        }
        
        .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          border-color: #ec4899 !important;
        }
        
        .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: #ec4899 !important;
        }
      `}</style>
    </div>
  );
}
