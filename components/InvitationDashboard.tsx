// components/InvitationDashboard.tsx (or wherever yours lives)
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateInvitationPopup from '@/components/CreateInvitationPopup';

type User = { userId: number; email: string };
interface Invitation { id: number; title: string; status: number; event_date: string; avatar_url: string }
interface Props { user: User; slides: string[]; invitations: Invitation[] }

export default function InvitationDashboard({ user, slides, invitations }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

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

      {/* SLIDER */}
      {slides.length > 0 && (
        <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-3xl mb-8 
                        backdrop-blur-md bg-white/30 border border-white/20 shadow-md">
          <Image
            src={slides[current]}
            alt={`Slide ${current + 1}`}
            fill
            className="object-cover"
            priority
          />
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 backdrop-blur-sm shadow-md transition-all">
            <ChevronLeftIcon className="h-6 w-6 text-pink-600" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 backdrop-blur-sm shadow-md transition-all">
            <ChevronRightIcon className="h-6 w-6 text-pink-600" />
          </button>
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
            <button className="absolute top-4 right-4 text-pink-500 hover:text-pink-600">
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>

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

            <div className="space-y-2 text-sm text-pink-700 mb-6">
              <p>
                Status:{' '}
                <span className={inv.status === 1
                  ? 'font-medium text-green-500'
                  : 'font-medium text-pink-500'
                }>
                  {inv.status === 1 ? 'Aktif' : 'Belum Aktif'}
                </span>
              </p>
              <p>Tanggal acara: <span className="font-medium">{inv.event_date}</span></p>
              <p>
                <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
                  Preview Undangan
                </a>
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 
                           rounded-lg border border-pink-200 hover:border-pink-300 hover:from-pink-200 
                           transition-all shadow-sm"
                onClick={() => router.push(`/admin/formulir/${user.userId}/${inv.title}`)}
              >
                Edit
              </button>

              {/* NEW: Manage Button */}
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white 
                           rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-sm"
                onClick={() => router.push(`/admin/manage/${user.userId}/${inv.title}`)}
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
    </div>
  );
}
