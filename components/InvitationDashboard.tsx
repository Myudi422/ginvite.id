// components/InvitationDashboard.tsx
'use client';


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
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MegaphoneIcon,
  CalendarIcon,
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

// ─── Category label only (no rainbow colors) ───
function getCategoryLabel(type: string) {
  switch (type) {
    case 'pernikahan': return '💒 Pernikahan';
    case 'khitanan': return '🎉 Khitanan';
    default: return `✨ ${type}`;
  }
}

// ─── Expired badge ───
function getExpiredInfo(expiredDate: string | null) {
  if (!expiredDate || expiredDate.startsWith('0000-00-00')) return null;
  const now = new Date();
  const exp = new Date(expiredDate);
  const diffMs = exp.getTime() - now.getTime();
  if (diffMs <= 0) return { text: 'Kedaluwarsa', urgent: true };
  const diffDays = Math.ceil(diffMs / 86400000);
  if (diffDays > 30) return null;
  return { text: `${diffDays} hari lagi`, urgent: diffDays <= 3 };
}

export default function InvitationDashboard({ user, invitations }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState<{ open: boolean; inv?: Invitation }>({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<{ id: number; top: number; right: number } | null>(null);
  const [sharePopup, setSharePopup] = useState<{ open: boolean; inv?: Invitation }>({ open: false });
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [manageSharesModal, setManageSharesModal] = useState<{ open: boolean; inv?: Invitation }>({ open: false });
  const [showPromo, setShowPromo] = useState(true);
  const [promoIdx, setPromoIdx] = useState(0);

  const ANNOUNCEMENTS = [
    {
      text: (
        <>
          🎤 Butuh <strong>MC daerah Bogor</strong>? Kami siap! Mulai dari <strong>Rp&nbsp;200rb/sesi</strong>, bebas acara apapun.{' '}
          <a href="https://wa.me/6289654728249?text=Halo,%20saya%20tertarik%20dengan%20layanan%20MC"
            target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
            Klik di sini
          </a>
        </>
      ),
    },
    {
      text: (
        <>
          Butuh <strong>Jasa Fotografi, Desain, Video Editing</strong>? Kami siap! Harga terjangkau, bebas acara apapun.{' '}
          <a href="https://wa.me/6289654728249?text=Halo,%20saya%20tertarik%20dengan%20layanan%Papunda"
            target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
            Klik di sini
          </a>
        </>
      ),
    },
  ];

  const totalPromo = ANNOUNCEMENTS.length;
  const prevPromo = () => setPromoIdx(i => (i - 1 + totalPromo) % totalPromo);
  const nextPromo = () => setPromoIdx(i => (i + 1) % totalPromo);

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
    <div className="min-h-screen bg-[#fdf7f9]">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-pink-100 sticky top-0 z-20 shadow-[0_1px_0_0_#fce7f3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
              Undangan Saya
            </h1>
            <p className="text-xs text-pink-400 mt-0.5 hidden sm:block">{user.email}</p>
          </div>
          <button
            onClick={() => setIsCreatePopupOpen(true)}
            className="flex items-center gap-2 py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm transition-all font-semibold text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Buat Undangan</span>
          </button>
        </div>
      </div>

      {/* ── PROMO BANNER ── */}
      {showPromo && (
        <div className="bg-pink-50 border-b border-pink-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
            <MegaphoneIcon className="h-3.5 w-3.5 flex-shrink-0 text-pink-400" />
            <p className="flex-1 text-xs text-pink-700 leading-snug min-w-0">
              {ANNOUNCEMENTS[promoIdx].text}
            </p>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={prevPromo} aria-label="Sebelumnya"
                className="p-1 rounded-lg hover:bg-pink-100 transition-colors text-pink-400">
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] text-pink-400 tabular-nums px-0.5">
                {promoIdx + 1}/{totalPromo}
              </span>
              <button onClick={nextPromo} aria-label="Berikutnya"
                className="p-1 rounded-lg hover:bg-pink-100 transition-colors text-pink-400">
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setShowPromo(false)} aria-label="Tutup"
                className="ml-0.5 p-1 rounded-lg hover:bg-pink-100 transition-colors text-pink-400">
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: invitations.length },
            { label: 'Aktif', value: invitations.filter(i => i.status === 1).length },
            { label: 'Draft', value: invitations.filter(i => i.status !== 1).length },
          ].map(s => (
            <div key={s.label} className="bg-white border border-pink-100 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-pink-500">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input
            type="text"
            placeholder="Cari undangan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white shadow-sm text-sm text-gray-700 placeholder:text-gray-300"
          />
        </div>

        {/* ── PANDUAN MINI ── */}
        <div className="bg-white border border-pink-100 rounded-2xl p-4 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-300 mb-3 uppercase tracking-widest">Panduan Cepat</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: PencilIcon, label: 'Edit', desc: 'Ubah nama, foto, tema, dan info acara' },
              { icon: SettingsIcon, label: 'Manage', desc: 'Lihat tamu RSVP, gift, QR & rundown' },
              { icon: EllipsisVerticalIcon, label: 'Menu (⋮)', desc: 'Bagikan undangan atau hapus' },
            ].map(g => (
              <div key={g.label} className="flex items-start gap-3">
                <div className="bg-pink-50 rounded-xl p-2 flex-shrink-0">
                  <g.icon className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{g.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GRID UNDANGAN ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{search ? '🔍' : '🎀'}</div>
            <p className="text-base font-semibold text-gray-600">
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
                className="mt-5 inline-flex items-center gap-2 py-2.5 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm font-semibold text-sm transition-all"
              >
                <PlusIcon className="h-4 w-4" /> Buat Undangan Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(inv => {
              const isActive = inv.status === 1;
              const expiredInfo = isActive ? null : getExpiredInfo(inv.expired);
              const isOwner = inv.access_type !== 'shared';

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                  {/* ── Card Header ── */}
                  <div className="relative p-4 flex items-center gap-3 overflow-hidden">
                    {/* Left accent */}
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-pink-300 rounded-r-full" />

                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50 border border-pink-100">
                      {inv.avatar_url ? (
                        <img
                          src={inv.avatar_url}
                          alt={inv.title}
                          width={48}
                          height={48}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xl">💌</div>
                      )}
                    </div>

                    {/* Title + meta */}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-gray-800 text-sm leading-tight truncate">
                        {inv.title}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">{getCategoryLabel(inv.category_type)}</p>
                    </div>

                    {/* Menu button */}
                    {isOwner && (
                      <div className="flex-shrink-0">
                        <button
                          className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={e => {
                            e.stopPropagation();
                            if (menuOpen?.id === inv.id) { setMenuOpen(null); return; }
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setMenuOpen({ id: inv.id, top: rect.bottom + 6, right: window.innerWidth - rect.right });
                          }}
                          aria-label="Opsi"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Status & Tags ── */}
                  <div className="px-4 pb-3 flex items-center gap-1.5 flex-wrap">
                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${isActive
                      ? 'bg-pink-50 text-pink-600 border border-pink-200'
                      : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-pink-400' : 'bg-gray-400'}`} />
                      {isActive ? 'Aktif' : 'Draft'}
                    </span>

                    {inv.access_type === 'shared' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 text-pink-500 border border-pink-100">
                        🤝 Shared
                      </span>
                    )}

                    {expiredInfo && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${expiredInfo.urgent
                        ? 'bg-red-50 text-red-500 border-red-200'
                        : 'bg-pink-50 text-pink-500 border-pink-100'
                        }`}>
                        ⏳ {expiredInfo.text}
                      </span>
                    )}

                    {inv.event_date && !inv.event_date.startsWith('0000') && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-400 border border-gray-100">
                        <CalendarIcon className="h-2.5 w-2.5" />
                        {new Date(inv.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {/* ── Divider ── */}
                  <div className="mx-4 border-t border-pink-50" />

                  {/* ── Card Footer / Actions ── */}
                  <div className="p-3 flex items-center gap-2">
                    {/* Preview link */}
                    <a
                      href={`/${inv.preview_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
                      title="Lihat tampilan undangan"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>

                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push(`/admin/formulir/${inv.user_id}/${inv.title}`)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-all text-pink-600 font-semibold text-xs"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => router.push(`/admin/manage/${inv.user_id}/${inv.title}`)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs transition-all shadow-sm"
                      >
                        <SettingsIcon className="h-3.5 w-3.5" />
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DROPDOWN MENU (fixed, no stacking context issue) ── */}
      {menuOpen && (() => {
        const openInv = invitations.find(i => i.id === menuOpen.id);
        if (!openInv) return null;
        return (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
            <div
              style={{ position: 'fixed', top: menuOpen.top, right: menuOpen.right }}
              className="w-52 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 flex items-center gap-3 border-b border-gray-100"
                onClick={() => { setSharePopup({ open: true, inv: openInv }); setMenuOpen(null); }}
              >
                <UsersIcon className="h-4 w-4 text-pink-400" />
                <div>
                  <div className="font-medium text-sm">Tambah Akses</div>
                  <div className="text-xs text-gray-400">Share ke orang lain via email</div>
                </div>
              </button>
              <button
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 flex items-center gap-3 border-b border-gray-100"
                onClick={() => { setManageSharesModal({ open: true, inv: openInv }); setMenuOpen(null); }}
              >
                <ShieldCheckIcon className="h-4 w-4 text-pink-400" />
                <div>
                  <div className="font-medium text-sm">Kelola Akses</div>
                  <div className="text-xs text-gray-400">Lihat & cabut akses orang</div>
                </div>
              </button>
              <button
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3"
                onClick={() => { setDeletePopup({ open: true, inv: openInv }); setMenuOpen(null); }}
              >
                <TrashIcon className="h-4 w-4" />
                <div className="font-medium text-sm">Hapus Undangan</div>
              </button>
            </div>
          </>
        );
      })()}

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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-base font-bold text-center text-gray-800 mb-1">Hapus Undangan?</h2>
            <p className="text-sm text-gray-400 text-center mb-5">
              Undangan <span className="font-semibold text-gray-600">&quot;{deletePopup.inv.title}&quot;</span> akan dihapus permanen.
            </p>
            {deleteError && <p className="text-red-500 text-sm text-center mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm transition-colors"
                onClick={() => setDeletePopup({ open: false })}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                onClick={() => handleDelete(deletePopup.inv!)}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharePopup.open && sharePopup.inv && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-6 w-6 text-pink-400" />
            </div>
            <h2 className="text-base font-bold text-center text-gray-800 mb-1">Bagikan Akses</h2>
            <p className="text-sm text-gray-400 text-center mb-5">
              Masukkan email orang yang bisa edit & manage undangan <span className="font-semibold text-gray-600">&quot;{sharePopup.inv.title}&quot;</span>
            </p>
            <input
              type="email"
              value={shareEmail}
              onChange={e => { setShareEmail(e.target.value); setShareError(null); }}
              placeholder="contoh@email.com"
              className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 mb-3 text-sm"
              disabled={shareLoading}
            />
            {shareError && <p className="text-red-500 text-xs mb-3">{shareError}</p>}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm transition-colors"
                onClick={() => { setSharePopup({ open: false }); setShareEmail(''); setShareError(null); }}
                disabled={shareLoading}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm transition-colors"
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
