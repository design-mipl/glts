import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ReconciliationRow } from '../../data/accountsDashboardMock'

export interface ReconciliationColumnHandlers {
  onResolve: (row: ReconciliationRow) => void
}

export function buildReconciliationColumns({
  onResolve,
}: ReconciliationColumnHandlers): Column<ReconciliationRow>[] {
  return [
    { key: 'referenceNo', label: 'Reference No.', widthSize: adminListingColumnWidthSize('code') },
    { key: 'payment', label: 'Payment', widthSize: adminListingColumnWidthSize('code') },
    { key: 'invoice', label: 'Invoice', widthSize: adminListingColumnWidthSize('code') },
    { key: 'difference', label: 'Difference', widthSize: adminListingColumnWidthSize('code') },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => {
        const lower = row.status.toLowerCase()
        const color =
          lower.includes('variance') ? 'error' : lower.includes('matched') ? 'success' : 'warning'
        return <Badge label={row.status} color={color} size="sm" />
      },
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions
          row={row}
          actions={[{ label: 'Resolve', onClick: () => onResolve(row) }]}
        />
      ),
    },
  ]
}
