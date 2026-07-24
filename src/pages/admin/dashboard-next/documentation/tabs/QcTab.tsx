import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardTable, DASHBOARD_SPACING } from '../../shared'
import { buildDocCorrectionRequestColumns } from '@/pages/admin/dashboard/documentation/components/columns/docCorrectionRequestColumns'
import { buildDocReviewQcColumns } from '@/pages/admin/dashboard/documentation/components/columns/docReviewQcColumns'
import type { DocumentationDashboardTabProps } from '../types'

/** QC — pending review queue and correction requests on owned cases. */
export function QcTab({ data, loading }: DocumentationDashboardTabProps) {
  const { showToast } = useToast()

  const reviewColumns = useMemo(
    () =>
      buildDocReviewQcColumns({
        onApprove: (row) =>
          showToast({ title: `Approved ${row.applicationId}`, variant: 'success' }),
        onRaiseCorrection: (row) =>
          showToast({ title: `Correction raised for ${row.applicationId}`, variant: 'info' }),
      }),
    [showToast],
  )

  const correctionColumns = useMemo(() => buildDocCorrectionRequestColumns(), [])

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardTable
          title="Pending my review / QC"
          subtitle="Applications awaiting your verification decision"
          columns={reviewColumns}
          data={data.reviewQcQueue}
          rowKey="id"
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardTable
          title="Correction requests on my cases"
          subtitle="Corrections raised on applications you own"
          columns={correctionColumns}
          data={data.correctionRequests}
          rowKey="id"
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}
