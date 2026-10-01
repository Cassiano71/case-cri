import type { LeadSummary } from '../queries'

const CARDS: Array<{ key: keyof LeadSummary; label: string; tone: string }> = [
  { key: 'total', label: 'Total de leads', tone: 'total' },
  { key: 'Novo', label: 'Novos', tone: 'novo' },
  { key: 'Em contato', label: 'Em contato', tone: 'contato' },
  { key: 'Qualificado', label: 'Qualificados', tone: 'qualificado' },
  { key: 'Perdido', label: 'Perdidos', tone: 'perdido' },
]

type SummaryCardsProps = {
  summary: LeadSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="summary-grid" aria-label="Resumo de leads">
      {CARDS.map((card) => (
        <article key={card.key} className={`summary-card summary-card--${card.tone}`}>
          <p className="summary-card__label">{card.label}</p>
          <p className="summary-card__value">{summary[card.key]}</p>
        </article>
      ))}
    </section>
  )
}
