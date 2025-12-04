'use server';

const QUOTES_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface QuoteGroup {
  category: string;
  quotes: string[];
}

export async function getQuotes(categoryFilter?: string): Promise<QuoteGroup[]> {
  const res = await fetch(`${QUOTES_API_URL}?action=qoute`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch quotes: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch quotes');
  }

  // Filter by category if specified
  if (categoryFilter) {
    if (categoryFilter === 'pernikahan') {
      // For pernikahan, include all categories containing "pernikahan"
      return json.data.filter((group: QuoteGroup) => 
        group.category.toLowerCase().includes('pernikahan')
      );
    } else if (categoryFilter === 'khitanan') {
      // For khitanan, include only "Khitanan" category
      return json.data.filter((group: QuoteGroup) => 
        group.category.toLowerCase().includes('khitanan')
      );
    }
  }

  return json.data;
}
