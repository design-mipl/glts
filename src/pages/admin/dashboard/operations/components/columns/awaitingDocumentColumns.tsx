import { Badge, Button, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { AwaitingDocumentRow } from '../../data/operationsConsultantDashboardMock'

export interface AwaitingDocumentColumnHandlers {
  onSendReminder: (row: AwaitingDocumentRow) => void
}

export function buildAwaitingDocumentColumns({
  onSendReminder,
}: AwaitingDocumentColumnHandlers): Column<AwaitingDocumentRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    {
      key: 'outstandingDocuments',
      label: 'Outstanding Documents',
      widthSize: adminListingColumnWidthSize('description'),
    },
    { key: 'lastReminderSent', label: 'Last Reminder Sent', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'reminderCount',
      label: 'Reminder Count',
      widthSize: adminListingColumnWidthSize('count'),
      render: (_, row) => <Badge label={String(row.reminderCount)} color="info" size="sm" />,
    },
    {
      key: 'daysWaiting',
      label: 'Days Waiting',
      widthSize: adminListingColumnWidthSize('sla'),
      render: (_, row) => (
        <Badge
          label={`${row.daysWaiting}d`}
          color={row.daysWaiting >= 5 ? 'error' : row.daysWaiting >= 3 ? 'warning' : 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 120,
      render: (_, row) => (
        <Button
          label="Send Reminder"
          variant="outlined"
          size="sm"
          onClick={() => onSendReminder(row)}
        />
      ),
    },
  ]
}
