// components/InvitationDashboard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "lucide-react";

type User = {
  userId: number;
  email: string;
};

interface InvitationDashboardProps {
  user: User;
}

// gunakan satu gambar untuk semua slides dan avatars
const imgUrl =
  "https://i.pinimg.com/736x/b4/5a/34/b45a34d40d047c7f2d70a5e42c494e56.jpg";
const slides = [imgUrl, imgUrl, imgUrl];

const invitations = [
  {
    title: "Khitanan RAFA & FAIZAN",
    status: "Belum Aktif",
    date: "2025-05-11",
    avatar: imgUrl,
  },
  {
    title: "Wedding ALI & SITI",
    status: "Aktif",
    date: "2025-06-20",
    avatar: imgUrl,
  },
  {
    title: "Ulang Tahun RINA",
    status: "Belum Aktif",
    date: "2025-07-05",
    avatar: imgUrl,
  },
];

export default function InvitationDashboard({ user }: InvitationDashboardProps) {
  // state slider & search
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const prev = () =>
    setCurrent((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  // filter undangan
  const filtered = invitations.filter((inv) =>
    inv.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Undangan</h1>
          <p className="text-sm text-gray-500">Login sebagai: {user.email}</p>
        </div>
        <button className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Bikin Undangan
        </button>
      </div>

      {/* Slider */}
      <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-gray-200">
        <Image
          src={slides[current]}
          alt={`Slide ${current + 1}`}
          fill
          className="object-cover"
        />
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Cari undangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid 3 kartu undangan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((inv, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-6 relative flex flex-col"
          >
            {/* kebab menu */}
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src={inv.avatar}
                  alt={inv.title}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold">{inv.title}</h2>
            </div>

            <div className="mt-4 space-y-1 text-sm text-gray-600 flex-1">
              <p>
                Status:{" "}
                <span
                  className={
                    inv.status === "Aktif"
                      ? "font-medium text-green-500"
                      : "font-medium text-red-500"
                  }
                >
                  {inv.status}
                </span>
              </p>
              <p>Tanggal acara: {inv.date}</p>
              <p>
                <a href="#" className="text-blue-600 hover:underline">
                  Pilih Tema
                </a>{" "}
                –{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Preview Undangan
                </a>
              </p>
            </div>

            <div className="mt-6 flex space-x-4">
              <button className="flex-1 py-2 bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500">
                Edit di Form
              </button>
              <button className="flex-1 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600">
                {inv.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Tidak ada undangan ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
