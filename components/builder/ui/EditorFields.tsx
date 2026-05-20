// components/builder/ui/EditorFields.tsx
'use client';
import React, { useState } from 'react';
import { uploadImageToBackblaze, deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { useBuilder } from '../BuilderContext';
import { Loader2, UploadCloud, Trash2 } from 'lucide-react';

// ── FieldGroup ────────────────────────────────────────────────────────────────
export function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="p-4 space-y-4">{children}</div>;
}

// ── Section separator ─────────────────────────────────────────────────────────
export function FieldSection({ title }: { title: string }) {
  return (
    <div className="pt-2 pb-0">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{title}</p>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 block">{label}</label>
      {hint && <p className="text-[10px] text-gray-400 -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

// ── Text input ────────────────────────────────────────────────────────────────
export function Input({
  value, onChange, placeholder, type = 'text',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
    />
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white resize-none"
    />
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── Toggle (checkbox) ─────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1 ${checked ? 'bg-pink-500' : 'bg-gray-200'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  );
}

// ── Color picker ──────────────────────────────────────────────────────────────
export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
      />
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-pink-200"
      />
    </div>
  );
}

// ── Add item button ───────────────────────────────────────────────────────────
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2 rounded-xl border border-dashed border-pink-200 text-pink-500 text-xs font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5"
    >
      + {label}
    </button>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────
export function ItemCard({ title, onRemove, children }: { title: string; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="flex-1 text-xs font-semibold text-gray-600 truncate">{title}</span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors">✕</button>
      </div>
      <div className="p-3 space-y-3">{children}</div>
    </div>
  );
}

// ── Image Upload Field ────────────────────────────────────────────────────────
export function ImageUploadField({
  value,
  onChange,
  placeholder = "https://...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const { state, registerUploadedImage } = useBuilder();
  const userId = state.page?.user_id;
  
  // Jika page.id tidak tersedia (karena ini Builder yang berbasis slug, bukan id numerik),
  // kita berikan fallback angka unik acak agar script PHP tidak menolaknya (intval(id) == 0).
  const invitationId = state.page?.id || Math.floor(Math.random() * 100000) + 1;

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) {
      alert("Error: Missing userId in builder context.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const url = await uploadImageToBackblaze(formData, userId, invitationId);
      
      // Hapus gambar lama jika ada dan berasal dari server kita (biar hemat storage)
      if (value && (value.includes('backblaze') || value.includes('s3') || value.includes('ccgnimex'))) {
        try {
          await deleteImageFromBackblaze(value);
        } catch (delErr) {
          console.warn("Gagal menghapus gambar lama saat me-replace:", delErr);
        }
      }

      onChange(url);
      registerUploadedImage(url);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    
    // Check if it's a Backblaze URL. If not, just clear it.
    if (!value.includes('backblaze') && !value.includes('s3')) {
      onChange('');
      return;
    }
    
    if (!window.confirm('Hapus gambar ini dari server penyimpanan?')) return;

    setDeleting(true);
    try {
      await deleteImageFromBackblaze(value);
      onChange('');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus gambar');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
            disabled={uploading || deleting}
          />
          
          <label 
            title="Unggah Foto Baru"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-pink-500 hover:bg-pink-50 cursor-pointer rounded-lg transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={uploading || deleting}
            />
          </label>
        </div>

        {value && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={uploading || deleting}
            className="p-2 border border-red-100 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 flex-shrink-0"
            title="Hapus gambar"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
      {(uploading || deleting) && (
        <span className="text-[10px] text-pink-500 font-medium animate-pulse ml-1">
          {uploading ? 'Mengunggah ke server...' : 'Menghapus dari server...'}
        </span>
      )}
    </div>
  );
}
