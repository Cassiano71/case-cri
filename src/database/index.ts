/**
 * Lógica de acesso ao banco (Supabase)
 *
 * - client.ts: cria o cliente com as variáveis de ambiente
 * - types.ts: tipos TypeScript da tabela leads
 * - leadsRepository.ts: funções de leitura dos leads
 */

export { supabase } from './client'
export { getLeads } from './leadsRepository'
export type { Lead } from './types'
