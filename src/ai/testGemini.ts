import { suggestFirstMessage } from './suggestFirstMessage.ts'

async function main() {
  const suggestion = await suggestFirstMessage({
    nome: 'João Silva',
    imovelInteresse: 'Apartamento de 3 quartos no Centro',
  })

  console.log(suggestion)
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Erro inesperado ao chamar o Gemini.'
  console.error(message)
  process.exitCode = 1
})
