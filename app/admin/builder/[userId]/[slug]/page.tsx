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

  // ── 2. Validasi kepemilikan atau share akses ──
  let hasAccess = false;
  if (!isNaN(urlUserId)) {
    if (loggedInUserId === urlUserId) {
      hasAccess = true;
    } else {
      try {
        const checkRes = await fetch(
          `${API}/index.php?action=get_invitations&user_id=${loggedInUserId}`,
          { cache: 'no-store' }
        );
        if (checkRes.ok) {
          const checkJson = await checkRes.json();
          if (checkJson.status === 'success' && Array.isArray(checkJson.data)) {
            hasAccess = checkJson.data.some(
              (inv: any) =>
                inv.source === 'builder' &&
                inv.user_id === urlUserId &&
                inv.title === slug &&
                inv.access_type === 'shared'
            );
          }
        }
      } catch (err) {
        console.error('Error checking share access:', err);
      }
    }
  }

  if (!hasAccess) {
    return redirect('/admin');
  }

  // ── 3. Load data builder page dari backend ────────────────────────────────
  let page: BuilderPage | null = null;
  let serverLoadFailed = false;
  try {
    const res = await fetch(
      `${API}/page/builder_get.php?user_id=${urlUserId}&slug=${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success') {
        if (json.data) {
          page = json.data as BuilderPage;
        }
      } else {
        serverLoadFailed = true;
      }
    } else {
      serverLoadFailed = true;
    }
  } catch (err) {
    console.error('Error loading builder page from API:', err);
    serverLoadFailed = true;
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
    <BuilderProvider initialPage={page} userId={loggedInUserId} serverLoadFailed={serverLoadFailed}>
      <BuilderDashboard userId={loggedInUserId} />
    </BuilderProvider>
  );
}
