import { handleSuggestMessagePost } from '../src/ai/handleSuggestMessage'

type ApiReq = {
  method?: string
  url?: string
  body?: unknown
}

type ApiRes = {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (body?: string) => void
}

export default async function handler(req: ApiReq, res: ApiRes): Promise<void> {
  await handleSuggestMessagePost(req, res)
}
