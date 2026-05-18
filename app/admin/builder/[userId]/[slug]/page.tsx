import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { BuilderProvider } from '@/components/builder/BuilderContext';
import BuilderDashboard from '@/components/builder/BuilderDashboard';
import type { BuilderPage, EventType } from '@/components/builder/types';
import { makeDefaultPage } from '@/components/builder/defaults';

const SECRET = process.env.JWT_SECRET || 'very-secret-key';
const API = process.env.API_BASE_URL || 'https://ccgnimex.my.id/v2/android/ginvite';

const VALID_EVENT_TYPES: EventType[] = ['pernikahan', 'ulang_tahun', 'khitanan', 'custom'];

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: { userId: string; slug: string };
  searchParams: { event_type?: string; page_title?: string };
}) {
  // ── 1. Auth: harus login ──────────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: { data: { userId: number; email: string } };
  try {
    payload = jwt.verify(token, SECRET) as typeof payload;
  } catch {
    return redirect('/login');
  }

  const loggedInUserId = payload.data.userId;
  const urlUserId = parseInt(params.userId, 10);
  const slug = params.slug;

  // ── 2. Validasi kepemilikan: userId di URL harus cocok dengan user login ──
  // Jika tidak cocok, alihkan ke /admin (sama seperti pola formulir)
  if (isNaN(urlUserId) || loggedInUserId !== urlUserId) {
    return redirect('/admin');
  }

  // ── 3. Load data builder page dari backend ────────────────────────────────
  let page: BuilderPage | null = null;
  try {
    const res = await fetch(
      `${API}/page/builder_get.php?user_id=${loggedInUserId}&slug=${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        page = json.data as BuilderPage;
      }
    }
  } catch {
    // fallback ke default di bawah
  }

  // ── 4. Jika belum ada, buat default dari query params CreateBuilderPopup ──
  if (!page) {
    const rawEventType = searchParams.event_type ?? 'pernikahan';
    const eventType: EventType = VALID_EVENT_TYPES.includes(rawEventType as EventType)
      ? (rawEventType as EventType)
      : 'pernikahan';

    page = makeDefaultPage({
      slug,
      user_id: loggedInUserId,
      event_type: eventType,
      page_title: searchParams.page_title || slug,
    });
  }

  return (
    <BuilderProvider initialPage={page} userId={loggedInUserId}>
      <BuilderDashboard userId={loggedInUserId} />
    </BuilderProvider>
  );
}
