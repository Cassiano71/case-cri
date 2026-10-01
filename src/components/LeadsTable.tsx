import type { Lead } from '../database'
import { formatLeadDate } from '../queries'
import { StatusBadge } from './StatusBadge'

type LeadsTableProps = {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <>
      <div className="table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Imóvel de interesse</th>
              <th>Origem</th>
              <th>Status</th>
              <th>Data de criação</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="leads-table__name">{lead.nome}</td>
                <td>{lead.telefone}</td>
                <td>{lead.imovel_interesse}</td>
                <td>{lead.origem}</td>
                <td>
                  <StatusBadge status={lead.status} />
                </td>
                <td>{formatLeadDate(lead.data_criacao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="leads-cards">
        {leads.map((lead) => (
          <li key={lead.id} className="lead-card">
            <div className="lead-card__top">
              <strong>{lead.nome}</strong>
              <StatusBadge status={lead.status} />
            </div>
            <dl>
              <div>
                <dt>Telefone</dt>
                <dd>{lead.telefone}</dd>
              </div>
              <div>
                <dt>Imóvel</dt>
                <dd>{lead.imovel_interesse}</dd>
              </div>
              <div>
                <dt>Origem</dt>
                <dd>{lead.origem}</dd>
              </div>
              <div>
                <dt>Criado em</dt>
                <dd>{formatLeadDate(lead.data_criacao)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}
