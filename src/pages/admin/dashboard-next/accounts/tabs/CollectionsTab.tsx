import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Badge, RowActions, Tabs, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import { InvoiceSubmissionCalendar } from '../components/InvoiceSubmissionCalendar'
import type { AccountsDashboardTabProps, AccountsFollowUpRow } from '../types'

type CreditDeskTab = 'follow_ups' | 'calendar'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('partial') || s.includes('scheduled')) return 'info'
  if (s.includes('overdue') || s.includes('due')) return 'error'
  if (s.includes('open')) return 'warning'
  return 'neutral'
}

function getFollowUpCell(row: AccountsFollowUpRow, key: string): string {
  const value = row[key as keyof AccountsFollowUpRow]
  return value == null ? '' : String(value)
}

/** Credit control desk — follow-ups · submission calendar. */
export function CollectionsTab({
  data,
  loading,
  onNavigate,
  onOpenCollection,
}: AccountsDashboardTabProps) {
  const [deskTab, setDeskTab] = useState<CreditDeskTab>('follow_ups')

  const followUpColumns: Column<AccountsFollowUpRow>[] = useMemo(
    () => [
      {
        key: 'invoiceNumber',
        label: 'Invoice ID',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'client',
        label: 'Company Name',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'outstandingAmount',
        label: 'Balance Payable',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'followUpDate',
        label: 'Due Date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'status',
        label: 'Invoice Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
      },
      {
        key: 'actions',
        label: '',
        hideable: false,
        sortable: false,
        filterable: false,
        searchable: false,
        width: 56,
        render: (_value, row) => (
          <RowActions
            actions={[
              {
                label: 'View Details',
                onClick: () => onOpenCollection?.(row.id),
              },
            ]}
          />
        ),
      },
    ],
    [onOpenCollection],
  )

  return (
    <Stack spacing={1.5}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={deskTab}
          onChange={(value) => setDeskTab(value as CreditDeskTab)}
          variant="underline"
          size="sm"
          items={[
            { value: 'follow_ups', label: `Follow-ups (${data.followUpRows.length})` },
            { value: 'calendar', label: 'Submission calendar' },
          ]}
        />
      </Box>

      {deskTab === 'follow_ups' ? (
        <AccountsWorkListing
          title="Daily follow-ups"
          description="Follow-ups due / completed per client"
          rows={data.followUpRows}
          columns={followUpColumns}
          getCellValue={getFollowUpCell}
          loading={loading}
          onOpen={(row) => onOpenCollection?.(row.id)}
          onViewAll={() => onNavigate('/admin/finance/invoices')}
          viewAllLabel="Open invoices"
          searchPlaceholder="Search client, follow-up, status…"
          exportFileName="daily-follow-ups"
          emptyTitle="No follow-ups"
          emptyDescription="Client follow-up tasks will appear here."
        />
      ) : null}

      {deskTab === 'calendar' ? (
        <InvoiceSubmissionCalendar submissions={data.invoiceSubmissions} loading={loading} />
      ) : null}
    </Stack>
  )
}
