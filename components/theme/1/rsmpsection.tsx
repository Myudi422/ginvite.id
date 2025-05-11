"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaUser, FaWhatsapp, FaComment, FaCalendarCheck, FaPaperPlane } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

interface RsmpSectionProps {
  contentId: number;
  theme: {
    textColor: string;
    bgColor: string;
    accentColor: string;
    defaultBgImage: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
}

export default function RsmpSection({ contentId, theme, specialFontFamily, bodyFontFamily }: RsmpSectionProps) {
  const [nama, setNama] = useState("");
  const [ucapan, setUcapan] = useState("");
  const [wa, setWa] = useState("");
  const [konfirmasi, setKonfirmasi] = useState<"hadir" | "tidak hadir" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !ucapan.trim() || !konfirmasi || !wa.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/rsmp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: contentId, nama, wa, ucapan, konfirmasi }),
      });
      if (!res.ok) throw new Error("Gagal mengirim data");
      setSuccess(true);
      setNama("");
      setWa("");
      setUcapan("");
      setKonfirmasi("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    }
    setLoading(false);
  };

  const inputStyles = {
    borderColor: theme.accentColor,
    color: theme.accentColor,
    fontFamily: bodyFontFamily,
  };

  return (
    <section
      className="max-w-md mx-auto p-8 rounded-tl-2xl shadow-lg backdrop-blur-sm"
      style={{ backgroundImage: `url(${theme.defaultBgImage})`, color: theme.accentColor, fontFamily: bodyFontFamily }}
    >
      <h2
        className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2"
        style={{ fontFamily: specialFontFamily }}
      >
        <FaComment className="inline-block" />
        Ucapan & Konfirmasi
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Pesan Error/Sukses */}
        {error && (
          <div className="p-3 rounded-lg bg-red-100/80 flex items-center gap-2">
            <FaComment className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-green-100/80 flex items-center gap-2">
            <FaComment className="flex-shrink-0" />
            <span>Terima kasih! Ucapan Anda telah terkirim.</span>
          </div>
        )}

        {/* Baris Nama dan WA */}
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
              onChange={(e) => setWa(e.target.value)}
              placeholder="WhatsApp"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring"
              style={inputStyles}
            />
          </div>
        </div>

        {/* Ucapan */}
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

        {/* Konfirmasi Kehadiran */}
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

        {/* Tombol Submit */}
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
    </section>
  );
}