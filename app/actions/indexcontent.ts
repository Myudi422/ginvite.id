// app/actions/indexcontent.ts
'use server';

const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';
const TOGGLE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status';
const MIDTRANS_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=midtrans';

interface SavePayload {
  user_id: number;
  id: number;
  title: string;
  theme_id: number;
  content: string;
}

interface TogglePayload {
  user_id: number;
  id: number;
  title: string;
  status: 0 | 1;
}

interface MidtransPayload {
  user_id: number;
  id_content: number;
  title: string;
}

// Save content user
export async function saveContentAction(payload: SavePayload) {
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Auto-save gagal');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Gagal menyimpan konten.');
  return json.data;
}

// Toggle active/inactive status
export async function toggleStatusAction(payload: TogglePayload) {
  const res = await fetch(TOGGLE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Toggle status gagal');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Gagal mengubah status.');
  return json.data;
}

// Midtrans payment initiation
export async function midtransAction(payload: MidtransPayload) {
  const res = await fetch(MIDTRANS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Midtrans request gagal');
  const json = await res.json();
  if (json.status !== 'pending' && json.status !== 'paid') throw new Error(json.message || 'Gagal membuat transaksi Midtrans.');
  return json;
}
