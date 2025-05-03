// app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InvitationDashboard from '@/components/InvitationDashboard';
import jwt from 'jsonwebtoken';

const SECRET = "very-secret-key"; // Harus sama dengan PHP

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return redirect('/login');

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return redirect('/login');
  }
  const user = payload.data;

  // SERVER-SIDE FETCH
  const [invRes, sliderRes] = await Promise.all([
    fetch(`https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_invitations&user_id=${user.userId}`),
    fetch(`https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_slider`)
  ]);

  if (!invRes.ok || !sliderRes.ok) {
    return redirect('/error');
  }

  const invJson = await invRes.json();
  const sliderJson = await sliderRes.json();

  const invitations = invJson.data;
  const slides = sliderJson.data.map((s: any) => s.image_url);

  return (
    <>
      <InvitationDashboard
        user={user}
        invitations={invitations}
        slides={slides}
      />
    </>
  );
}
