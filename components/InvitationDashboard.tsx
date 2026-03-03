// components/InvitationDashboard.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  SettingsIcon,
  ExternalLinkIcon,
  TrashIcon,
  UsersIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateInvitationPopup from '@/components/CreateInvitationPopup';
import ManageSharesModal from '@/components/ManageSharesModal';

type User = { userId: number; email: string };
interface Invitation {
  id: number;
  user_id: number;
  title: string;
  status: number;
  event_date: string;
  avatar_url: string;
  preview_url: string;
  category_type: string;
  expired: string;
  access_type?: 'owner' | 'shared';
}
interface Props { user: User; slides?: string[]; invitations: Invitation[] }

// ─── Category color/icon helpers ───
function getCategoryStyle(type: string) {
  switch (type) {
    case 'pernikahan': return { bg: 'bg-pink-100 text-pink-700', label: '💒 Pernikahan' };
    case 'khitanan': return { bg: 'bg-purple-100 text-purple-700', label: '🎉 Khitanan' };
    default: return { bg: 'bg-rose-100 text-rose-700', label: `✨ ${type}` };
  }
}

// ─── Expired badge ───
function getExpiredInfo(expiredDate: string | null) {
  if (!expiredDate || expiredDate.startsWith('0000-00-00')) return null;
  const now = new Date();
  const exp = new Date(expiredDate);
  const diffMs = exp.getTime() - now.getTime();
  if (diffMs <= 0) return { text: 'Expired', cls: 'bg-red-100 text-red-600 border-red-200' };
  const diffDays = Math.ceil(diffMs / 86400000);
  if (diffDays > 30) return null;
  return {
    text: `${diffDays} hari lagi`,
    cls: diffDays <= 3 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100',
  };
}

export default function InvitationDashboard({ user, invitations }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState<{ open: boolean; inv?: Invitation }>({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [sharePopup, setSharePopup] = useState<{ open: boolean; inv?: Invitation }>({ open: false });
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [manageSharesModal, setManageSharesModal] = useState<{ open: boolean; inv?: Invitation }>({ open: false });

  useEffect(() => {
    const close = () => setMenuOpen(null);
    if (menuOpen !== null) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [menuOpen]);

  const filtered = invitations.filter(inv =>
    inv.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(inv: Invitation) {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/delete_invitation.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.userId, id: inv.id }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        setDeletePopup({ open: false });
        window.location.reload();
      } else {
        setDeleteError(json.message || 'Gagal menghapus undangan.');
      }
    } catch {
      setDeleteError('Gagal menghapus undangan.');
    }
    setDeleting(false);
  }

  async function handleShare(inv: Invitation) {
    if (!shareEmail) { setShareError('Email harus diisi'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareEmail)) { setShareError('Format email tidak valid'); return; }
    setShareLoading(true);
    setShareError(null);
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=add_invitation_share',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invitation_id: inv.id, owner_user_id: user.userId, shared_email: shareEmail, can_edit: 1, can_manage: 1 }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        setSharePopup({ open: false });
        setShareEmail('');
        alert('Berhasil menambahkan akses!');
      } else {
        setShareError(json.message || 'Gagal menambahkan akses.');
      }
    } catch {
      setShareError('Gagal menambahkan akses.');
    }
    setShareLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/50 to-white">

      {/* ── HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-pink-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Undangan Saya
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{user.email}</p>
          </div>
          <button
            onClick={() => setIsCreatePopupOpen(true)}
            className="flex items-center gap-2 py-2.5 px-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-md hover:shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition-all font-semibold text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Buat Undangan</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── SEARCH ── */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari undangan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white shadow-sm text-sm"
          />
        </div>

        {/* ── STATS SUMMARY ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Undangan', value: invitations.length, color: 'from-pink-500 to-rose-500' },
            { label: 'Aktif', value: invitations.filter(i => i.status === 1).length, color: 'from-emerald-400 to-teal-500' },
            { label: 'Draft', value: invitations.filter(i => i.status !== 1).length, color: 'from-amber-400 to-orange-400' },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-sm`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-white/75 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── PANDUAN MINI ── */}
        <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">Panduan Cepat</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: PencilIcon, color: 'bg-pink-100 text-pink-600', label: 'Edit', desc: 'Ubah nama, foto, tema, dan informasi acara' },
              { icon: SettingsIcon, color: 'bg-violet-100 text-violet-600', label: 'Manage', desc: 'Lihat tamu RSVP, gift, QR, dan rundown acara' },
              { icon: EllipsisVerticalIcon, color: 'bg-blue-100 text-blue-600', label: 'Menu (⋮)', desc: 'Bagikan undangan ke orang lain, atau hapus' },
            ].map(g => (
              <div key={g.label} className="flex items-start gap-3">
                <div className={`${g.color} rounded-xl p-2 flex-shrink-0`}>
                  <g.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{g.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GRID UNDANGAN ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{search ? '🔍' : '🎀'}</div>
            <p className="text-lg font-semibold text-gray-600">
              {search ? 'Tidak ada hasil' : 'Belum ada undangan'}
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
              {search
                ? `Tidak ditemukan undangan dengan kata "${search}"`
                : 'Klik tombol "Buat Undangan" di atas untuk mulai membuat undangan pertamamu!'}
            </p>
            {!search && (
              <button
                onClick={() => setIsCreatePopupOpen(true)}
                className="mt-5 inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-md font-semibold text-sm hover:shadow-pink-200 transition-all"
              >
                <PlusIcon className="h-4 w-4" /> Buat Undangan Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(inv => {
              const catStyle = getCategoryStyle(inv.category_type);
              const expiredInfo = getExpiredInfo(inv.expired);
              const isOwner = inv.access_type !== 'shared';

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                  {/* Card Top — Avatar + info */}
                  <div className="relative bg-gradient-to-br from-pink-300 via-pink-400 to-rose-300 p-5 pb-4">
                    {/* menu button */}
                    {isOwner && (
                      <div className="absolute top-3 right-3">
                        <button
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 shadow-sm transition-colors"
                          onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === inv.id ? null : inv.id); }}
                          aria-label="Opsi"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>

                        {/* Dropdown menu */}
                        {menuOpen === inv.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                            <div
                              className="absolute right-0 top-9 w-52 bg-white rounded-2xl shadow-xl z-50 border border-gray-100 overflow-hidden"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 flex items-center gap-3 border-b border-gray-50"
                                onClick={() => { setSharePopup({ open: true, inv }); setMenuOpen(null); }}
                              >
                                <UsersIcon className="h-4 w-4 text-pink-500" />
                                <div>
                                  <div className="font-medium">Tambah Akses</div>
                                  <div className="text-xs text-gray-400">Share ke orang lain via email</div>
                                </div>
                              </button>
                              <button
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 flex items-center gap-3 border-b border-gray-50"
                                onClick={() => { setManageSharesModal({ open: true, inv }); setMenuOpen(null); }}
                              >
                                <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
                                <div>
                                  <div className="font-medium">Kelola Akses</div>
                                  <div className="text-xs text-gray-400">Lihat & cabut akses orang</div>
                                </div>
                              </button>
                              <button
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                onClick={() => { setDeletePopup({ open: true, inv }); setMenuOpen(null); }}
                              >
                                <TrashIcon className="h-4 w-4" />
                                <div className="font-medium">Hapus Undangan</div>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md border-2 border-white flex-shrink-0 bg-pink-100">
                        {inv.avatar_url ? (
                          <Image
                            src={inv.avatar_url}
                            alt={inv.title}
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-2xl">💌</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pr-6">
                        <h2 className="font-bold text-gray-800 truncate">{inv.title}</h2>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catStyle.bg}`}>
                            {catStyle.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inv.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                            {inv.status === 1 ? '✅ Aktif' : '⏳ Draft'}
                          </span>
                          {inv.access_type === 'shared' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              🤝 Shared
                            </span>
                          )}
                        </div>
                        {expiredInfo && (
                          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${expiredInfo.cls}`}>
                            ⏳ {expiredInfo.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="px-5">
                    <div className="border-t border-gray-100" />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    {/* Preview link */}
                    <a
                      href={`/${inv.preview_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-700 font-medium transition-colors"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                      Lihat Tampilan Undangan
                    </a>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => router.push(`/admin/formulir/${inv.user_id}/${inv.title}`)}
                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 hover:border-pink-200 transition-all group"
                      >
                        <PencilIcon className="h-5 w-5 text-pink-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-pink-600">Edit</span>
                        <span className="text-[10px] text-pink-400 text-center leading-tight">Ubah isi undangan</span>
                      </button>

                      <button
                        onClick={() => router.push(`/admin/manage/${inv.user_id}/${inv.title}`)}
                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl bg-gradient-to-b from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border border-transparent transition-all group shadow-sm"
                      >
                        <SettingsIcon className="h-5 w-5 text-white group-hover:rotate-45 transition-transform duration-300" />
                        <span className="text-xs font-semibold text-white">Manage</span>
                        <span className="text-[10px] text-white/70 text-center leading-tight">Tamu, gift & fitur</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── POPUPS ── */}
      {isCreatePopupOpen && (
        <CreateInvitationPopup
          userId={user.userId}
          onClose={() => setIsCreatePopupOpen(false)}
          onInvitationCreated={slug => router.push(`/admin/formulir/${user.userId}/${slug}`)}
        />
      )}

      {/* Delete Modal */}
      {deletePopup.open && deletePopup.inv && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-center text-gray-800 mb-1">Hapus Undangan?</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Undangan <span className="font-semibold text-gray-700">"{deletePopup.inv.title}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            {deleteError && <p className="text-red-500 text-sm text-center mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
                onClick={() => setDeletePopup({ open: false })}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                onClick={() => handleDelete(deletePopup.inv!)}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharePopup.open && sharePopup.inv && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-7 w-7 text-pink-500" />
            </div>
            <h2 className="text-lg font-bold text-center text-gray-800 mb-1">Bagikan Akses</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Masukkan email orang yang bisa edit & manage undangan <span className="font-semibold text-gray-700">"{sharePopup.inv.title}"</span>
            </p>
            <input
              type="email"
              value={shareEmail}
              onChange={e => { setShareEmail(e.target.value); setShareError(null); }}
              placeholder="contoh@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 mb-3 text-sm"
              disabled={shareLoading}
            />
            {shareError && <p className="text-red-500 text-xs mb-3">{shareError}</p>}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
                onClick={() => { setSharePopup({ open: false }); setShareEmail(''); setShareError(null); }}
                disabled={shareLoading}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm transition-colors"
                onClick={() => handleShare(sharePopup.inv!)}
                disabled={shareLoading}
              >
                {shareLoading ? 'Menambahkan...' : 'Tambah Akses'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Shares */}
      {manageSharesModal.inv && (
        <ManageSharesModal
          isOpen={manageSharesModal.open}
          onClose={() => setManageSharesModal({ open: false })}
          invitation={manageSharesModal.inv}
          userId={user.userId}
        />
      )}
    </div>
  );
}
