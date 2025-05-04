'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateInvitationPopup from '@/components/CreateInvitationPopup'; // Import komponen popup

type User = { userId: number; email: string };
interface Invitation { id: number; title: string; status: number; event_date: string; avatar_url: string }
interface Props { user: User; slides: string[]; invitations: Invitation[] }

export default function InvitationDashboard({ user, slides, invitations }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  const prev = () => setCurrent((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  const filtered = invitations.filter((inv) =>
    inv.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCreatePopup = () => setIsCreatePopupOpen(true);
  const closeCreatePopup = () => setIsCreatePopupOpen(false);

  const handleInvitationCreated = (slug: string) => {
    router.push(`/admin/formulir/${user.userId}/${slug}`);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Undangan</h1>
          <p className="text-sm text-gray-500">Login sebagai: {user.email}</p>
        </div>
        <button
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-gray-200">
          <Image src={slides[current]} alt={`Slide ${current + 1}`} fill className="object-cover" />
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white">
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* SEARCH */}
      <div>
        <input
          type="text"
          placeholder="Cari undangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* GRID UNDANGAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((inv) => (
          <div key={inv.id} className="bg-white rounded-2xl shadow p-6 relative flex flex-col">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                {inv.avatar_url && (
                  <Image
                    src={inv.avatar_url}
                    alt={inv.title}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                )}
              </div>
              <h2 className="text-lg font-semibold">{inv.title}</h2>
            </div>

            <div className="mt-4 space-y-1 text-sm text-gray-600 flex-1">
              <p>
                Status:{' '}
                <span className={inv.status === 1 ? 'font-medium text-green-500' : 'font-medium text-red-500'}>
                  {inv.status === 1 ? 'Aktif' : 'Belum Aktif'}
                </span>
              </p>
              <p>Tanggal acara: {inv.event_date}</p>
              <p>
                <a href="#" className="text-blue-600 hover:underline">
                  Preview Undangan
                </a>
              </p>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                className="flex-1 py-2 bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500"
                onClick={() => router.push(`/admin/formulir/${user.userId}/${inv.title}`)}
              >
                Edit di Form
              </button>
              <button
                className="flex-1 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
                onClick={async () => {
                  await fetch(
                    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        user_id: user.userId,
                        id: inv.id,
                        title: inv.title,
                        status: inv.status === 1 ? 0 : 1,
                        event_date: inv.event_date,
                      }),
                    }
                  );
                  router.refresh();
                }}
              >
                {inv.status === 1 ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">Tidak ada undangan ditemukan.</p>
        )}
      </div>
    </div>
  );
}