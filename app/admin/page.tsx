import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InvitationDashboard from '@/components/InvitationDashboard';
import jwt from 'jsonwebtoken';

// Mengambil SECRET dari variabel lingkungan dengan fallback
const SECRET = process.env.JWT_SECRET || 'very-secret-key';
// Mengambil API_BASE_URL dari variabel lingkungan dengan fallback
const API_BASE_URL = process.env.API_BASE_URL || 'https://ccgnimex.my.id/v2/android/ginvite';

export default async function Page() {
  // Environment variables are now handled with fallbacks, no need for error checking

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

  // SERVER-SIDE FETCH
  // Menggunakan API_BASE_URL dari variabel lingkungan
  const [invRes] = await Promise.all([
    fetch(`${API_BASE_URL}/index.php?action=get_invitations&user_id=${user.userId}`),
  ]);

  // Tangani respons dari get_invitations
  let invitations = [];
  if (invRes.ok) {
    const invJson = await invRes.json();
    if (invJson.status === 'success') {
      invitations = invJson.data;
    } else if (invRes.status === 404) {
      // Ini adalah kasus user baru, tidak ada undangan. Biarkan array kosong.
      console.log("Tidak ada undangan untuk user baru.");
    } else {
      console.error('Failed to fetch invitations with status:', invRes.status, 'and JSON status:', invJson.status);
      return redirect('/error'); // Redirect ke error untuk status code atau status JSON yang lain
    }
  } else {
    console.error('Failed to fetch invitations:', invRes.statusText);
    return redirect('/error'); // Redirect ke error jika fetch invitations gagal (selain 404)
  }

  return (
    <>
      <InvitationDashboard
        user={user}
        invitations={invitations}
      />
    </>
  );
}
