import { supabase } from './client'
import type { Lead } from './types'

/**
 * Busca todos os leads da tabela public.leads.
 * Não altera nem insere dados — apenas leitura.
 */
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('id, nome, telefone, imovel_interesse, origem, status, data_criacao')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Falha ao buscar leads: ${error.message}`)
  }

  return (data ?? []) as Lead[]
}
