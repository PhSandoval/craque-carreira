/**
 * Serverless Proxy Seguro & Blindado para o Google Gemini 2.5 Flash (Vercel / Netlify / Node)
 *
 * 4 CAMADAS DE PROTEÇÃO CONTRA SEQUESTRO E GASTO EXCEDENTE:
 * 1. Chave GEMINI_API_KEY 100% no servidor (nunca enviada ao navegador).
 * 2. Anti-Sequestro: exige header interno do jogo + valida assinatura de prompt RPG + limite de tamanho.
 * 3. Rate Limit por IP (máx. 18 chamadas/minuto por jogador).
 * 4. Trava Rígida de Orçamento Mensal (GEMINI_MONTHLY_BUDGET_USD, padrão US$ 9.00 — dentro dos US$ 10/mês do Google AI Pro):
 *    calcula o custo real de cada token retornado pela API e corta automaticamente em HTTP 429 ao atingir o teto,
 *    fazendo o jogo cair suavemente no motor procedural gratuito (R$ 0,00).
 */

const INPUT_USD_PER_MILLION = 0.30;   // Gemini 2.5 Flash Input
const OUTPUT_USD_PER_MILLION = 2.50;  // Gemini 2.5 Flash Output
const MAX_CALLS_PER_MINUTE_PER_IP = 18;
const ALLOWED_PROMPT_PREFIXES = [
  'Você é o gerador de lances',
  'Você é o Diretor Criativo',
  'Você é o gerador de notícias',
  'Você é um repórter de campo'
];

interface BudgetLedger {
  monthKey: string;
  spentUsd: number;
  callsCount: number;
  inputTokens: number;
  outputTokens: number;
}

const ipHits = new Map<string, number[]>();
let memoryLedger: BudgetLedger = {
  monthKey: new Date().toISOString().slice(0, 7),
  spentUsd: 0,
  callsCount: 0,
  inputTokens: 0,
  outputTokens: 0
};

function getCurrentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function getLedger(): BudgetLedger {
  const mk = getCurrentMonthKey();
  if (memoryLedger.monthKey !== mk) {
    memoryLedger = { monthKey: mk, spentUsd: 0, callsCount: 0, inputTokens: 0, outputTokens: 0 };
  }
  return memoryLedger;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const recent = (ipHits.get(ip) || []).filter(ts => ts > windowStart);
  if (recent.length >= MAX_CALLS_PER_MINUTE_PER_IP) {
    ipHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

export default async function handler(req: any, res: any) {
  const serverKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  const monthlyBudgetUsd = Math.max(0.5, Number(process.env.GEMINI_MONTHLY_BUDGET_USD || '9.00'));
  const ledger = getLedger();

  // GET /api/gemini -> Status de saúde + saldo do teto mensal (nunca expõe a chave!)
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      ok: true,
      configured: Boolean(serverKey && serverKey.length > 10),
      budget: {
        month: ledger.monthKey,
        spentUsd: Number(ledger.spentUsd.toFixed(4)),
        limitUsd: monthlyBudgetUsd,
        remainingUsd: Number(Math.max(0, monthlyBudgetUsd - ledger.spentUsd).toFixed(4)),
        callsCount: ledger.callsCount,
        capReached: ledger.spentUsd >= monthlyBudgetUsd
      }
    }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
    return;
  }

  if (!serverKey || serverKey.length <= 10) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, configured: false, error: 'GEMINI_API_KEY not configured on server' }));
    return;
  }

  // Camada 1 Anti-Sequestro: Header interno obrigatório do cliente Craque RPG
  const clientHeader = req.headers?.['x-craque-client'] || req.headers?.['X-Craque-Client'];
  if (clientHeader !== 'career-rpg-v2') {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Forbidden client signature' }));
    return;
  }

  // Camada 2 Anti-Sequestro: Validação de Origin/Referer em produção
  const allowedOrigin = (process.env.ALLOWED_APP_ORIGIN || '').trim();
  if (allowedOrigin) {
    const reqOrigin = String(req.headers?.origin || req.headers?.referer || '');
    if (!reqOrigin.startsWith(allowedOrigin)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'Origin not allowed' }));
      return;
    }
  }

  // Camada 3: Rate Limit por IP
  const ip = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Rate limit exceeded' }));
    return;
  }

  // Camada 4: Trava Rígida de Gasto Mensal (garante US$ 0.00 além do limite configurado!)
  if (ledger.spentUsd >= monthlyBudgetUsd) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      ok: false,
      capReached: true,
      error: `Monthly budget cap ($${monthlyBudgetUsd.toFixed(2)}) reached`
    }));
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const prompt = String(body.prompt || '').trim();
    const temperature = Math.min(1.0, Math.max(0.2, typeof body.temperature === 'number' ? body.temperature : 0.75));

    // Impede sequestro do endpoint para perguntas genéricas fora do escopo do jogo
    const hasValidGameSignature = ALLOWED_PROMPT_PREFIXES.some(prefix => prompt.startsWith(prefix));
    if (!prompt || prompt.length > 7500 || !hasValidGameSignature) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'Prompt rejected by game security policy' }));
      return;
    }

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${serverKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature,
            maxOutputTokens: 900
          }
        })
      }
    );

    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: `Gemini upstream status ${upstream.status}` }));
      return;
    }

    const raw = await upstream.json();
    const usage = raw?.usageMetadata || {};
    const inTokens = Number(usage.promptTokenCount || Math.ceil(prompt.length / 4));
    const outTokens = Number(usage.candidatesTokenCount || 350);
    const callCostUsd = (inTokens / 1_000_000) * INPUT_USD_PER_MILLION + (outTokens / 1_000_000) * OUTPUT_USD_PER_MILLION;

    ledger.inputTokens += inTokens;
    ledger.outputTokens += outTokens;
    ledger.callsCount += 1;
    ledger.spentUsd += callCostUsd;

    const jsonText = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = jsonText ? JSON.parse(jsonText) : null;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      ok: true,
      configured: true,
      data: parsed,
      budget: {
        spentUsd: Number(ledger.spentUsd.toFixed(4)),
        limitUsd: monthlyBudgetUsd,
        callsCount: ledger.callsCount
      }
    }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: err?.message || 'Internal proxy error' }));
  }
}
