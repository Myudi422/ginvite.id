'use client';

import { useState } from 'react';

interface Props {
  userId: number;
  onClose: () => void;
  onInvitationCreated: (slug: string) => void;
}

const CreateInvitationPopup: React.FC<Props> = ({ userId, onClose, onInvitationCreated }) => {
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateInvitation = async () => {
    setLoading(true);
    setError('');

    if (!category || !slug) {
      setError('Harap isi semua kolom.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=add_content_user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            category_id: category, // Pastikan mapping ID kategori sudah benar di backend
            title: slug,
            content: '{}', // Inisialisasi dengan JSON kosong
          }),
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        onInvitationCreated(slug);
        onClose();
      } else {
        setError(data.message || 'Gagal membuat undangan.');
      }
    } catch (error) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-pink-100/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 backdrop-blur-lg rounded-2xl p-8
        shadow-2xl border border-pink-200/30 w-full max-w-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text
          text-transparent mb-6">
          Buat Undangan Baru
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100/50 rounded-lg border border-red-200/50">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Kategori Undangan
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-pink-200/50
                focus:ring-2 focus:ring-pink-300 focus:border-transparent text-pink-700 placeholder-pink-400
                transition-all shadow-sm"
            >
              <option value="">Pilih Kategori</option>
              <option value="2">Pernikahan</option>
              <option value="3">Khitanan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              Slug (Judul URL)
            </label>
            <input
              type="text"
              placeholder="contoh: pernikahan-andi-siti"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-pink-200/50
                focus:ring-2 focus:ring-pink-300 focus:border-transparent text-pink-700 placeholder-pink-400
                transition-all shadow-sm"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-pink-200/50 bg-white/50 hover:bg-white/70
                text-pink-600 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleCreateInvitation}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500
                hover:to-pink-600 text-white font-medium transition-all shadow-sm hover:shadow-md
                disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Membuat...' : 'Buat Undangan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvitationPopup;