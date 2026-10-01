import { useEffect, useMemo, useState } from 'react'
import { getLeads } from '../database'
import type { Lead } from '../database'
import { filterLeadsByStatus, summarizeLeads } from '../queries'
import type { StatusFilterValue } from '../queries'
import { Header } from './Header'
import { LeadsTable } from './LeadsTable'
import { MessageSuggestion } from './MessageSuggestion'
import { StatusFilter } from './StatusFilter'
import { SummaryCards } from './SummaryCards'

/**
 * Painel de leads: busca os dados no Supabase e aplica filtro/resumo na interface.
 */
export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('Todos')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadLeads() {
      try {
        setLoading(true)
        setErrorMessage(null)
        const data = await getLeads()
        if (!cancelled) {
          setLeads(data)
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : 'Erro inesperado ao conectar com o Supabase.'
          setErrorMessage(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadLeads()

    return () => {
      cancelled = true
    }
  }, [])

  const summary = useMemo(() => summarizeLeads(leads), [leads])
  const visibleLeads = useMemo(
    () => filterLeadsByStatus(leads, statusFilter),
    [leads, statusFilter],
  )

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <div className="page-heading">
          <p className="page-heading__eyebrow">Gestão comercial</p>
          <h1>CRI Leads</h1>
          <p className="page-heading__subtitle">
            Acompanhe os leads recebidos e filtre pelo estágio do atendimento.
          </p>
        </div>

        {loading && (
          <p className="state-message" role="status">
            Carregando leads...
          </p>
        )}

        {!loading && errorMessage && (
          <p className="state-message state-message--error" role="alert">
            Não foi possível carregar os leads. {errorMessage}
          </p>
        )}

        {!loading && !errorMessage && (
          <>
            <SummaryCards summary={summary} />
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />

            {visibleLeads.length === 0 ? (
              <p className="state-message">Nenhum lead encontrado para este filtro.</p>
            ) : (
              <section className="table-panel" aria-label="Listagem de leads">
                <div className="table-panel__header">
                  <h2>Leads</h2>
                  <p>
                    {visibleLeads.length} {visibleLeads.length === 1 ? 'registro' : 'registros'}
                  </p>
                </div>
                <LeadsTable leads={visibleLeads} />
              </section>
            )}

            <MessageSuggestion leads={leads} />
          </>
        )}
      </main>
    </div>
  )
}
