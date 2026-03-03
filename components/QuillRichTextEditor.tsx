'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  blogId?: string | number;
}

const IMAGE_UPLOAD_URL =
  'https://ccgnimex.my.id/v2/android/ginvite/page/image_upload.php';

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis konten artikel di sini...',
  height = 400,
  blogId,
}: RichTextEditorProps) {
  // wrapperRef → div stabil yang selalu ada di DOM
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const mountedRef = useRef(false);
  const [ready, setReady] = useState(false);

  /* ─── upload helper ─── */
  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      const fd = new FormData();
      fd.append('file', file);
      if (blogId) fd.append('blog_id', blogId.toString());
      try {
        const res = await fetch(IMAGE_UPLOAD_URL, { method: 'POST', body: fd });
        const json = await res.json();
        if (json.success && json.location) return json.location as string;
        console.error('Upload gagal:', json.error ?? json);
        return null;
      } catch (err) {
        console.error('Upload error:', err);
        return null;
      }
    },
    [blogId]
  );

  /* ─── inisialisasi Quill ─── */
  useEffect(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    // Jika toolbar sudah ada di DOM (StrictMode double-mount / HMR),
    // hapus semua child Quill dulu agar tidak terjadi double toolbar
    Array.from(wrapper.children).forEach((child) => {
      if (
        child.classList.contains('ql-toolbar') ||
        child.classList.contains('ql-container') ||
        (child as HTMLElement).dataset.quill
      ) {
        child.remove();
      }
    });

    // Jika instance Quill sudah ada, hapus juga
    if (quillRef.current) {
      try { quillRef.current.off('text-change'); } catch { }
      quillRef.current = null;
    }

    mountedRef.current = true;

    (async () => {
      const wrapperEl = wrapperRef.current;
      if (!wrapperEl) return;

      // Bersihkan isi wrapper dan buat div target Quill yang segar
      // (hapus sisa children non-Quill)
      wrapperEl.innerHTML = '';
      const editorEl = document.createElement('div');
      editorEl.dataset.quill = 'true';
      wrapperEl.appendChild(editorEl);

      const Quill = (await import('quill')).default;

      quillRef.current = new Quill(editorEl, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['blockquote', 'code-block'],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.click();
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) insertImage(url);
                  else alert('Gagal mengupload gambar. Coba lagi.');
                };
              },
            },
          },
        },
      });

      // Set konten awal
      if (value) quillRef.current.root.innerHTML = value;

      // text-change
      quillRef.current.on('text-change', () =>
        onChange(quillRef.current.root.innerHTML)
      );

      // Paste image
      quillRef.current.root.addEventListener('paste', async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (!file) continue;
            e.preventDefault();
            const url = await uploadImage(file);
            if (url) insertImage(url);
          }
        }
      });

      // Drop image
      quillRef.current.root.addEventListener('drop', async (e: DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer?.files ?? [];
        for (const file of Array.from(files)) {
          if (file.type.startsWith('image/')) {
            const url = await uploadImage(file);
            if (url) insertImage(url);
          }
        }
      });

      setReady(true);
    })();

    return () => {
      // Cleanup saat komponen unmount — hapus juga DOM Quill agar mount berikutnya bersih
      if (quillRef.current) {
        try { quillRef.current.off('text-change'); } catch { }
        quillRef.current = null;
      }
      mountedRef.current = false;
      setReady(false);
      // Hapus semua child Quill dari wrapper agar tidak tersisa di DOM
      if (wrapperRef.current) {
        Array.from(wrapperRef.current.children).forEach((child) => {
          if (
            child.classList.contains('ql-toolbar') ||
            child.classList.contains('ql-container') ||
            (child as HTMLElement).dataset.quill
          ) {
            child.remove();
          }
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── helper insert gambar ─── */
  function insertImage(url: string) {
    const q = quillRef.current;
    if (!q) return;
    const range = q.getSelection(true) ?? { index: 0 };
    q.insertEmbed(range.index, 'image', url);
    q.setSelection(range.index + 1);
  }

  /* ─── sync nilai dari luar (misal: reset form) ─── */
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (!ready || !quillRef.current) return;
    // Hanya update bila nilainya berbeda dengan yang di-render terakhir
    // dan berbeda dari yang ada di editor sekarang
    const current = quillRef.current.root.innerHTML;
    if (value !== prevValueRef.current && value !== current) {
      quillRef.current.root.innerHTML = value;
    }
    prevValueRef.current = value;
  }, [value, ready]);

  return (
    <>
      <div
        ref={wrapperRef}
        className="quill-blog-editor"
        style={{ minHeight: height + 42 }}
      />

      <style>{`
        .quill-blog-editor .ql-toolbar.ql-snow {
          border: 1.5px solid #f9a8d4 !important;
          border-bottom: none !important;
          border-radius: 10px 10px 0 0 !important;
          background: linear-gradient(135deg,#fce7f3,#fdf2f8) !important;
          position: sticky;
          top: 56px;
          z-index: 20;
          box-shadow: 0 2px 8px rgba(236,72,153,.07);
        }
        .quill-blog-editor .ql-container.ql-snow {
          border: 1.5px solid #f9a8d4 !important;
          border-radius: 0 0 10px 10px !important;
          font-family: -apple-system,'Segoe UI',Roboto,sans-serif !important;
        }
        .quill-blog-editor .ql-editor {
          min-height: ${height}px !important;
          font-size: 15px !important;
          line-height: 1.75 !important;
          padding: 16px 20px !important;
          color: #1e293b !important;
        }
        .quill-blog-editor .ql-editor.ql-blank::before {
          color: #c4a4b8 !important;
          font-style: normal !important;
        }
        .quill-blog-editor .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,.1) !important;
          margin: 8px 0 !important;
          display: block;
        }
        .quill-blog-editor .ql-toolbar .ql-stroke { stroke: #db2777 !important; }
        .quill-blog-editor .ql-toolbar .ql-fill   { fill:   #db2777 !important; }
        .quill-blog-editor .ql-toolbar button:hover {
          background: #fce7f3 !important;
          border-radius: 4px !important;
        }
        .quill-blog-editor .ql-toolbar button.ql-active {
          background: #ec4899 !important;
          border-radius: 4px !important;
        }
        .quill-blog-editor .ql-toolbar button.ql-active .ql-stroke { stroke: #fff !important; }
        .quill-blog-editor .ql-toolbar button.ql-active .ql-fill   { fill:   #fff !important; }
        .quill-blog-editor .ql-snow .ql-picker-label { color: #db2777 !important; }
        .quill-blog-editor .ql-snow .ql-picker.ql-expanded .ql-picker-label,
        .quill-blog-editor .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: #ec4899 !important;
        }
        .quill-blog-editor .ql-snow a { color: #ec4899 !important; }
        .quill-blog-editor .ql-editor blockquote {
          border-left: 4px solid #f9a8d4 !important;
          background: #fdf2f8 !important;
          padding: 8px 16px !important;
          border-radius: 0 8px 8px 0 !important;
        }
      `}</style>
    </>
  );
}
