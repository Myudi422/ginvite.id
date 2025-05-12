"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";

interface BankCard {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoSrc: string;
}

interface BankSectionProps {
  theme: {
    textColor: string;
    bgColor: string;
    accentColor: string;
    defaultBgImage: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
}

const sampleCards: BankCard[] = [
  {
    bankName: "BCA",
    accountNumber: "1234 5678 9012 3456",
    accountHolder: "PT. Contoh Nama",
    logoSrc: "https://browedding.id/wp-content/uploads/2024/05/BCAVA-1-1024x321.png",
  },
  {
    bankName: "Mandiri",
    accountNumber: "9876 5432 1098 7654",
    accountHolder: "PT. Contoh Nama",
    logoSrc: "https://browedding.id/wp-content/uploads/2024/05/BCAVA-1-1024x321.png",
  },
];

export default function BankSection({ theme, specialFontFamily, bodyFontFamily }: BankSectionProps) {
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
      className="mx-auto p-8 rounded-t-2xl shadow-lg backdrop-blur-sm"
      style={{
        backgroundImage: `url(${theme.defaultBgImage})`,
        color: theme.accentColor,
        fontFamily: bodyFontFamily,
        backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '3rem 1.5rem',
      }}
    >
      <h2
        className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2"
        style={{ fontFamily: specialFontFamily }}
      >
        Love Gift
      </h2>
      <p className="text-1xl mb-6 text-center flex items-center justify-center gap-2">Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:</p>

      <Button
        onClick={toggleVisible}
        className="mb-4 w-full"
        style={{ backgroundColor: theme.accentColor, color: theme.bgColor }}
      >
        {visible ? "Sembunyikan Rekening" : "Tampilkan Rekening"}
      </Button>

      {visible && (
        <div className="space-y-5">
          {sampleCards.map((card) => (
            <div
              key={card.bankName}
              className="flex items-center p-4 border rounded-lg"
              style={{ borderColor: theme.accentColor }}
            >
              <div className="w-16 h-16 relative mr-4">
                <Image src={card.logoSrc} alt={`${card.bankName} logo`} fill objectFit="contain" />
              </div>
              <div>
                <div className="font-medium" style={{ color: theme.accentColor }}>
                  {card.bankName}
                </div>
                <div className="text-sm" style={{ color: theme.accentColor }}>
                  {card.accountNumber}
                </div>
                <div className="text-sm" style={{ color: theme.accentColor }}>
                  a.n. {card.accountHolder}
                </div>
              </div>
            </div>
          ))}

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

            <div className="relative">
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

            <div className="relative">
              <input
                id="bank-jumlah"
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Jumlah Transfer"
                className="w-full pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring"
                style={inputStyles}
              />
              <FiChevronDown className="absolute top-3 right-3 pointer-events-none" style={{ color: theme.accentColor }} />
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
