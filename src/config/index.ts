/**
 * Configurações da aplicação
 *
 * Centraliza constantes e leitura de variáveis de ambiente.
 * Valores reais devem vir do arquivo .env (nunca versionado).
 */

export const appConfig = {
  name: 'CRI Leads',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
} as const
