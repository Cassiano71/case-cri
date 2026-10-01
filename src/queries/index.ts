/**
 * Consultas e análises sobre os leads já carregados.
 * Não acessa o banco — trabalha com os dados retornados pelo repository.
 */

export {
  LEAD_STATUSES,
  filterLeadsByStatus,
  formatLeadDate,
  matchesStatus,
  summarizeLeads,
} from './leads'

export type { LeadStatus, LeadSummary, StatusFilterValue } from './leads'
