import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildMyApplicationsColumns } from '../columns/myApplicationsColumns'
import type { MyApplicationRow } from '../../data/operationsConsultantDashboardMock'

export interface MyApplicationsSectionProps {
  applications: MyApplicationRow[]
  getCellValue: (row: MyApplicationRow, key: string) => string
  loading?: boolean
}

export function MyApplicationsSection({
  applications,
  getCellValue,
  loading = false,
}: MyApplicationsSectionProps) {
  const navigate = useNavigate()

  const columns = useMemo(
    () =>
      buildMyApplicationsColumns({
        onView: (row) => navigate(row.applicationHref),
      }),
    [navigate],
  )

  return (
    <DashboardSectionTable
      title="My applications"
      subtitle="Your primary working queue — sorted by deadline and priority"
      columns={columns}
      data={applications}
      rowKey="id"
      getCellValue={getCellValue}
      loading={loading}
      pageSize={10}
      onRowClick={(row) => navigate(row.applicationHref)}
      onViewAll={() => navigate('/admin/application-management/marine')}
    />
  )
}
