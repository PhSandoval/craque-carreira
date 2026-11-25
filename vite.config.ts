import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const INPUT_USD_PER_MILLION = 0.30
const OUTPUT_USD_PER_MILLION = 2.50
const MAX_CALLS_PER_MINUTE_PER_IP = 18
const ALLOWED_PROMPT_PREFIXES = [
  'Você é o gerador de lances',
  'Você é o Diretor Criativo',
  'Você é o gerador de notícias',
  'Você é um repórter de campo'
]

interface LocalBudgetLedger {
  monthKey: string
  spentUsd: number
  callsCount: number
  inputTokens: number
  outputTokens: number
}

/**
 * Middleware seguro para servir /api/gemini em desenvolvimento e preview:
 * - Lê GEMINI_API_KEY e GEMINI_MONTHLY_BUDGET_USD do .env apenas no servidor Node.js.
 * - Persiste o gasto real do mês em .gemini-budget-ledger.json e corta automaticamente ao atingir o teto!
 * - Valida assinatura de prompt, header X-Craque-Client e rate-limit anti-sequestro.
 */
function geminiProxyPlugin(serverApiKey: string, monthlyBudgetUsd: number): Plugin {
  const ledgerFile = path.resolve(process.cwd(), '.gemini-budget-ledger.json')
  const ipHits = new Map<string, number[]>()

  const getMonthKey = () => new Date().toISOString().slice(0, 7)

  const readLedger = (): LocalBudgetLedger => {
    const mk = getMonthKey()
    try {
      if (fs.existsSync(ledgerFile)) {
        const parsed = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8')) as LocalBudgetLedger
        if (parsed.monthKey === mk) return parsed
      }
    } catch {}
    return { monthKey: mk, spentUsd: 0, callsCount: 0, inputTokens: 0, outputTokens: 0 }
  }

  const writeLedger = (ledger: LocalBudgetLedger) => {
    try {
      fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2), 'utf-8')
    } catch {}
  }

  const isRateLimited = (ip: string): boolean => {
    const now = Date.now()
    const recent = (ipHits.get(ip) || []).filter(ts => ts > now - 60_000)
    if (recent.length >= MAX_CALLS_PER_MINUTE_PER_IP) {
      ipHits.set(ip, recent)
      return true
    }
    recent.push(now)
    ipHits.set(ip, recent)
    return false
  }

  const attachMiddleware = (middlewares: any) => {
    middlewares.use('/api/gemini', async (req: any, res: any, next: any) => {
      const ledger = readLedger()

      if (req.method === 'GET') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          ok: true,
          configured: Boolean(serverApiKey && serverApiKey.length > 10),
          budget: {
            month: ledger.monthKey,
            spentUsd: Number(ledger.spentUsd.toFixed(4)),
            limitUsd: monthlyBudgetUsd,
            remainingUsd: Number(Math.max(0, monthlyBudgetUsd - ledger.spentUsd).toFixed(4)),
            callsCount: ledger.callsCount,
            capReached: ledger.spentUsd >= monthlyBudgetUsd
          }
        }))
        return
      }

      if (req.method !== 'POST') {
        next()
        return
      }

      if (!serverApiKey || serverApiKey.length <= 10) {
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, configured: false, error: 'GEMINI_API_KEY ausente no .env' }))
        return
      }

      if (req.headers?.['x-craque-client'] !== 'career-rpg-v2') {
        res.statusCode = 403
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: 'Assinatura de cliente inválida' }))
        return
      }

      const ip = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim()
      if (isRateLimited(ip)) {
        res.statusCode = 429
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: 'Rate limit excedido' }))
        return
      }

      if (ledger.spentUsd >= monthlyBudgetUsd) {
        res.statusCode = 429
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          ok: false,
          capReached: true,
          error: `Teto mensal de US$ ${monthlyBudgetUsd.toFixed(2)} atingido`
        }))
        return
      }

      let rawBody = ''
      req.on('data', (chunk: any) => {
        rawBody += chunk
      })
      req.on('end', async () => {
        try {
          const parsedBody = rawBody ? JSON.parse(rawBody) : {}
          const prompt = String(parsedBody.prompt || '').trim()
          const temperature = Math.min(1.0, Math.max(0.2, typeof parsedBody.temperature === 'number' ? parsedBody.temperature : 0.75))

          const hasValidGameSignature = ALLOWED_PROMPT_PREFIXES.some(prefix => prompt.startsWith(prefix))
          if (!prompt || prompt.length > 7500 || !hasValidGameSignature) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Prompt bloqueado pela política anti-sequestro' }))
            return
          }

          const upstream = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${serverApiKey}`,
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
          )

          if (!upstream.ok) {
            res.statusCode = upstream.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: `Gemini HTTP ${upstream.status}` }))
            return
          }

          const data: any = await upstream.json()
          const usage = data?.usageMetadata || {}
          const inTokens = Number(usage.promptTokenCount || Math.ceil(prompt.length / 4))
          const outTokens = Number(usage.candidatesTokenCount || 350)
          const callCostUsd = (inTokens / 1_000_000) * INPUT_USD_PER_MILLION + (outTokens / 1_000_000) * OUTPUT_USD_PER_MILLION

          ledger.inputTokens += inTokens
          ledger.outputTokens += outTokens
          ledger.callsCount += 1
          ledger.spentUsd += callCostUsd
          writeLedger(ledger)

          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text
          const parsed = jsonText ? JSON.parse(jsonText) : null

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            ok: true,
            configured: true,
            data: parsed,
            budget: {
              spentUsd: Number(ledger.spentUsd.toFixed(4)),
              limitUsd: monthlyBudgetUsd,
              callsCount: ledger.callsCount
            }
          }))
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: err?.message || 'Erro interno no proxy Gemini' }))
        }
      })
    })
  }

  return {
    name: 'craque-gemini-secure-proxy',
    configureServer(server) {
      attachMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const resolvedKey = (process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '').trim()
  const monthlyBudgetUsd = Math.max(0.5, Number(process.env.GEMINI_MONTHLY_BUDGET_USD || env.GEMINI_MONTHLY_BUDGET_USD || '9.00'))

  return {
    plugins: [react(), geminiProxyPlugin(resolvedKey, monthlyBudgetUsd)],
    server: {
      host: true,
      port: 3000,
      cors: true,
      allowedHosts: true
    }
  }
})
