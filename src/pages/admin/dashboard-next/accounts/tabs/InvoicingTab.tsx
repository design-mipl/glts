import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Badge, RowActions, Tabs, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import type {
  AccountsDashboardTabProps,
  AccountsInvoiceExceptionRow,
  AccountsVisaSubmissionCaseRow,
} from '../types'

type InvoiceDeskTab = 'ready' | 'exceptions'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('collect') || s.includes('submitted') || s.includes('issued')) return 'success'
  if (s.includes('pending') || s.includes('draft') || s.includes('awaiting')) return 'warning'
  if (s.includes('overdue')) return 'error'
  return 'info'
}

function getVisaCell(row: AccountsVisaSubmissionCaseRow, key: string): string {
  if (key === 'country') return `${row.country} · ${row.visaType}`
  const value = row[key as keyof AccountsVisaSubmissionCaseRow]
  return value == null ? '' : String(value)
}

function getExceptionCell(row: AccountsInvoiceExceptionRow, key: string): string {
  const value = row[key as keyof AccountsInvoiceExceptionRow]
  return value == null ? '' : String(value)
}

/** Invoicing desk — visa ready to invoice + unbilled / refunds / credit notes. */
export function InvoicingTab({
  data,
  loading,
  onNavigate,
  onOpenInvoice,
}: AccountsDashboardTabProps) {
  const [deskTab, setDeskTab] = useState<InvoiceDeskTab>('ready')

  const readyRows = data.visaSubmissionRows.filter((r) => r.invoiceReady === 'Yes')
  const exceptionCount = data.invoiceExceptionRows.length

  const visaColumns: Column<AccountsVisaSubmissionCaseRow>[] = useMemo(
    () => [
      {
        key: 'caseId',
        label: 'GLTS Reference',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'applicant',
        label: 'Pax name',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'client',
        label: 'Company',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'country',
        label: 'Country / Visa',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        render: (_value, row) => `${row.country} · ${row.visaType}`,
      },
      {
        key: 'submissionStatus',
        label: 'Status',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <Badge label={row.submissionStatus} color={statusColor(row.submissionStatus)} />
        ),
      },
      {
        key: 'billingCycle',
        label: 'Billing Cycle',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
      },
      {
        key: 'invoiceReady',
        label: 'Invoice Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <Badge
            label={row.invoiceReady === 'Yes' ? 'Ready' : 'Not Ready'}
            color={row.invoiceReady === 'Yes' ? 'success' : 'warning'}
          />
        ),
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
                onClick: () => onNavigate('/admin/finance/invoices'),
              },
              {
                label: 'Open invoices listing',
                onClick: () => onOpenInvoice?.(row.id),
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate, onOpenInvoice],
  )

  const exceptionColumns: Column<AccountsInvoiceExceptionRow>[] = useMemo(
    () => [
      {
        key: 'reference',
        label: 'Invoice ID',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'kindLabel',
        label: 'Invoice Type',
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
        key: 'application',
        label: 'Application ID',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'amount',
        label: 'Invoice Amount',
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
        key: 'date',
        label: 'Invoice Date',
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
                label: 'View Details',
                onClick: () =>
                  onNavigate(
                    row.kind === 'credit_note'
                      ? '/admin/finance/invoices?tab=credit_notes'
                      : '/admin/finance/invoices',
                  ),
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate],
  )

  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, px: 0.25 }}>
        Invoice generation — ready cases, unbilled expenses, refunds, and credit notes.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={deskTab}
          onChange={(value) => setDeskTab(value as InvoiceDeskTab)}
          variant="underline"
          size="sm"
          items={[
            { value: 'ready', label: `Ready to invoice (${readyRows.length})` },
            { value: 'exceptions', label: `Unbilled / refunds / CN (${exceptionCount})` },
          ]}
        />
      </Box>

      {deskTab === 'ready' ? (
        <AccountsWorkListing
          title="Visa submission & status"
          description="Cases ready to post invoices by billing cycle"
          rows={data.visaSubmissionRows}
          columns={visaColumns}
          getCellValue={getVisaCell}
          loading={loading}
          onOpen={(row) => onOpenInvoice?.(row.id)}
          onViewAll={() => onNavigate('/admin/finance/invoices')}
          viewAllLabel="Open invoices"
          searchPlaceholder="Search application, client, country…"
          exportFileName="visa-submission-ready"
          emptyTitle="No visa cases ready"
          emptyDescription="Submitted or collected cases awaiting invoice will appear here."
        />
      ) : (
        <AccountsWorkListing
          title="Invoice exceptions"
          description="Unbilled expenses · invoice refunds · credit notes"
          rows={data.invoiceExceptionRows}
          columns={exceptionColumns}
          getCellValue={getExceptionCell}
          loading={loading}
          onOpen={() => onNavigate('/admin/finance/invoices')}
          onViewAll={() => onNavigate('/admin/finance/invoices')}
          viewAllLabel="Open invoices"
          searchPlaceholder="Search type, application, status…"
          exportFileName="invoice-exceptions"
          emptyTitle="No exceptions"
          emptyDescription="Unbilled expenses, refunds, and credit notes will appear here."
        />
      )}
    </Stack>
  )
}
