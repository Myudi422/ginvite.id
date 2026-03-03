import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon, ExternalLink } from 'lucide-react';
import jwt from 'jsonwebtoken';
import { PernikahanForm } from './PernikahanForm';
import { KhitananForm } from './KhitananForm';
import LivePreview from './LivePreview';

const SECRET = 'very-secret-key';

interface PageProps {
  params: {
    invitationId: string;
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
    return redirect('/admin');
  }

  const record = json.data[0];

  // 3) Parse JSON content
  let contentData: any;
  try {
    contentData = JSON.parse(record.content);
  } catch (error) {
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
    const { event, ...rest } = contentData;
    restContentData = rest;
  } else if (record.category_name === 'khitanan') {
    const eventRaw = contentData.event || {};
    initialEventData = {
      khitanan: {
        date: eventRaw.khitanan?.date ?? '',
        time: eventRaw.khitanan?.time ?? '',
        location: eventRaw.khitanan?.location ?? '',
        mapsLink: eventRaw.khitanan?.mapsLink ?? '',
      },
    };
    const { event, ...rest } = contentData;
    restContentData = rest;
  } else {
    restContentData = contentData;
  }

  // 5) Choose FormComponent
  let FormComponent: React.ComponentType<any> | null = null;
  if (record.category_name === 'pernikahan') FormComponent = PernikahanForm;
  else if (record.category_name === 'khitanan') FormComponent = KhitananForm;

  // 6) URLs
  const previewUrl = `/undang/${record.user_id}/${encodeURIComponent(record.title)}`;
  const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
  const categoryEmoji = record.category_name === 'pernikahan' ? '💒' : record.category_name === 'khitanan' ? '🎉' : '✨';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-pink-50 transition-colors flex-shrink-0">
            <ChevronLeftIcon className="h-5 w-5 text-pink-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Edit Undangan</p>
            <h1 className="text-sm font-bold text-gray-800 truncate capitalize">{decodedTitle}</h1>
          </div>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 text-xs font-semibold hover:bg-pink-100 transition-colors flex-shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </a>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="py-4 px-3 pb-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch gap-5">

          {/* Live Preview panel */}
          <LivePreview previewUrl={previewUrl} />

          {/* Form panel */}
          <div className="order-last lg:order-first w-full lg:w-1/2 bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* Form panel header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-pink-100 flex-shrink-0">
              <p className="text-[10px] text-pink-500 font-semibold uppercase tracking-widest">Formulir Undangan</p>
              <h2 className="font-bold text-gray-800 text-sm mt-0.5">{categoryEmoji} {record.category_name === 'pernikahan' ? 'Undangan Pernikahan' : record.category_name === 'khitanan' ? 'Undangan Khitanan' : record.category_name}</h2>
              <p className="text-xs text-gray-400 mt-1">Isi setiap bagian — tiap bagian simpan sendiri secara otomatis. ✏️</p>
            </div>

            {/* Form body */}
            <div className="p-4 flex-1">
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
                <div className="text-center py-12">
                  <p className="text-3xl mb-3">🚧</p>
                  <p className="text-amber-600 font-medium text-sm">Form untuk jenis acara "{record.category_name}" belum tersedia.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}