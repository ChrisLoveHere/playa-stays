// ============================================================
// ComparisonTable — "Typical manager vs PlayaStays"
// Shared markup + classes; styles in globals.css
// ============================================================

import { COMPARISON_ROWS } from '@/lib/calculator-data'
import type { Locale } from '@/lib/i18n'

interface ComparisonTableProps {
  locale: Locale
}

export function ComparisonTable({ locale }: ComparisonTableProps) {
  const isEs = locale === 'es'

  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th scope="col">{isEs ? 'Criterio' : 'Criteria'}</th>
            <th scope="col">{isEs ? 'Empresa típica' : 'Typical Manager'}</th>
            <th scope="col" className="comparison-th-brand">
              <span className="comparison-th-brand-inner">PlayaStays</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row, i) => (
            <tr key={i}>
              <td className="comparison-td comparison-td-feature">
                {isEs ? row.featureEs : row.feature}
              </td>
              <td className="comparison-td comparison-td-typical">
                {isEs ? row.typicalEs : row.typical}
              </td>
              <td
                className={
                  row.highlight
                    ? 'comparison-td comparison-td-ps comparison-td-ps--highlight'
                    : 'comparison-td comparison-td-ps'
                }
              >
                {isEs ? row.playastaysEs : row.playastays}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
