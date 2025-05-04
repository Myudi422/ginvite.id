// app/admin/formulir/[invitationId]/[title]/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { PernikahanForm } from './PernikahanForm';

const SECRET = 'very-secret-key';

interface PageProps {
  params: {
    invitationId: string;   // placeholder—API does not need it for GET
    title:          string;   // the slug/title
  };
}

export default async function Page({ params }: PageProps) {
  const { title } = params;

  // 1) Auth (tetap sama)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: any;
  try { payload = jwt.verify(token, SECRET); }
  catch { return redirect('/login'); }

  const jwtUserId = payload.data.userId as number;

  // 2) Fetch record by user_id + title
  const res = await fetch(
    `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
      `?action=get_content_user` +
      `&user_id=${jwtUserId}` +
      `&title=${encodeURIComponent(title)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    console.error("Gagal mengambil data undangan:", res.status);
    return redirect('/admin'); // Redirect ke halaman admin jika fetch gagal
  }
  const json = await res.json();
  if (json.status !== 'success' || !json.data.length) {
    console.log(`Data undangan dengan title "${title}" untuk user ${jwtUserId} tidak ditemukan.`);
    return redirect('/admin'); // Redirect ke halaman admin jika data tidak ditemukan
  }

  const record = json.data[0];
  let contentData: any;
  try { contentData = JSON.parse(record.content); }
  catch (error) {
    console.error("Gagal mem-parsing data undangan:", error);
    return <p className="text-red-600">Gagal mem-parsing data undangan.</p>; // Biarkan error parsing tetap ditampilkan
  }

  // Ambil data event dari record langsung
  const eventDataFromRecord = {
    date: record.waktu_acara,
    time: record.time,
    location: record.location,
    mapsLink: record.mapsLink,
    title: record.title, // Anda bisa memutuskan apakah title tetap dari sini atau dari content
    iso: contentData?.event?.iso || '', // Pertahankan jika ada data lain di iso atau note
    note: contentData?.event?.note || '',
  };

  // Buat objek contentData baru tanpa bagian event
  const { event, ...restContentData } = contentData;

  // 3) Choose form component (tetap sama)
  const FormComponent = record.category_name === 'pernikahan'
    ? PernikahanForm
    : null;

  // 4) Build preview URL (tetap sama)
  const previewUrl = `/undang/${record.user_id}/${encodeURIComponent(record.title)}`;

  return (
    <div className="min-h-screen bg-gray-100 py-6 lg:px-8">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-10">
        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-4">Edit Undangan: {record.title}</h1>
          <div className="mb-4 w-1/2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Jenis Acara
            </label>
            <select
              value={record.category_name}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            >
              <option value="pernikahan">Pernikahan</option>
            </select>
          </div>

          {FormComponent ? (
            <FormComponent
              previewUrl={previewUrl}
              userId={record.user_id}
              invitationId={record.id}
              initialSlug={record.title}
              contentData={restContentData} // Kirim data content tanpa event
              initialStatus={record.status}
              initialEventData={eventDataFromRecord} // Kirim data event dari record
            />
          ) : (
            <p className="text-yellow-500">
              Form untuk jenis acara “{record.category_name}” belum tersedia.
            </p>
          )}
        </div>

        {/* Preview (tetap sama) */}
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