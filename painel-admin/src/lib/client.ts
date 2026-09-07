'use client';

/** Fetch helper para o browser: fala com as rotas /api do próprio painel. */
export async function apiFetch<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(path, {
    method: opts.method ?? 'GET',
    headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'error' in data && String(data.error)) ||
      `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
