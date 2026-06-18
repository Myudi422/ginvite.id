import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InvitationDashboard from '@/components/InvitationDashboard';
import jwt from 'jsonwebtoken';
import { fetchWithRetry } from '@/lib/api-fetch';

// Mengambil SECRET dari variabel lingkungan dengan fallback
const SECRET = process.env.JWT_SECRET || 'very-secret-key';
// Mengambil API_BASE_URL dari variabel lingkungan dengan fallback
const API_BASE_URL = process.env.API_BASE_URL || 'https://dev.legalpilar.id/v2/android/ginvite';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (e) {
    console.error('JWT verification failed:', e);
    return redirect('/login');
  }
  const user = payload.data;

  // SERVER-SIDE FETCH WITH RETRY
  let invitations = [];
  let fetchError: string | null = null;

  try {
    const invRes = await fetchWithRetry(
      `${API_BASE_URL}/index.php?action=get_invitations&user_id=${user.userId}`,
      {
        timeoutMs: 15000,
        retries: 3,
        backoffMs: 1000,
        cache: 'no-store', // Hindari caching data lama/error
      }
    );

    if (invRes.ok) {
      const invJson = await invRes.json();
      if (invJson.status === 'success') {
        invitations = invJson.data;
      } else if (invRes.status === 404) {
        // Kasus user baru, tidak ada undangan
        console.log("Tidak ada undangan untuk user baru.");
      } else {
        console.error('Failed to fetch invitations with status:', invRes.status, 'and JSON status:', invJson.status);
        fetchError = invJson.message || `Gagal mengambil data dari API (Status JSON: ${invJson.status}).`;
      }
    } else {
      console.error('Failed to fetch invitations:', invRes.status, invRes.statusText);
      if (invRes.status === 525) {
        fetchError = 'Cloudflare Error 525: Hubungan aman (SSL Handshake) antara Cloudflare dan server kami gagal.';
      } else {
        fetchError = `Server merespon dengan status ${invRes.status} (${invRes.statusText || 'Gagal memuat'}).`;
      }
    }
  } catch (error: any) {
    console.error('Error fetching invitations after retries:', error);
    fetchError = error.message || 'Koneksi ke server terputus atau gagal verifikasi SSL.';
  }

  return (
    <>
      <InvitationDashboard
        user={user}
        invitations={invitations}
        error={fetchError}
      />
    </>
  );
}
