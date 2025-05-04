// app/admin/formulir/[id]/[title]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import PernikahanForm from './PernikahanForm';
// import KhitananForm from './KhitananForm'; // nanti tambahkan jika butuh

const SECRET = "very-secret-key";

interface PageProps {
  params: {
    id: string;     // <-- menangkap segmen URL pertama
    title: string;    // <-- segmen URL kedua
  };
}

type EventType = 'pernikahan' | 'khitanan';

export default async function Page({ params }: PageProps) {
  const { id, title } = params;
  const userId = parseInt(id, 10);

  // 1. Autentikasi
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return redirect('/login');
  }
  // opsional: pastikan payload.data.userId === userId
  if (payload.data.userId !== userId) return redirect('/login');

  // 2. Fetch data undangan
  const res = await fetch(
    `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
      `?action=get_content_user&user_id=${userId}` +
      `&id=${id}&title=${encodeURIComponent(title)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    return <p className="text-red-600">Gagal mengambil data undangan.</p>;
  }

  const json = await res.json();
  if (json.status !== 'success' || !Array.isArray(json.data) || json.data.length === 0) {
    return <p className="text-red-600">Data undangan tidak ditemukan.</p>;
  }

  const record = json.data[0];
  let contentData: any;
  try {
    contentData = JSON.parse(record.content);
  } catch {
    return <p className="text-red-600">Gagal mem‑parsing data undangan.</p>;
  }

  // 3. Pilih form berdasarkan category_name
  const type = record.category_name as EventType;
  const FormComponent =
    type === 'pernikahan' ? PernikahanForm : null; // KhitananForm belum ada di snippet

  const previewUrl = `/undang/${id}/${title.toLowerCase().replace(/ /g, '-')}`;

  return (
    <div className="min-h-screen bg-gray-100 py-6 lg:px-8">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-10">
        {/* Bagian Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-4">
            Edit Undangan: {record.title}
          </h1>

          {/* Dropdown kategori tapi non‑aktif jika bukan record.category_name */}
          <div className="mb-4 w-1/2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Jenis Acara
            </label>
            <select
              value={type}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            >
              <option value="pernikahan" disabled={type !== 'pernikahan'}>
                Pernikahan
              </option>
              {/* <option value="khitanan" disabled={type !== 'khitanan'}>
                Khitanan
              </option> */}
            </select>
          </div>

          {/* Render component form */}
          {FormComponent && (
            <FormComponent
              userId={userId}
              invitation={record}
              contentData={contentData}
              previewUrl={previewUrl} // Kirim URL pratinjau
            />
          )}
          {!FormComponent && (
            <p className="text-yellow-500">Form untuk jenis acara ini belum tersedia.</p>
          )}
        </div>

        {/* Bagian Preview (hanya tampil dan sticky di PC) */}
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] rounded-lg overflow-hidden shadow-md">
          <iframe
            id="previewFrame"
            src={previewUrl}
            className="w-full h-full"
            title="Pratinjau Undangan"
          />
        </div>
      </div>
    </div>
  );
}