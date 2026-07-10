import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildPendingCollectionsColumns } from '../columns/pendingCollectionsColumns'
import type { PendingCollectionRow } from '../../data/accountsDashboardMock'

export interface PendingCollectionsSectionProps {
  collections: PendingCollectionRow[]
  getCellValue: (row: PendingCollectionRow, key: string) => string
  loading?: boolean
}

export function PendingCollectionsSection({
  collections,
  getCellValue,
  loading = false,
}: PendingCollectionsSectionProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const columns = useMemo(
    () =>
      buildPendingCollectionsColumns({
        onView: (row) => navigate(row.invoiceHref),
        onFollowUp: (row) =>
          showToast({
            title: 'Follow-up recorded',
            description: `Follow-up logged for ${row.invoiceNumber}.`,
            variant: 'success',
          }),
      }),
    [navigate, showToast],
  )

  return (
    <DashboardSectionTable
      title="Pending collections"
      subtitle="Primary collections queue — sorted by overdue amount and follow-up date"
      columns={columns}
      data={collections}
      rowKey="id"
      getCellValue={getCellValue}
      loading={loading}
      pageSize={10}
      onRowClick={(row) => navigate(row.invoiceHref)}
      onViewAll={() => navigate('/admin/finance/invoices?filter=outstanding')}
    />
  )
}
