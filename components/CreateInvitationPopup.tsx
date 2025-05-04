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
  const [waktuAcara, setWaktuAcara] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateInvitation = async () => {
    setLoading(true);
    setError('');

    if (!category || !slug || !waktuAcara) {
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
            waktu_acara: waktuAcara,
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
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Buat Undangan Baru</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Kategori Undangan
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            <option value="2">Pernikahan</option> {/* Asumsi ID untuk pernikahan */}
            <option value="3">Khitanan</option> {/* Asumsi ID untuk khitanan */}
            {/* Tambahkan opsi kategori lain sesuai kebutuhan */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">
            Slug (Judul URL)
          </label>
          <input
            type="text"
            id="slug"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="contoh: pernikahan-andi-siti"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="waktu_acara" className="block text-gray-700 text-sm font-bold mb-2">
            Waktu Acara
          </label>
          <input
            type="date"
            id="waktu_acara"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={waktuAcara}
            onChange={(e) => setWaktuAcara(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCreateInvitation}
            disabled={loading}
          >
            {loading ? 'Membuat...' : 'Buat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvitationPopup;