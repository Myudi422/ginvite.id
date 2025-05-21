"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FiCopy } from "react-icons/fi";
import { useSearchParams } from "next/navigation"; // Tetap import ini jika ada query params lain

interface BankTransfer {
  bank_name: string;
  account_number: string;
  account_name: string;
  enabled: boolean;
}

interface BankSectionProps {
  theme: {
    textColor: string;
    bgColor?: string;
    accentColor: string;
    defaultBgImage: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
  bankTransfer: BankTransfer;
}

export default function BankSection({
  theme,
  specialFontFamily,
  bodyFontFamily,
  bankTransfer,
}: BankSectionProps) {
  const [visible, setVisible] = useState(false);
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [formattedJumlah, setFormattedJumlah] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const accountNumberRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  // const userId = searchParams?.get("user_id"); // Hapus baris ini
  const [userIdFromPath, setUserIdFromPath] = useState<string | null>(null);
  const titleFromPath = window.location.pathname.split('/').pop(); // Ambil slug dari URL

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    // Asumsi struktur path adalah /undang/[userId]/[title]
    if (pathParts.length > 2) {
      setUserIdFromPath(pathParts[2]);
    }
  }, []);

  const toggleVisible = () => setVisible((v) => !v);

  const formatToRupiah = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) {
      return "";
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJumlah(value.replace(/[^0-9]/g, ''));
    setFormattedJumlah(formatToRupiah(value));
  };

  const handleCopyAccountNumber = async () => {
    if (accountNumberRef.current) {
      try {
        await navigator.clipboard.writeText(accountNumberRef.current.value);
        alert("Nomor rekening berhasil disalin!");
      } catch (err) {
        console.error("Gagal menyalin nomor rekening:", err);
        alert("Gagal menyalin nomor rekening.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !jumlah.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const formData = {
        nominal: parseFloat(jumlah),
        title: titleFromPath,
        user_id: userIdFromPath, // Gunakan userId dari path
        nama_pemberi: nama,
      };

      const response = await fetch('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Terjadi kesalahan saat mengirim data.');
      }

      const responseData = await response.json();
      setSuccess(true);
      setNama("");
      setJumlah("");
      setFormattedJumlah("");
      console.log('Respons dari server:', responseData);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
    setLoading(false);
  };

  const inputStyles = {
    borderColor: theme.accentColor,
    color: theme.accentColor,
    fontFamily: bodyFontFamily,
  };

  if (!bankTransfer?.enabled) {
    return null;
  }

  return (
    <section
      className="mx-auto p-8 rounded-t-2xl shadow-lg backdrop-blur-sm text-left"
      style={{
        backgroundImage: `url(${theme.defaultBgImage})`,
        color: theme.accentColor,
        fontFamily: bodyFontFamily,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '1rem 1.5rem',
      }}
    >
      <h2
        className="text-2xl font-semibold mb-4 text-center"
        style={{ fontFamily: specialFontFamily }}
      >
        Love Gift
      </h2>
      <p className="text-base mb-6 text-center">
        Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
      </p>

      <Button
        onClick={toggleVisible}
        className="mb-4 w-full"
        style={{ backgroundColor: theme.accentColor, color: theme.bgColor }}
      >
        {visible ? "Sembunyikan Rekening" : "Tampilkan Rekening"}
      </Button>

      {visible && (
        <div className="space-y-5">
          <div
            className="flex items-center border rounded-lg"
            style={{ borderColor: theme.accentColor, padding: '0.75rem' }}
          >
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ color: theme.accentColor }}>
                {bankTransfer.bank_name}
              </div>
              <div className="relative flex items-center">
                <input
                  ref={accountNumberRef}
                  type="text"
                  value={bankTransfer.account_number}
                  readOnly
                  className="w-full text-sm bg-transparent border-none focus:outline-none cursor-text mb-1 pr-8"
                  style={{ color: theme.accentColor, fontFamily: bodyFontFamily }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopyAccountNumber}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <FiCopy className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm" style={{ color: theme.accentColor }}>
                a.n. {bankTransfer.account_name}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-100/80 flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-100/80 flex items-center gap-2">
                <span>Terima kasih! Konfirmasi telah terkirim.</span>
              </div>
            )}

            <div>
              <input
                id="bank-nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Pengirim"
                className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring"
                style={inputStyles}
              />
            </div>

            <div>
              <input
                id="bank-jumlah"
                type="text"
                value={formattedJumlah}
                onChange={handleJumlahChange}
                placeholder="Jumlah Transfer"
                className="w-full pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring"
                style={inputStyles}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: theme.accentColor,
                color: theme.bgColor,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Mengirim..." : "Kirim Konfirmasi"}
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}