'use server';

const QUOTES_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface QuoteGroup {
  category: string;
  quotes: string[];
}

export async function getQuotes(): Promise<QuoteGroup[]> {
  const res = await fetch(`${QUOTES_API_URL}?action=qoute`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch quotes: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch quotes');
  }

  return json.data;
}
