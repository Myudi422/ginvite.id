// components/InvitationDashboard.tsx (or wherever yours lives)
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateInvitationPopup from '@/components/CreateInvitationPopup';
import ManageSharesModal from '@/components/ManageSharesModal';

type User = { userId: number; email: string };
interface Invitation { 
  id: number; 
  user_id: number; // owner's user_id
  title: string; 
  status: number; 
  event_date: string; 
  avatar_url: string;  
  preview_url: string; 
  category_type: string;
  access_type?: 'owner' | 'shared';
}
interface Props { user: User; slides: string[]; invitations: Invitation[] }

export default function InvitationDashboard({ user, slides, invitations }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState<{open: boolean, invitation?: Invitation}>(() => ({open: false}));
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [sharePopup, setSharePopup] = useState<{open: boolean, invitation?: Invitation}>(() => ({open: false}));
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [manageSharesModal, setManageSharesModal] = useState<{open: boolean, invitation?: Invitation}>(() => ({open: false}));

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    if (menuOpen !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen]);

  const prev = () => setCurrent(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setCurrent(i => (i + 1) % slides.length);

  const filtered = invitations.filter(inv =>
    inv.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCreatePopup = () => setIsCreatePopupOpen(true);
  const closeCreatePopup = () => setIsCreatePopupOpen(false);

  const handleInvitationCreated = (slug: string) => {
    router.push(`/admin/formulir/${user.userId}/${slug}`);
  };

  async function handleDeleteInvitation(invitation: Invitation) {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/page/delete_invitation.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.userId, id: invitation.id }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        setDeletePopup({open: false});
        router.refresh?.(); // Next.js 13+ (app dir) - reload data
        window.location.reload(); // fallback
      } else {
        setDeleteError(json.message || 'Gagal menghapus undangan.');
      }
    } catch (e) {
      setDeleteError('Gagal menghapus undangan.');
    }
    setDeleting(false);
  }

  async function handleShareInvitation(invitation: Invitation) {
    if (!shareEmail) {
      setShareError('Email harus diisi');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareEmail)) {
      setShareError('Format email tidak valid');
      return;
    }

    setShareLoading(true);
    setShareError(null);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=add_invitation_share`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            invitation_id: invitation.id, 
            owner_user_id: user.userId, 
            shared_email: shareEmail,
            can_edit: 1,
            can_manage: 1
          }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        setSharePopup({open: false});
        setShareEmail('');
        alert('Berhasil menambahkan akses!');
      } else {
        setShareError(json.message || 'Gagal menambahkan akses.');
      }
    } catch (e) {
      setShareError('Gagal menambahkan akses.');
    }
    setShareLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard Undangan
          </h1>
          <p className="text-sm text-pink-600 mt-1">Login sebagai: {user.email}</p>
        </div>
        <button
          className="py-3 px-6 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl 
                     shadow-sm hover:from-pink-500 hover:to-pink-600 transition-all transform hover:scale-105
                     backdrop-blur-lg bg-white/30 border border-white/20"
          onClick={openCreatePopup}
        >
          + Bikin Undangan
        </button>
      </div>

      {/* POPUP */}
      {isCreatePopupOpen && (
        <CreateInvitationPopup
          userId={user.userId}
          onClose={closeCreatePopup}
          onInvitationCreated={handleInvitationCreated}
        />
      )}

      {/* POPUP DELETE */}
      {deletePopup.open && deletePopup.invitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2 text-pink-700">Hapus Undangan?</h2>
            <p className="mb-4 text-pink-600">
              Yakin ingin menghapus undangan <b>{deletePopup.invitation.title}</b>? Tindakan ini tidak dapat dibatalkan.
            </p>
            {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => setDeletePopup({open: false})}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                onClick={() => handleDeleteInvitation(deletePopup.invitation!)}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP SHARE BY EMAIL */}
      {sharePopup.open && sharePopup.invitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-2 text-pink-700">Tambah Orang</h2>
            <p className="mb-4 text-pink-600">
              Tambahkan email orang yang bisa edit & manage undangan <b>{sharePopup.invitation.title}</b>
            </p>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => {
                setShareEmail(e.target.value);
                setShareError(null);
              }}
              placeholder="contoh@email.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-3"
              disabled={shareLoading}
            />
            {shareError && <div className="text-red-500 mb-2 text-sm">{shareError}</div>}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => {
                  setSharePopup({open: false});
                  setShareEmail('');
                  setShareError(null);
                }}
                disabled={shareLoading}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                onClick={() => handleShareInvitation(sharePopup.invitation!)}
                disabled={shareLoading}
              >
                {shareLoading ? 'Menambahkan...' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari undangan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-6 py-3 rounded-xl border border-pink-200 focus:outline-none 
                     focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/50 backdrop-blur-md
                     placeholder:text-pink-400 text-pink-600 shadow-sm"
        />
      </div>

      {/* GRID UNDANGAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(inv => (
          <div
            key={inv.id}
            className="bg-white/30 backdrop-blur-md rounded-2xl p-6 relative 
                       border border-white/20 shadow-md hover:shadow-1xl transition-all
                       hover:border-pink-200 group"
          >
            {/* Hanya tampilkan menu untuk owner, bukan untuk shared */}
            {inv.access_type !== 'shared' && (
              <button
                className="absolute top-4 right-4 text-pink-500 hover:text-pink-600 p-1.5 hover:bg-pink-50 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === inv.id ? null : inv.id);
                }}
                aria-label="Opsi undangan"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
            )}

            {/* Popup Menu Overlay */}
            {menuOpen === inv.id && (
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(null)}
              />
            )}
            {menuOpen === inv.id && (
              <div 
                className="absolute right-4 top-12 w-56 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Hanya tampilkan menu share untuk owner */}
                {inv.access_type !== 'shared' && (
                  <>
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                      onClick={() => {
                        setSharePopup({open: true, invitation: inv});
                        setMenuOpen(null);
                      }}
                    >
                      <span className="text-base">👥</span>
                      <div>
                        <div className="font-medium">Tambah Orang</div>
                        <div className="text-xs text-gray-500">Share by email</div>
                      </div>
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                      onClick={() => {
                        setManageSharesModal({open: true, invitation: inv});
                        setMenuOpen(null);
                      }}
                    >
                      <span className="text-base">⚙️</span>
                      <div>
                        <div className="font-medium">Manage Akses</div>
                        <div className="text-xs text-gray-500">Lihat & hapus akses</div>
                      </div>
                    </button>
                  </>
                )}
                {/* Hanya owner yang bisa hapus undangan */}
                {inv.access_type !== 'shared' && (
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    onClick={() => {
                      setDeletePopup({open: true, invitation: inv});
                      setMenuOpen(null);
                    }}
                  >
                    <span className="text-base">🗑️</span>
                    <div>
                      <div className="font-medium">Hapus Undangan</div>
                    </div>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden shadow-md border border-white/30">
                {inv.avatar_url && (
                  <Image
                    src={inv.avatar_url}
                    alt={inv.title}
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                )}
              </div>
              <h2 className="text-lg font-semibold text-pink-800">{inv.title}</h2>
            </div>

            <div className="space-y-3 text-sm mb-6">
              {/* Tipe & Status dalam satu baris */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm ${
                  inv.category_type === 'pernikahan' 
                    ? 'bg-pink-200/80 text-pink-700 border border-pink-300/50' 
                    : inv.category_type === 'khitanan'
                    ? 'bg-purple-200/80 text-purple-700 border border-purple-300/50'
                    : 'bg-rose-200/80 text-rose-700 border border-rose-300/50'
                }`}>
                  {inv.category_type === 'pernikahan' ? '💒 Pernikahan' : 
                   inv.category_type === 'khitanan' ? '🎉 Khitanan' : 
                   `✨ ${inv.category_type}`}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm ${
                  inv.status === 1
                    ? 'bg-green-200/80 text-green-700 border border-green-300/50'
                    : 'bg-orange-200/80 text-orange-700 border border-orange-300/50'
                }`}>
                  {inv.status === 1 ? '✅ Aktif' : '⏳ Draft'}
                </span>
                {inv.access_type === 'shared' && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm bg-blue-200/80 text-blue-700 border border-blue-300/50">
                    🤝 Shared
                  </span>
                )}
              </div>

              {/* Preview Link */}
              <div>
                <a
                  href={`/${inv.preview_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm
                           text-pink-600 rounded-full text-xs font-medium hover:bg-white/80 
                           transition-all shadow-sm hover:shadow-md border border-pink-200/50"
                >
                  👁️ Preview
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 
                           rounded-lg border border-pink-200 hover:border-pink-300 hover:from-pink-200 
                           transition-all shadow-sm"
                onClick={() => router.push(`/admin/formulir/${inv.user_id}/${inv.title}`)}
              >
                Edit
              </button>

              {/* NEW: Manage Button */}
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white 
                           rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all shadow-sm"
                onClick={() => router.push(`/admin/manage/${inv.user_id}/${inv.title}`)}
              >
                Manage
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-pink-500 text-lg">Tidak ada undangan ditemukan 🎀</p>
          </div>
        )}
      </div>

      {/* MANAGE SHARES MODAL */}
      {manageSharesModal.invitation && (
        <ManageSharesModal
          isOpen={manageSharesModal.open}
          onClose={() => setManageSharesModal({open: false})}
          invitation={manageSharesModal.invitation}
          userId={user.userId}
        />
      )}
    </div>
  );
}
