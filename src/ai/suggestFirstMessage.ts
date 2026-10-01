import { GoogleGenAI } from '@google/genai'

export type SuggestFirstMessageInput = {
  nome: string
  imovelInteresse: string
}

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no arquivo .env.')
  }

  return apiKey
}

/**
 * Gera uma sugestão de primeira mensagem para um lead.
 * Deve rodar no Node (não no navegador), para a chave não ir para o frontend.
 */
export async function suggestFirstMessage(
  input: SuggestFirstMessageInput,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() })

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Escreva uma primeira mensagem curta e profissional para o lead chamado "${input.nome}", interessado em "${input.imovelInteresse}".
A mensagem deve ser personalizada, educada e adequada a um primeiro contato comercial imobiliário.
Responda apenas com o texto da mensagem, sem aspas e sem explicações.`,
          },
        ],
      },
    ],
  })

  const suggestion = response.text?.trim()

  if (!suggestion) {
    throw new Error('O Gemini não retornou uma sugestão de mensagem.')
  }

  return suggestion
}
