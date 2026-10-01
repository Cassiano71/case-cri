import { LEAD_STATUSES, matchesStatus } from '../queries'
import type { LeadStatus } from '../queries'

function statusClass(status: string): string {
  for (const known of LEAD_STATUSES) {
    if (matchesStatus(status, known)) {
      return `status-badge status-badge--${slug(known)}`
    }
  }

  return 'status-badge'
}

function slug(status: LeadStatus): string {
  return status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

type StatusBadgeProps = {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={statusClass(status)}>{status}</span>
}
