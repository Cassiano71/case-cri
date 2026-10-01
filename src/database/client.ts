import { createClient } from '@supabase/supabase-js'
import { appConfig } from '../config'

function assertSupabaseConfig() {
  if (!appConfig.supabaseUrl || !appConfig.supabaseAnonKey) {
    throw new Error(
      'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas. Copie .env.example para .env e preencha os valores.',
    )
  }
}

assertSupabaseConfig()

/**
 * Cliente único do Supabase para a aplicação.
 * Usa apenas a chave anônima (pública) via variáveis de ambiente.
 */
export const supabase = createClient(
  appConfig.supabaseUrl,
  appConfig.supabaseAnonKey,
)
