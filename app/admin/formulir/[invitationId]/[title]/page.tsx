import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import jwt from 'jsonwebtoken';
import { PernikahanForm } from './PernikahanForm';
import { KhitananForm } from './KhitananForm';
import LivePreview from './LivePreview';

const SECRET = 'very-secret-key';

interface PageProps {
  params: {
    invitationId: string; // tetapkan nama invitationId untuk mendapatkan userId
    title: string;
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
  } catch (error) {
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

  // 4) Prepare eventData & contentData sesuai kategori
  let initialEventData: any = {};
  let restContentData: any = {};
  if (record.category_name === 'pernikahan') {
    const eventRaw = contentData.event || {};
    initialEventData = {
      resepsi: {
        date: eventRaw.resepsi?.date ?? '',
        note: eventRaw.resepsi?.note ?? '',
        time: eventRaw.resepsi?.time ?? '',
        location: eventRaw.resepsi?.location ?? '',
        mapsLink: eventRaw.resepsi?.mapsLink ?? '',
      },
      akad: eventRaw.akad
        ? {
            date: eventRaw.akad.date,
            note: eventRaw.akad.note,
            time: eventRaw.akad.time,
            location: eventRaw.akad.location,
            mapsLink: eventRaw.akad.mapsLink,
          }
        : undefined,
    };
    // Exclude event from contentData
    const { event, ...rest } = contentData;
    restContentData = rest;
  } else if (record.category_name === 'khitanan') {
    // Sesuaikan struktur sesuai kebutuhan form Khitanan
    const eventRaw = contentData.event || {};
    initialEventData = {
      khitanan: {
        date: eventRaw.khitanan?.date ?? '',
        time: eventRaw.khitanan?.time ?? '',
        location: eventRaw.khitanan?.location ?? '',
        mapsLink: eventRaw.khitanan?.mapsLink ?? '',
      }
    };
    // Exclude event from contentData
    const { event, ...rest } = contentData;
    restContentData = rest;
  } else {
    // Default
    initialEventData = {};
    restContentData = contentData;
  }

  // 5) Choose FormComponent berdasarkan jenis acara
  let FormComponent: React.ComponentType<any> | null = null;
  if (record.category_name === 'pernikahan') {
    FormComponent = PernikahanForm;
  } else if (record.category_name === 'khitanan') {
    FormComponent = KhitananForm;
  } else {
    FormComponent = null;
  }

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
          {/* Live Preview dengan toggle */}
          <LivePreview previewUrl={previewUrl} />

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