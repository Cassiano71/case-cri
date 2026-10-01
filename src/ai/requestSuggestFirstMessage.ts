export async function requestSuggestFirstMessage(
  nome: string,
  imovelInteresse: string,
): Promise<string> {
  const response = await fetch('/api/suggest-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome, imovelInteresse }),
  })

  const payload = (await response.json().catch(() => null)) as
    | { suggestion?: string; error?: string }
    | null

  if (!response.ok) {
    throw new Error(payload?.error ?? 'Não foi possível gerar a mensagem.')
  }

  if (!payload?.suggestion) {
    throw new Error('A IA não retornou uma sugestão de mensagem.')
  }

  return payload.suggestion
}
