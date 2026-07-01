import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ReadyForSubmissionRow } from '../../data/documentationDashboardMock'

export interface ReadyForSubmissionColumnHandlers {
  onPrepare: (row: ReadyForSubmissionRow) => void
}

export function buildReadyForSubmissionColumns({
  onPrepare,
}: ReadyForSubmissionColumnHandlers): Column<ReadyForSubmissionRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'visaType', label: 'Visa Type', widthSize: adminListingColumnWidthSize('service') },
    {
      key: 'submissionReadiness',
      label: 'Submission Readiness',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => <Badge label={row.submissionReadiness} color="success" size="sm" />,
    },
    { key: 'documentsVerified', label: 'Documents Verified', widthSize: adminListingColumnWidthSize('count') },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions row={row} actions={[{ label: 'Prepare', onClick: () => onPrepare(row) }]} />
      ),
    },
  ]
}
