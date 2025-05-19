"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";

interface BankTransfer {
  bank_name: string;
  account_number: string;
  account_name: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleVisible = () => setVisible((v) => !v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !jumlah.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      // placeholder for API call
      await new Promise((res) => setTimeout(res, 1000));
      setSuccess(true);
      setNama("");
      setJumlah("");
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
            className="flex items-center p-4 border rounded-lg"
            style={{ borderColor: theme.accentColor }}
          >
            <div className="w-16 h-16 relative mr-4">
              <Image
                src={`https://logo.clearbit.com/${bankTransfer.bank_name.toLowerCase()}.co.id`}
                alt={`${bankTransfer.bank_name} logo`}
                fill
                objectFit="contain"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ color: theme.accentColor }}>
                {bankTransfer.bank_name}
              </div>
              <input
                type="text"
                value={bankTransfer.account_number}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full text-sm bg-transparent border-none focus:outline-none cursor-text mb-1"
                style={{ color: theme.accentColor, fontFamily: bodyFontFamily }}
              />
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
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
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