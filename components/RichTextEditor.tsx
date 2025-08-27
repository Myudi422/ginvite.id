'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  blogId?: string | number; // Optional blog ID for editing
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Tulis konten artikel di sini...",
  height = 400,
  blogId
}: RichTextEditorProps) {
  const editorConfig = {
    height: height,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
      'emoticons', 'paste', 'importcss'
    ],
    toolbar: [
      'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | ',
      'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ',
      'removeformat | link image media table | emoticons charmap | code fullscreen preview'
    ].join(''),
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h1, h2, h3, h4, h5, h6 {
        color: #2d3748;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      p {
        margin-bottom: 1em;
      }
      blockquote {
        border-left: 4px solid #e2e8f0;
        padding-left: 1em;
        margin: 1em 0;
        font-style: italic;
        color: #4a5568;
      }
      code {
        background-color: #f7fafc;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      }
    `,
    placeholder: placeholder,
    // Image upload configuration
    images_upload_url: 'https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php',
    images_upload_base_path: '',
    images_upload_credentials: false,
    images_upload_handler: async (blobInfo: any, progress: any) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        
        // Add blog_id if available
        if (blogId) {
          formData.append('blog_id', blogId.toString());
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php');
        
        xhr.upload.onprogress = (e) => {
          progress(e.loaded / e.total * 100);
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success && response.location) {
                resolve(response.location);
              } else {
                reject(response.error || 'Upload failed');
              }
            } catch (e) {
              reject('Invalid response from server');
            }
          } else {
            reject('HTTP Error: ' + xhr.status);
          }
        };

        xhr.onerror = () => {
          reject('Network error');
        };

        xhr.send(formData);
      });
    },
    // Paste handling for images
    paste_data_images: true,
    paste_as_text: false,
    // Additional configurations
    branding: false,
    promotion: false,
    resize: true,
    autoresize_bottom_margin: 50,
    setup: (editor: any) => {
      editor.on('change', () => {
        onChange(editor.getContent());
      });
      
      // Handle image paste
      editor.on('paste', (e: any) => {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const blob = items[i].getAsFile();
              if (blob) {
                const formData = new FormData();
                formData.append('file', blob, 'pasted-image.png');
                
                // Add blog_id if available
                if (blogId) {
                  formData.append('blog_id', blogId.toString());
                }
                
                fetch('https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php', {
                  method: 'POST',
                  body: formData
                })
                .then(response => response.json())
                .then(data => {
                  if (data.success && data.location) {
                    editor.insertContent(`<img src="${data.location}" alt="Pasted image" />`);
                  }
                })
                .catch(err => {
                  console.error('Image paste failed:', err);
                });
              }
            }
          }
        }
      });
    }
  };

  return (
    <div className="rich-text-editor">
      <Editor
        apiKey="no-api-key" // Using TinyMCE cloud or self-hosted
        value={value}
        init={editorConfig}
        onEditorChange={(content) => onChange(content)}
      />
      <style jsx global>{`
        .tox .tox-editor-header {
          border-radius: 8px 8px 0 0 !important;
          border: 1px solid #f9a8d4 !important;
        }
        .tox .tox-editor-container {
          border-left: 1px solid #f9a8d4 !important;
          border-right: 1px solid #f9a8d4 !important;
        }
        .tox .tox-statusbar {
          border: 1px solid #f9a8d4 !important;
          border-radius: 0 0 8px 8px !important;
        }
        .tox:not(.tox-tinymce-inline) .tox-editor-header {
          background: linear-gradient(to right, #fce7f3, #fdf2f8) !important;
        }
        .tox .tox-toolbar__primary {
          background: transparent !important;
        }
        .tox .tox-button:hover {
          background-color: #f9a8d4 !important;
          border-radius: 4px !important;
        }
        .tox .tox-button--active {
          background-color: #ec4899 !important;
          color: white !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
}
