import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Badge, RowActions, Tabs, useToast, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import { InvoiceSubmissionCalendar } from '../components/InvoiceSubmissionCalendar'
import type {
  AccountsDashboardTabProps,
  AccountsFollowUpRow,
  AccountsPaymentAllocationRow,
} from '../types'

type CreditDeskTab = 'allocation' | 'follow_ups' | 'calendar'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('allocat') && !s.includes('un')) return 'success'
  if (s.includes('partial') || s.includes('scheduled')) return 'info'
  if (s.includes('overdue') || s.includes('unallocat') || s.includes('due')) return 'error'
  if (s.includes('open')) return 'warning'
  return 'neutral'
}

function getAllocationCell(row: AccountsPaymentAllocationRow, key: string): string {
  const value = row[key as keyof AccountsPaymentAllocationRow]
  return value == null ? '' : String(value)
}

function getFollowUpCell(row: AccountsFollowUpRow, key: string): string {
  const value = row[key as keyof AccountsFollowUpRow]
  return value == null ? '' : String(value)
}

/** Credit control desk — allocation · follow-ups · submission calendar. */
export function CollectionsTab({
  data,
  loading,
  onNavigate,
  onOpenCollection,
}: AccountsDashboardTabProps) {
  const { showToast } = useToast()
  const [deskTab, setDeskTab] = useState<CreditDeskTab>('allocation')

  const allocationColumns: Column<AccountsPaymentAllocationRow>[] = useMemo(
    () => [
      {
        key: 'receiptRef',
        label: 'Receipt',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'client',
        label: 'Client',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'clientType',
        label: 'Type',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.clientType} color="info" />,
      },
      {
        key: 'amount',
        label: 'Amount',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'invoiceNumber',
        label: 'Invoice',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'allocationStatus',
        label: 'Allocation',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <Badge label={row.allocationStatus} color={statusColor(row.allocationStatus)} />
        ),
      },
      {
        key: 'receivedDate',
        label: 'Received',
        widthSize: 'md',
        sortable: true,
        filterable: true,
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
                label: 'Allocate',
                onClick: () =>
                  showToast({
                    title: 'Allocation opened',
                    description: `Allocate ${row.receiptRef} to ${row.invoiceNumber}.`,
                    variant: 'info',
                  }),
              },
              {
                label: 'Open invoice',
                onClick: () => onOpenCollection?.(row.id),
              },
            ]}
          />
        ),
      },
    ],
    [onOpenCollection, showToast],
  )

  const followUpColumns: Column<AccountsFollowUpRow>[] = useMemo(
    () => [
      {
        key: 'client',
        label: 'Client',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'invoiceNumber',
        label: 'Invoice',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'outstandingAmount',
        label: 'Outstanding',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'followUpDate',
        label: 'Follow-up date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'lastNote',
        label: 'Last note',
        widthSize: 'lg',
        sortable: false,
        filterable: true,
        searchable: true,
      },
      {
        key: 'status',
        label: 'Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
      },
      {
        key: 'assignedExecutive',
        label: 'Assigned',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
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
                label: 'Log follow-up',
                onClick: () =>
                  showToast({
                    title: 'Follow-up recorded',
                    description: `Follow-up logged for ${row.invoiceNumber}.`,
                    variant: 'info',
                  }),
              },
              {
                label: 'Open invoice',
                onClick: () => onOpenCollection?.(row.id),
              },
            ]}
          />
        ),
      },
    ],
    [onOpenCollection, showToast],
  )

  const unallocated = data.paymentAllocationRows.filter((r) => r.allocationStatus !== 'Allocated')
    .length

  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, px: 0.25 }}>
        Allocate receipts, chase follow-ups, and track invoice submission calendar.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={deskTab}
          onChange={(value) => setDeskTab(value as CreditDeskTab)}
          variant="underline"
          size="sm"
          items={[
            { value: 'allocation', label: `Allocation (${unallocated})` },
            { value: 'follow_ups', label: `Follow-ups (${data.followUpRows.length})` },
            { value: 'calendar', label: 'Submission calendar' },
          ]}
        />
      </Box>

      {deskTab === 'allocation' ? (
        <AccountsWorkListing
          title="Payment allocation queue"
          description="Walk-in · Client · B2B receipts to allocate"
          rows={data.paymentAllocationRows}
          columns={allocationColumns}
          getCellValue={getAllocationCell}
          loading={loading}
          onOpen={(row) => onOpenCollection?.(row.id)}
          onViewAll={() => onNavigate('/admin/finance/invoices')}
          viewAllLabel="Open invoices"
          emptyTitle="No receipts to allocate"
          emptyDescription="Today's payment receipts will appear here for allocation."
        />
      ) : null}

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
