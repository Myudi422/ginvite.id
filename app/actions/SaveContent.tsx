// app/actions/saveContent.tss
'use server';

export async function saveContentAction(payload: any) {
  const res = await fetch(
    'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error('Auto-save gagal');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Gagal');
  return json;
}
