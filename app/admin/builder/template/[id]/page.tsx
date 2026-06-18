import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { BuilderProvider } from '@/components/builder/BuilderContext';
import BuilderDashboard from '@/components/builder/BuilderDashboard';
import type { BuilderPage } from '@/components/builder/types';

const SECRET = process.env.JWT_SECRET || 'very-secret-key';
const API = process.env.API_BASE_URL || 'https://dev.legalpilar.id/v2/android/ginvite';

export default async function EditTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  // ── 1. Auth: harus login ──
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return redirect('/login');
  }

  // Tipe user admin check (type_user must be 0)
  const typeUser = payload?.data?.type_user ?? payload?.type_user;
  if (String(typeUser) !== '0') {
    return redirect('/admin'); // bukan admin redirect ke panel biasa
  }

  const loggedInUserId = payload?.data?.userId ?? payload?.userId;
  const templateId = parseInt(params.id, 10);

  if (isNaN(templateId)) {
    return redirect('/panel/template');
  }

  // ── 2. Load data template dari API ──
  let page: BuilderPage | null = null;
  let serverLoadFailed = false;
  try {
    const res = await fetch(
      `${API}/page/template_get.php?id=${templateId}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        page = json.data as BuilderPage;
      } else {
        serverLoadFailed = true;
      }
    } else {
      serverLoadFailed = true;
    }
  } catch (err) {
    console.error('Error loading template from API:', err);
    serverLoadFailed = true;
  }

  if (!page) {
    return redirect('/panel/template');
  }

  return (
    <BuilderProvider
      initialPage={page}
      userId={loggedInUserId}
      serverLoadFailed={serverLoadFailed}
      isTemplate={true}
    >
      <BuilderDashboard userId={loggedInUserId} />
    </BuilderProvider>
  );
}
