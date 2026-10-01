import type { Lead } from '../database'

export const LEAD_STATUSES = ['Novo', 'Em contato', 'Qualificado', 'Perdido'] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export type StatusFilterValue = 'Todos' | LeadStatus

export type LeadSummary = {
  total: number
  Novo: number
  'Em contato': number
  Qualificado: number
  Perdido: number
}

export function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function matchesStatus(leadStatus: string, expected: LeadStatus): boolean {
  return normalizeStatus(leadStatus) === normalizeStatus(expected)
}

export function filterLeadsByStatus(leads: Lead[], status: StatusFilterValue): Lead[] {
  if (status === 'Todos') {
    return leads
  }

  return leads.filter((lead) => matchesStatus(lead.status, status))
}

export function summarizeLeads(leads: Lead[]): LeadSummary {
  const summary: LeadSummary = {
    total: leads.length,
    Novo: 0,
    'Em contato': 0,
    Qualificado: 0,
    Perdido: 0,
  }

  for (const lead of leads) {
    for (const status of LEAD_STATUSES) {
      if (matchesStatus(lead.status, status)) {
        summary[status] += 1
        break
      }
    }
  }

  return summary
}

export function formatLeadDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
