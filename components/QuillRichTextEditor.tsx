'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

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
  const [uploadedImages, setUploadedImages] = useState<Set<string>>(new Set());
  const isInitializing = useRef(false);

  // Track content changes to detect deleted images
  const trackImageDeletion = useCallback((newContent: string, oldContent: string) => {
    if (!oldContent || !newContent) return;

    // Extract image URLs from old and new content
    const oldImages = Array.from(oldContent.matchAll(/src="([^"]*uploads\/editor\/[^"]*)"/g))
      .map(match => match[1]);
    const newImages = Array.from(newContent.matchAll(/src="([^"]*uploads\/editor\/[^"]*)"/g))
      .map(match => match[1]);

    // Find deleted images
    const deletedImages = oldImages.filter(img => !newImages.includes(img));
    
    // Mark images as unused in database
    deletedImages.forEach(imageUrl => {
      markImageAsUnused(imageUrl);
    });
  }, []);

  const markImageAsUnused = async (imageUrl: string) => {
    try {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop();
      if (!filename) return;

      // Use local API endpoint instead of remote URL for development
      const apiUrl = window.location.hostname === 'localhost' 
        ? '/api/page/blog_images.php?action=mark_unused_single'
        : 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=mark_unused_single';

      const formData = new FormData();
      formData.append('filename', filename);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status === 'success') {
        console.log('Image marked as unused:', filename);
      }
    } catch (error) {
      console.error('Error marking image as unused:', error);
      // Fail silently for now, as this is not critical functionality
    }
  };

  useEffect(() => {
    // Prevent double initialization
    if (isInitializing.current || quillInstance.current) return;
    
    // Load Quill dynamically to avoid SSR issues
    const loadQuill = async () => {
      if (typeof window !== 'undefined' && editorRef.current) {
        isInitializing.current = true;
        
        try {
          const Quill = (await import('quill')).default;

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

          let lastContent = value;

          // Listen for text changes with image deletion tracking
          quillInstance.current.on('text-change', () => {
            const newContent = quillInstance.current.root.innerHTML;
            
            // Track deleted images
            trackImageDeletion(newContent, lastContent);
            lastContent = newContent;
            
            // Call onChange
            onChange(newContent);
          });

          // Handle paste events for images
          quillInstance.current.root.addEventListener('paste', handlePaste);

          setIsLoaded(true);
        } catch (error) {
          console.error('Error loading Quill:', error);
        } finally {
          isInitializing.current = false;
        }
      }
    };

    loadQuill();

    // Cleanup
    return () => {
      if (quillInstance.current) {
        try {
          quillInstance.current.off('text-change');
          if (quillInstance.current.root) {
            quillInstance.current.root.removeEventListener('paste', handlePaste);
          }
          quillInstance.current = null;
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
      isInitializing.current = false;
    };
  }, []); // Empty dependency array to run only once

  // Update content when value prop changes (but not during initialization)
  useEffect(() => {
    if (quillInstance.current && isLoaded && !isInitializing.current) {
      const currentContent = quillInstance.current.root.innerHTML;
      if (value !== currentContent) {
        const selection = quillInstance.current.getSelection();
        quillInstance.current.root.innerHTML = value;
        if (selection) {
          try {
            quillInstance.current.setSelection(selection);
          } catch (error) {
            // Ignore selection errors
          }
        }
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
      // Use local API endpoint for development
      const apiUrl = window.location.hostname === 'localhost' 
        ? '/api/page/image_upload.php'
        : 'https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.location && quillInstance.current) {
        // Track uploaded image
        setUploadedImages(prev => new Set(prev.add(data.location)));
        
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

  // Only render once to prevent double editor
  if (!editorRef.current && typeof window !== 'undefined') {
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
