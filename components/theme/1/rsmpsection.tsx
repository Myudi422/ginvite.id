"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaUser, FaWhatsapp, FaComment, FaCalendarCheck, FaPaperPlane } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

interface RsmpSectionProps {
  theme: {
    textColor: string;
    bgColor: string;
    accentColor: string;
    background: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
  contentUserId: number;
}

interface RsvpData {
  nama: string;
  wa: string;
  ucapan: string;
  konfirmasi: 'hadir' | 'tidak hadir';
  created_at: string;
}

const timeAgo = (dateString: string) => {
  const utcDate = new Date(dateString);
  const jakartaOffset = 7 * 60; // in minutes
  const localDate = new Date(utcDate.getTime() + jakartaOffset * 60000); // convert to GMT+7

  const now = new Date();
  const diff = now.getTime() - localDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} bulan yang lalu`;
  if (weeks > 0) return `${weeks} minggu yang lalu`;
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  return `${minutes} menit yang lalu`;
};


export default function RsmpSection({ theme, specialFontFamily, bodyFontFamily, contentUserId, }: RsmpSectionProps) {
  const [nama, setNama] = useState("");
  const [ucapan, setUcapan] = useState("");
  const [wa, setWa] = useState("");
  const [konfirmasi, setKonfirmasi] = useState<"hadir" | "tidak hadir" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const [userIdFromPath, setUserIdFromPath] = useState<string | null>(null);
  const titleFromPath = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  const [rsvpList, setRsvpList] = useState<RsvpData[]>([]);
  const [loadingRsvp, setLoadingRsvp] = useState(true);
  const [errorRsvp, setErrorRsvp] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState(5);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'undang') {
      const userId = pathParts[2];
      const title = pathParts.pop();
      setUserIdFromPath(userId);
      fetchRsvpList(userId, title || '');
    }
  }, []);

  const fetchRsvpList = async (userId: string, title: string) => {
    setLoadingRsvp(true);
    setErrorRsvp(null);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_rsmp&user_id=${userId}&title=${title}`
      );

      if (!res.ok) throw new Error('Gagal mengambil daftar RSVP');

      const data = await res.json();
      if (data.status === 'success') {
        setRsvpList(data.data.reverse());
      } else {
        throw new Error(data?.message || 'Gagal mengambil data');
      }
    } catch (err: any) {
      console.error(err);
      setErrorRsvp(err.message);
    } finally {
      setLoadingRsvp(false);
    }
  };

  const handleKeyPressWa = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !ucapan.trim() || !konfirmasi || !wa.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (wa.trim().length < 10) {
      setError("Nomor WhatsApp tidak valid.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://ccgnimex.my.id/v2/android/ginvite/index.php?action=rsmp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userIdFromPath,
          title: titleFromPath,
          nama,
          wa,
          ucapan,
          konfirmasi,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim data");

      setSuccess(true);
      resetForm();
      if (userIdFromPath && titleFromPath) {
        await fetchRsvpList(userIdFromPath, titleFromPath);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setNama("");
    setWa("");
    setUcapan("");
    setKonfirmasi("");
  };

  const loadMoreComments = () => {
    setVisibleComments(prev => prev + 5);
  };

  const ProfileInitial = ({ name }: { name: string }) => (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
      style={{
        backgroundColor: theme.accentColor,
        color: theme.bgColor,
        fontFamily: specialFontFamily
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );

  const inputStyles = {
    borderColor: theme.accentColor,
    color: theme.accentColor,
    fontFamily: bodyFontFamily,
  };

  return (
    <section
      className="mx-auto p-6 shadow-lg backdrop-blur-sm"
      style={{
        backgroundImage: `url(${theme.background})`,
        color: theme.accentColor,
        fontFamily: bodyFontFamily
      }}
    >
      <h2
        className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2"
        style={{ fontFamily: specialFontFamily }}
      >
        <FaComment className="inline-block" />
        Ucapan & Konfirmasi
      </h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-2">
        {error && (
          <div className="p-3 rounded-lg bg-red-100/80 flex items-center gap-2 text-red-800">
            <FaComment className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-green-100/80 flex items-center gap-2 text-green-800">
            <FaComment className="flex-shrink-0" />
            <span>Terima kasih! Ucapan Anda telah terkirim.</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaUser className="absolute top-3 left-3" style={{ color: theme.accentColor }} />
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Lengkap"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring"
              style={inputStyles}
            />
          </div>

          <div className="flex-1 relative">
            <FaWhatsapp className="absolute top-3 left-3" style={{ color: theme.accentColor }} />
            <input
              id="wa"
              type="tel"
              value={wa}
              onKeyPress={handleKeyPressWa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="WhatsApp"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring"
              style={inputStyles}
            />
          </div>
        </div>

        <div className="relative">
          <FaComment className="absolute top-3 left-3" style={{ color: theme.accentColor }} />
          <textarea
            id="ucapan"
            value={ucapan}
            onChange={(e) => setUcapan(e.target.value)}
            placeholder="Tulis ucapan dan doa..."
            rows={3}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring"
            style={inputStyles}
          />
        </div>

        <div className="relative">
          <FaCalendarCheck className="absolute top-3 left-3" style={{ color: theme.accentColor }} />
          <select
            id="konfirmasi"
            value={konfirmasi}
            onChange={(e) => setKonfirmasi(e.target.value as any)}
            className="w-full pl-10 pr-8 py-2 border rounded-lg appearance-none focus:outline-none focus:ring"
            style={inputStyles}
          >
            <option value="">Konfirmasi Kehadiran</option>
            <option value="hadir">Hadir</option>
            <option value="tidak hadir">Tidak Hadir</option>
          </select>
          <FiChevronDown className="absolute top-3 right-3 pointer-events-none" />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: theme.accentColor,
            color: theme.bgColor,
            opacity: loading ? 0.7 : 1
          }}
        >
          <FaPaperPlane className="mr-2" />
          {loading ? "Mengirim..." : "Kirim Ucapan"}
        </Button>
      </form>

      <Button
        onClick={() => setShowComments(prev => !prev)}
        className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] mb-4"
        variant="outline"
        style={{
          borderColor: theme.accentColor,
          color: theme.accentColor,
          fontFamily: specialFontFamily
        }}
      >
        {showComments ? 'Sembunyikan Ucapan' : `Tampilkan Ucapan (${rsvpList.length})`}
      </Button>


      {/* Comments Section */}
      {showComments && (
        <div
  className="rounded-xl shadow-md space-y-4 max-h-96 overflow-y-auto"
  style={{
    backgroundColor: `${theme.bgColor}cc`,
    border: `1px solid ${theme.accentColor}30`
  }}
>

          {loadingRsvp ? (
            <div className="text-center py-4">Memuat ucapan...</div>
          ) : errorRsvp ? (
            <div className="text-red-500 text-center py-4">{errorRsvp}</div>
          ) : rsvpList.length > 0 ? (
            <>
              <div
                className=" p-4 space-y-5 shadow-md"
                style={{
                  backgroundColor: `${theme.bgColor}cc`,
                  border: `1px solid ${theme.accentColor}30`
                }}
              >
                {rsvpList.slice(0, visibleComments).map((rsvp, index) => (
                  <div key={index} className="flex gap-3 items-start" style={{ color: theme.textColor }}>
                    <ProfileInitial name={rsvp.nama} />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span
                            className="font-semibold text-sm block truncate max-w-[180px] text-left"
                            style={{ color: theme.accentColor }}
                            title={rsvp.nama}
                          >
                            {rsvp.nama}
                          </span>
                          <span
                            className="text-xs opacity-75 mb-1 block text-left"
                            style={{ color: theme.accentColor }}
                          >
                            {timeAgo(rsvp.created_at)}
                          </span>
                        </div>
                        <div className="text-lg flex-shrink-0">
                          {rsvp.konfirmasi === 'hadir' ? '✅' : '❌'}
                        </div>
                      </div>
                      <p
                        className="text-sm mt-1 break-words text-left"
                        style={{ color: theme.accentColor }}
                      >
                        {rsvp.ucapan}
                      </p>
                    </div>
                  </div>
                ))}
                {visibleComments < rsvpList.length && (
  <div className="text-center pt-4">
    <Button
      onClick={loadMoreComments}
      variant="outline"
      className="text-sm px-6"
      style={{
        borderColor: theme.accentColor,
        color: theme.accentColor
      }}
    >
      Muat Lebih Banyak
    </Button>
  </div>
)}

              </div>
            </>
          ) : (
            <div className="text-center py-4">Belum ada ucapan</div>
          )}
        </div>
      )}
    </section>
  );
}