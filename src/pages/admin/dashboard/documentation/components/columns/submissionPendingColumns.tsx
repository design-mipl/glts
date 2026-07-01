import { Badge, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { SubmissionPendingRow } from '../../data/documentationDashboardMock'

export function buildSubmissionPendingColumns(): Column<SubmissionPendingRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'embassy', label: 'Embassy', widthSize: adminListingColumnWidthSize('jurisdiction') },
    { key: 'submissionDate', label: 'Submission Date', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'submissionStatus',
      label: 'Submission Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge
          label={row.submissionStatus}
          color={row.submissionStatus === 'Delayed' ? 'error' : 'info'}
          size="sm"
        />
      ),
    },
    { key: 'assignedExecutive', label: 'Assigned Executive', widthSize: adminListingColumnWidthSize('assignee') },
  ]
}
