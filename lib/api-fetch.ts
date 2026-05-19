// lib/api-fetch.ts

// Enable ignoring of SSL errors in server-side node environments (e.g. self-signed certificates, expired certs)
if (typeof window === 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
}

/**
 * Custom fetch wrapper that supports automatic retries, exponential backoff, 
 * timeout, and gracefully handles network/SSL/Cloudflare transient errors (like status 525).
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeoutMs = 15000, // 15 seconds default timeout
    retries = 3,       // Retry up to 3 times (total 4 attempts)
    backoffMs = 1000,  // Base delay: 1 second
    ...restOptions
  } = options;

  let lastError: any = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (attempt > 0) {
        // Exponential backoff: 1000ms -> 2000ms -> 4000ms...
        const delay = backoffMs * Math.pow(2, attempt - 1);
        console.warn(`[API FETCH] Retrying request to ${url} (Attempt ${attempt}/${retries}) in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await fetch(url, {
        ...restOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Cloudflare 525 or other 5xx errors are treated as transient server/network errors, so we retry!
      if (!response.ok && response.status >= 500) {
        lastResponse = response;
        console.warn(`[API FETCH WARNING] Received retryable status code ${response.status} from ${url}.`);
        continue; // Proceed to retry
      }

      return response; // Successful response (status 2xx, 3xx, or non-retryable 4xx error)
    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;

      const isTimeout = error.name === 'AbortError';
      console.error(
        `[API FETCH ERROR] Attempt ${attempt} failed for ${url}. ${
          isTimeout ? 'Request timed out.' : `Error: ${error.message || error}`
        }`
      );

      // If it's a network error or timeout, we proceed to retry
    }
  }

  // If we exhausted all retries and got a bad response (like 525)
  if (lastResponse) {
    return lastResponse;
  }

  // If we got a network exception/timeout at the end
  throw lastError || new Error(`Failed to fetch from ${url} after ${retries} retries.`);
}
