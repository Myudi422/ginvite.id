'use server';

const RUNDOWN_DRAFTS_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface RundownDraft {
  rundown_data: string; // JSON string of rundown items
  updated_at: string;
}

export interface SaveRundownDraftParams {
  user_id: string | number;
  invitation_title: string;
  rundown_data: string; // JSON string of rundown items
}

// Cache untuk mencegah save berlebihan
const saveCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 detik

export async function saveRundownDraft(params: SaveRundownDraftParams): Promise<{ success: boolean; message?: string }> {
  try {
    // Deduplicate saves - jika data sama dalam 5 detik, skip
    const cacheKey = `${params.user_id}-${params.invitation_title}`;
    const dataHash = JSON.stringify({ rundown: params.rundown_data });
    const cached = saveCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && cached.data === dataHash && (now - cached.timestamp) < CACHE_DURATION) {
      return { success: true }; // Skip duplicate save
    }

    const response = await fetch(`${RUNDOWN_DRAFTS_API_URL}?action=rundown_drafts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: params.user_id,
        invitation_title: params.invitation_title,
        rundown_data: params.rundown_data,
      }),
      // Add timeout untuk mencegah hanging
      signal: AbortSignal.timeout(10000), // 10 detik timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'success') {
      // Update cache
      saveCache.set(cacheKey, { data: dataHash, timestamp: now });
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message || 'Gagal menyimpan draft rundown' };
    }
    
  } catch (error) {
    console.error('Error saving rundown draft:', error);
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { success: false, message: 'Request timeout - coba lagi dalam beberapa saat' };
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga' 
    };
  }
}

export async function loadRundownDraft(user_id: string | number, invitation_title: string): Promise<RundownDraft | null> {
  try {
    const response = await fetch(
      `${RUNDOWN_DRAFTS_API_URL}?action=rundown_drafts&user_id=${encodeURIComponent(user_id)}&invitation_title=${encodeURIComponent(invitation_title)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data; // bisa null jika tidak ada draft
    } else {
      throw new Error(data.message || 'Gagal memuat draft rundown');
    }
    
  } catch (error) {
    console.error('Error loading rundown draft:', error);
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('Request timeout - coba lagi dalam beberapa saat');
    }
    
    throw error;
  }
}

// Utility function untuk auto-save dengan debouncing
let autoSaveTimeout: NodeJS.Timeout | null = null;

export async function scheduleAutoSaveRundown(params: SaveRundownDraftParams, delay: number = 2000): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set new timeout
    autoSaveTimeout = setTimeout(async () => {
      try {
        const result = await saveRundownDraft(params);
        resolve(result);
      } catch (error) {
        resolve({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Auto-save gagal' 
        });
      }
    }, delay);
  });
}