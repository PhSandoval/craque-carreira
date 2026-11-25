/**
 * Cliente Centralizado e Seguro para o Motor Google Gemini 2.5 Flash
 *
 * Conecta exclusivamente pela rota de proxy protegida `/api/gemini` (onde GEMINI_API_KEY fica
 * escondida no servidor, com anti-sequestro, rate limit e trava rígida de gasto mensal).
 */

export interface GeminiCallOptions {
  temperature?: number;
  apiKeyOverride?: string;
  timeoutMs?: number;
}

export interface ServerGeminiStatus {
  configured: boolean;
  budget?: {
    month: string;
    spentUsd: number;
    limitUsd: number;
    remainingUsd: number;
    callsCount: number;
    capReached: boolean;
  };
}

export async function getServerGeminiStatus(): Promise<ServerGeminiStatus> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch('/api/gemini', { method: 'GET', signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return { configured: false };
    const json = await res.json();
    return {
      configured: Boolean(json?.configured),
      budget: json?.budget
    };
  } catch {
    return { configured: false };
  }
}

export async function checkServerGeminiStatus(): Promise<boolean> {
  const status = await getServerGeminiStatus();
  return status.configured;
}

export async function callGeminiJson<T = any>(
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<T | null> {
  const { temperature = 0.78, timeoutMs = 5500 } = options;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const proxyRes = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Craque-Client': 'career-rpg-v2'
      },
      body: JSON.stringify({ prompt, temperature }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (proxyRes.ok) {
      const payload = await proxyRes.json();
      if (payload?.ok && payload?.data) {
        return payload.data as T;
      }
    }
  } catch {
    // Cai suavemente no motor procedural gratuito sem travar
  }

  return null;
}
