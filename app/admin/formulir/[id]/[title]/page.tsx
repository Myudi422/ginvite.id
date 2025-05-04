// app/admin/formulir/[invitationId]/[title]/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { PernikahanForm } from './PernikahanForm';

const SECRET = 'very-secret-key';

interface PageProps {
  params: {
    invitationId: string;  // placeholder—API does not need it for GET
    title:        string;  // the slug/title
  };
}

export default async function Page({ params }: PageProps) {
  const { title } = params;

  // 1) Auth
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
    return <p className="text-red-600">Gagal mengambil data undangan.</p>;
  }
  const json = await res.json();
  if (json.status !== 'success' || !json.data.length) {
    return <p className="text-red-600">Data undangan tidak ditemukan.</p>;
  }

  const record = json.data[0];
  let contentData: any;
  try { contentData = JSON.parse(record.content); }
  catch { return <p className="text-red-600">Gagal mem-parsing data undangan.</p>; }

  // 3) Choose form component
  const FormComponent = record.category_name === 'pernikahan'
    ? PernikahanForm
    : null;

  // 4) Build preview URL
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
              previewUrl    ={previewUrl}
              userId        ={record.user_id}      // payload.user_id
              invitationId  ={record.id}           // payload.id
              initialSlug   ={record.title}        // << pass the real title here
              contentData   ={contentData}
              initialStatus ={record.status}
            />
          ) : (
            <p className="text-yellow-500">
              Form untuk jenis acara “{record.category_name}” belum tersedia.
            </p>
          )}
        </div>

        {/* Preview */}
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
