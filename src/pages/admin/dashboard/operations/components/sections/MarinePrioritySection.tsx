import { useMemo } from 'react'
import { DashboardSectionTable } from '@/pages/admin/dashboard/components'
import { buildMarinePriorityColumns } from '../columns/marinePriorityColumns'
import type { MarinePriorityRow } from '../../data/operationsConsultantDashboardMock'

export interface MarinePrioritySectionProps {
  marinePriorityCases: MarinePriorityRow[]
  getCellValue: (row: MarinePriorityRow, key: string) => string
  loading?: boolean
}

export function MarinePrioritySection({
  marinePriorityCases,
  getCellValue,
  loading = false,
}: MarinePrioritySectionProps) {
  const columns = useMemo(() => buildMarinePriorityColumns(), [])

  return (
    <DashboardSectionTable
      title="Marine priority cases"
      subtitle="Crew applications with approaching joining dates — most urgent first"
      columns={columns}
      data={marinePriorityCases}
      rowKey="id"
      getCellValue={getCellValue}
      loading={loading}
      pageSize={8}
    />
  )
}
