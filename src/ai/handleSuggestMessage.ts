import { suggestFirstMessage } from './suggestFirstMessage'

type IncomingReq = {
  method?: string
  url?: string
  on: (event: string, listener: (chunk?: string | Uint8Array) => void) => void
}

type OutgoingRes = {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (body?: string) => void
}

function sendJson(res: OutgoingRes, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function readBody(req: IncomingReq): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: string[] = []

    req.on('data', (chunk) => {
      if (chunk === undefined) {
        return
      }

      chunks.push(typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk))
    })
    req.on('end', () => resolve(chunks.join('')))
    req.on('error', () => reject(new Error('Falha ao ler o corpo da requisição.')))
  })
}

function isSuggestRoute(url: string | undefined): boolean {
  const path = url?.split('?')[0]
  return path === '/api/suggest-message'
}

/**
 * Endpoint Node usado pelo Vite. Não deve ser importado pelo frontend.
 */
export async function handleSuggestMessageRequest(
  req: IncomingReq,
  res: OutgoingRes,
  next: () => void,
): Promise<void> {
  if (!isSuggestRoute(req.url)) {
    next()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Use POST para gerar a mensagem.' })
    return
  }

  try {
    const raw = await readBody(req)
    const body = raw ? (JSON.parse(raw) as { nome?: unknown; imovelInteresse?: unknown }) : {}
    const nome = typeof body.nome === 'string' ? body.nome.trim() : ''
    const imovelInteresse =
      typeof body.imovelInteresse === 'string' ? body.imovelInteresse.trim() : ''

    if (!nome || !imovelInteresse) {
      sendJson(res, 400, { error: 'Informe o nome do lead e o imóvel de interesse.' })
      return
    }

    const suggestion = await suggestFirstMessage({ nome, imovelInteresse })
    sendJson(res, 200, { suggestion })
  } catch (error) {
    const message =
      error instanceof Error && error.message === 'GEMINI_API_KEY não configurada no arquivo .env.'
        ? 'A chave do Gemini não está configurada no servidor.'
        : 'Não foi possível gerar a mensagem agora. Tente novamente em instantes.'
    sendJson(res, 500, { error: message })
  }
}
