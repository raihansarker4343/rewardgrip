/**
 * Safely parses response as JSON.
 * Guaranteed never to throw "Unexpected token '<', '<!DOCTYPE '... is not valid JSON".
 */
export async function safeResponseJson<T = any>(response: Response, fallback: T = null as any): Promise<T> {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return fallback;
    }
    const text = await response.text();
    if (!text || !text.trim() || text.trim().startsWith('<')) {
      return fallback;
    }
    return JSON.parse(text) as T;
  } catch (err) {
    return fallback;
  }
}

/**
 * Perform a fetch and safely extract JSON, with automatic fallback and error prevention.
 */
export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallback: T = null as any
): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(input, init);
    const data = await safeResponseJson<T>(res, fallback);
    return {
      ok: res.ok && data !== null,
      status: res.status,
      data: data !== null ? data : fallback,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: fallback,
    };
  }
}
