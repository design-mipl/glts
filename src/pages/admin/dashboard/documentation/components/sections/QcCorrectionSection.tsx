import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildDocCorrectionRequestColumns } from '../columns/docCorrectionRequestColumns'
import { buildDocReviewQcColumns } from '../columns/docReviewQcColumns'
import type { DocCorrectionRequestRow, DocReviewQcRow } from '../../data/documentationDashboardMock'

export interface QcCorrectionSectionProps {
  reviewQcQueue: DocReviewQcRow[]
  correctionRequests: DocCorrectionRequestRow[]
  getReviewQcCellValue: (row: DocReviewQcRow, key: string) => string
  getCorrectionCellValue: (row: DocCorrectionRequestRow, key: string) => string
  loading?: boolean
}

export function QcCorrectionSection({
  reviewQcQueue,
  correctionRequests,
  getReviewQcCellValue,
  getCorrectionCellValue,
  loading = false,
}: QcCorrectionSectionProps) {
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
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Pending my review / QC"
          subtitle="Applications awaiting your verification decision"
          columns={reviewColumns}
          data={reviewQcQueue}
          rowKey="id"
          getCellValue={getReviewQcCellValue}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Correction requests on my cases"
          subtitle="Corrections raised on applications you own"
          columns={correctionColumns}
          data={correctionRequests}
          rowKey="id"
          getCellValue={getCorrectionCellValue}
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}
