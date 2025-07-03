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

  // Tambahan untuk nomor WA
  const [showWaPopup, setShowWaPopup] = useState(false);
  const [waNumber, setWaNumber] = useState('');
  const [waError, setWaError] = useState('');
  const [waLoading, setWaLoading] = useState(false);

  // Handler simpan nomor WA
  const handleSaveWa = async () => {
    setWaError('');
    if (!waNumber.match(/^08[0-9]{8,12}$/)) {
      setWaError('Format nomor WA tidak valid. Contoh: 081234567890');
      return;
    }
    setWaLoading(true);
    try {
      const res = await fetch('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=update_wa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, nomor_wa: waNumber }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setShowWaPopup(false);
        // Setelah berhasil simpan WA, lanjutkan submit undangan
        handleCreateInvitation(true);
      } else {
        setWaError(data.message || 'Gagal simpan nomor WA.');
      }
    } catch {
      setWaError('Gagal simpan nomor WA.');
    } finally {
      setWaLoading(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newSlug = e.target.value.toLowerCase().replace(/\s+/g, '-'); // Ubah spasi jadi - dan lowercase
    newSlug = newSlug.replace(/[^a-z0-9-]/g, ''); // Hapus karakter selain huruf, angka, dan -
    setSlug(newSlug);
  };

  // Cek nomor WA saat submit
  const handleCreateInvitation = async (skipWaCheck = false) => {
    setError('');
    if (!category || !slug) {
      setError('Harap isi semua kolom.');
      return;
    }
    if (!skipWaCheck) {
      // Cek nomor WA ke backend
      try {
        const res = await fetch(
          `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=check_wa&user_id=${userId}`
        );
        const data = await res.json();
        if (data.status !== 'ok' || !data.nomor_wa) {
          setShowWaPopup(true);
          return;
        }
      } catch {
        // Jika fetch gagal (misal error jaringan), tetap tampilkan popup WA
        setShowWaPopup(true);
        return;
      }
    }

    setLoading(true);
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

  // Popup input WA jika belum ada
  if (showWaPopup) {
    return (
      <div className="fixed inset-0 z-50 bg-pink-100/30 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-pink-200/30 w-full max-w-md">
          <h2 className="text-xl font-bold text-pink-600 mb-4">Validasi Nomor WhatsApp</h2>
          <p className="mb-4 text-pink-700 text-sm">
            Sebelum membuat undangan, harap masukkan nomor WhatsApp aktif Anda untuk validasi.
          </p>
          {waError && (
            <div className="mb-3 p-2 bg-red-100/50 rounded border border-red-200/50 text-red-600 text-sm">
              {waError}
            </div>
          )}
          <input
            type="tel"
            placeholder="Contoh: 081234567890"
            value={waNumber}
            onChange={(e) => setWaNumber(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-pink-200/50 text-pink-700 mb-4"
            disabled={waLoading}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowWaPopup(false); setWaNumber(''); setWaError(''); }}
              disabled={waLoading}
              className="px-6 py-2.5 rounded-xl border border-pink-200/50 bg-white/50 text-pink-600 font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSaveWa}
              disabled={waLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium"
            >
              {waLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="mb-4 p-3 bg-yellow-100/50 rounded-md border border-yellow-200/50 text-yellow-700 text-sm">
          <strong className="font-semibold">Penting:</strong> Judul (Slug) tidak bisa diubah setelah dibuat. Hapus formulir untuk mengganti judul.
        </div>

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
              <option value="1">Khitanan</option>
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
              onChange={handleSlugChange} // Gunakan fungsi handleSlugChange
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
              onClick={() => handleCreateInvitation()}
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