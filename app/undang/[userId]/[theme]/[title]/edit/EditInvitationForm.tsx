"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Invitation {
  id: number;
  title: string;
  status: number;
  event_date: string | null;
  content: Record<string, any>;
}

interface Props {
  userId: string;
  theme: string;
  title: string;
}

export default function EditInvitationForm({ userId, theme, title }: Props) {
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [status, setStatus] = useState(0);
  const [eventDate, setEventDate] = useState<string | null>("");
  const [content, setContent] = useState<Record<string, any>>({});

  useEffect(() => {
    const apiUrl =
      `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
      `?action=result` +
      `&user=${encodeURIComponent(userId)}` +
      `&theme=${encodeURIComponent(theme)}` +
      `&title=${encodeURIComponent(title)}`;
  
    fetch(apiUrl, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.content && json.content.event) {
          const initialData: Invitation = {
            id: -1, // Atau cara lain untuk mendapatkan ID jika tidak ada di sini
            title: json.content.event.title || "",
            status: 0, // Atau cara lain untuk mendapatkan status jika tidak ada di sini
            event_date: json.content.event.iso || null,
            content: json.content,
          };
          setInvitation(initialData);
          setFormTitle(initialData.title);
          setStatus(initialData.status);
          setEventDate(initialData.event_date);
          setContent(initialData.content);
        } else {
          setError("Data undangan tidak valid: Struktur content.event tidak sesuai.");
        }
      })
      .catch(() => setError("Gagal memuat data undangan."))
      .finally(() => setLoading(false));
  }, [userId, theme, title]);
  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedContent = JSON.parse(event.target.value);
      setContent(parsedContent);
    } catch (e: any) {
      setError("Format JSON tidak valid.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
  
    try {
      const response = await fetch(`https://ccgnimex.my.id/v2/android/ginvite/update_invitate.php`, { // Sesuaikan dengan path API Anda
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: invitation?.id,
          user_id: Number(userId),
          title: formTitle,
          status,
          waktu_acara: eventDate,
          content: content,
        }),
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        router.push(`/undang/${userId}/${theme}/${formTitle}`); // Kembali ke halaman detail
      } else {
        setError(result.message || "Gagal menyimpan perubahan.");
      }
    } catch (error: any) {
      setError("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  if (loading) return <p>Loading data undangan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!invitation) return <p>Undangan tidak ditemukan.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Judul
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="status"
          type="checkbox"
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          checked={status === 1}
          onChange={() => setStatus((prevStatus) => (prevStatus === 1 ? 0 : 1))}
        />
        <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
          Aktif
        </label>
      </div>

      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
          Tanggal Acara
        </label>
        <input
          type="date"
          id="eventDate"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={eventDate || ""}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Konten JSON
        </label>
        <textarea
          id="content"
          rows={8}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
          value={JSON.stringify(content, null, 2)}
          onChange={handleContentChange}
        />
        {error === "Format JSON tidak valid." && (
          <p className="mt-2 text-sm text-red-500">Format JSON tidak valid.</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}