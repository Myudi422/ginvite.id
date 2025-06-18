'use server';

const VIEW_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

/**
 * Record a view for the specified content
 */
export async function recordContentView(contentUserId: number) {
  const res = await fetch(`${VIEW_API_URL}?action=view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_user_id: contentUserId }),
  });

  const json = await res.json();
  if (!res.ok || json.status !== 'success') {
    throw new Error(json.message || 'Failed to record view');
  }

  return json;
}
