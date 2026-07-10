import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ReviewQcRow } from '../../data/operationsConsultantDashboardMock'
import { slaStatusColor } from '../../utils/applyOperationsConsultantFilters'

export interface ReviewQcColumnHandlers {
  onApprove: (row: ReviewQcRow) => void
  onRaiseCorrection: (row: ReviewQcRow) => void
}

export function buildReviewQcColumns({
  onApprove,
  onRaiseCorrection,
}: ReviewQcColumnHandlers): Column<ReviewQcRow>[] {
  return [
    { key: 'applicationId', label: 'Application ID', widthSize: adminListingColumnWidthSize('code'), hideable: false },
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name') },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'submittedBy', label: 'Submitted By', widthSize: adminListingColumnWidthSize('assignee') },
    { key: 'currentStage', label: 'Current Stage', widthSize: adminListingColumnWidthSize('status') },
    {
      key: 'slaTimer',
      label: 'SLA Timer',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => (
        <Badge label={row.slaTimer} color={slaStatusColor(row.slaStatus)} size="sm" />
      ),
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
          actions={[
            { label: 'Approve', onClick: () => onApprove(row) },
            { label: 'Raise Correction', onClick: () => onRaiseCorrection(row) },
          ]}
        />
      ),
    },
  ]
}
