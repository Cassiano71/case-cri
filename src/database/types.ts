/**
 * Tipos da tabela public.leads
 * Espelham as colunas existentes no Supabase (sem alterar o banco).
 */
export type Lead = {
  id: number
  nome: string
  telefone: string
  imovel_interesse: string
  origem: string
  status: string
  data_criacao: string
}
