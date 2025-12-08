'use server';

const BULK_DRAFTS_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface BulkDraft {
  names_list: string;
  template_text: string;
  checklist_data?: string; // JSON string of checked items
  updated_at: string;
}

export interface SaveDraftParams {
  user_id: string | number;
  invitation_title: string;
  names_list: string;
  template_text: string;
  checklist_data?: string; // JSON string of checked items
}

// Cache untuk mencegah save berlebihan
const saveCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 detik

export async function saveBulkDraft(params: SaveDraftParams): Promise<{ success: boolean; message?: string }> {
  try {
    // Deduplicate saves - jika data sama dalam 5 detik, skip
    const cacheKey = `${params.user_id}-${params.invitation_title}`;
    const dataHash = JSON.stringify({ names: params.names_list, template: params.template_text, checklist: params.checklist_data });
    const cached = saveCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && cached.data === dataHash && (now - cached.timestamp) < CACHE_DURATION) {
      return { success: true }; // Skip duplicate save
    }

    const response = await fetch(`${BULK_DRAFTS_API_URL}?action=bulk_drafts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: params.user_id,
        invitation_title: params.invitation_title,
        names_list: params.names_list,
        template_text: params.template_text,
        checklist_data: params.checklist_data || '',
      }),
      // Add timeout untuk mencegah hanging
      signal: AbortSignal.timeout(10000), // 10 detik timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      // Update cache setelah berhasil save
      saveCache.set(cacheKey, { data: dataHash, timestamp: now });
      
      // Cleanup cache yang expired
      for (const [key, value] of saveCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          saveCache.delete(key);
        }
      }
      
      return { success: true };
    } else {
      return { success: false, message: result.message || 'Unknown error' };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { success: false, message: 'Request timeout' };
    }
    console.error('Error saving bulk draft:', error);
    return { success: false, message: 'Network error' };
  }
}

export async function loadBulkDraft(user_id: string | number, invitation_title: string): Promise<BulkDraft | null> {
  try {
    const response = await fetch(
      `${BULK_DRAFTS_API_URL}?action=bulk_drafts&user_id=${user_id}&invitation_title=${encodeURIComponent(invitation_title)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      return result.data as BulkDraft;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading bulk draft:', error);
    return null;
  }
}