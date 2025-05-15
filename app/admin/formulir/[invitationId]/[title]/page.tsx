// app/admin/formulir/[invitationId]/[title]/page.tsx

import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import jwt from 'jsonwebtoken';
import { PernikahanForm } from './PernikahanForm';

const SECRET = 'very-secret-key';

interface PageProps {
  params: {
    invitationId: string; // tetap pakai nama invitationId untuk userId
    title:        string;
  };
}

export default async function Page({ params }: PageProps) {
  const { invitationId, title } = params;
  const userIdParam = parseInt(invitationId, 10);

  // 1) Auth
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return redirect('/login');
  }
  const jwtUserId = payload.data.userId as number;

  // 2) Fetch record
  const res = await fetch(
    `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
      `?action=get_content_user` +
      `&user_id=${userIdParam}` +
      `&title=${encodeURIComponent(title)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    console.error('Gagal mengambil data undangan:', res.status);
    return redirect('/admin');
  }
  const json = await res.json();
  if (json.status !== 'success' || !json.data.length) {
    console.log(`Data undangan "${title}" untuk user ${userIdParam} tidak ditemukan.`);
    return redirect('/admin');
  }

  const record = json.data[0];

  // 3) Parse JSON content
  let contentData: any;
  try {
    contentData = JSON.parse(record.content);
  } catch (error) {
    console.error('Gagal mem-parsing data undangan:', error);
    return <p className="text-red-600">Gagal mem-parsing data undangan.</p>;
  }

  // 4) Prepare eventData
  const eventRaw = contentData.event || {};
  const initialEventData = {
    resepsi: {
      date:     eventRaw.resepsi?.date     ?? '',
      note:     eventRaw.resepsi?.note     ?? '',
      time:     eventRaw.resepsi?.time     ?? '',
      location: eventRaw.resepsi?.location ?? '',
      mapsLink: eventRaw.resepsi?.mapsLink ?? '',
    },
    akad: eventRaw.akad
      ? {
          date:     eventRaw.akad.date,
          note:     eventRaw.akad.note,
          time:     eventRaw.akad.time,
          location: eventRaw.akad.location,
          mapsLink: eventRaw.akad.mapsLink,
        }
      : undefined,
  };
  const { event, ...restContentData } = contentData;

  // 5) Choose FormComponent
  const FormComponent = record.category_name === 'pernikahan'
    ? PernikahanForm
    : null;

  // 6) Preview URL
  const previewUrl = `/undang/${record.user_id}/${encodeURIComponent(record.title)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BACK HEADER */}
      <div className="flex items-center bg-white shadow p-4">
        <Link href="/admin" className="p-2 rounded hover:bg-gray-100">
          <ChevronLeftIcon className="h-6 w-6 text-pink-600" />
        </Link>
        <h1 className="ml-4 text-lg font-semibold text-gray-800">
          Formulir Undangan – {decodeURIComponent(title)}
        </h1>
      </div>

      <div className="py-2 px-2">
        <div className="flex flex-col lg:flex-row items-stretch h-full max-w-7xl mx-auto gap-4">
          
          {/* Preview */}
          <div className="
            order-first lg:order-last
            w-full lg:w-1/2
            bg-white shadow-md rounded-lg overflow-hidden
            flex flex-col
            lg:sticky lg:top-16 lg:flex-1 lg:h-[calc(100vh-64px)]
          ">
            <div className="w-full aspect-[9/16] lg:aspect-auto flex-1">
              <iframe
                id="previewFrame"
                src={previewUrl}
                className="w-full h-full"
                title="Pratinjau Undangan"
              />
            </div>
          </div>

          {/* Form */}
          <div className="order-last lg:order-first w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col">
            {FormComponent ? (
              <FormComponent
                previewUrl={previewUrl}
                userId={record.user_id}
                invitationId={record.id}
                initialSlug={record.title}
                contentData={restContentData}
                initialStatus={record.status}
                initialEventData={initialEventData}
              />
            ) : (
              <p className="text-yellow-500">
                Form untuk jenis acara “{record.category_name}” belum tersedia.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
