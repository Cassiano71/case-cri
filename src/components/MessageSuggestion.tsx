import { useMemo, useState } from 'react'
import { requestSuggestFirstMessage } from '../ai/requestSuggestFirstMessage'
import type { Lead } from '../database'

type MessageSuggestionProps = {
  leads: Lead[]
}

export function MessageSuggestion({ leads }: MessageSuggestionProps) {
  const [selectedId, setSelectedId] = useState('')
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedLead = useMemo(
    () => leads.find((lead) => String(lead.id) === selectedId) ?? null,
    [leads, selectedId],
  )

  async function handleGenerate() {
    if (!selectedLead) {
      setErrorMessage('Selecione um lead para gerar a mensagem.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      setSuggestion(null)
      const text = await requestSuggestFirstMessage(
        selectedLead.nome,
        selectedLead.imovel_interesse,
      )
      setSuggestion(text)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível gerar a mensagem. Tente novamente.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="ia-panel" aria-label="Sugestão de primeira mensagem">
      <div className="table-panel__header">
        <h2>Primeira mensagem</h2>
        <p>Etapa 4 · Gemini</p>
      </div>

      <div className="ia-panel__body">
        <label className="ia-field">
          <span>Lead</span>
          <select
            value={selectedId}
            onChange={(event) => {
              setSelectedId(event.target.value)
              setSuggestion(null)
              setErrorMessage(null)
            }}
          >
            <option value="">Selecione um lead cadastrado</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.nome} — {lead.imovel_interesse}
              </option>
            ))}
          </select>
        </label>

        {selectedLead && (
          <p className="ia-field-help">
            Imóvel de interesse: {selectedLead.imovel_interesse}
          </p>
        )}

        <button
          type="button"
          className="filter-chip filter-chip--active ia-submit"
          onClick={() => void handleGenerate()}
          disabled={loading || !selectedLead}
        >
          {loading ? 'Gerando mensagem...' : 'Gerar mensagem'}
        </button>

        {loading && (
          <p className="ia-status" role="status">
            A IA está gerando a mensagem...
          </p>
        )}

        {!loading && errorMessage && (
          <p className="state-message state-message--error" role="alert">
            {errorMessage}
          </p>
        )}

        {!loading && suggestion && (
          <blockquote className="ia-result">
            <p>{suggestion}</p>
          </blockquote>
        )}
      </div>
    </section>
  )
}
