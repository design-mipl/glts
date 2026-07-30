import { useMemo } from 'react'
import { Stack, Typography } from '@mui/material'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import type { AccountsDashboardTabProps, AccountsVisaSubmissionCaseRow } from '../types'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('collect') || s.includes('submitted')) return 'success'
  if (s.includes('pending')) return 'warning'
  return 'info'
}

function getCellValue(row: AccountsVisaSubmissionCaseRow, key: string): string {
  const value = row[key as keyof AccountsVisaSubmissionCaseRow]
  return value == null ? '' : String(value)
}

/** Invoicing desk — visa submission status as AdminListingTable. */
export function InvoicingTab({
  data,
  loading,
  onNavigate,
  onOpenInvoice,
}: AccountsDashboardTabProps) {
  const columns: Column<AccountsVisaSubmissionCaseRow>[] = useMemo(
    () => [
      {
        key: 'caseId',
        label: 'Case ID',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'applicant',
        label: 'Applicant',
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
        key: 'country',
        label: 'Country',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'visaType',
        label: 'Visa type',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'submissionStatus',
        label: 'Submission',
        widthSize: 'md',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <Badge label={row.submissionStatus} color={statusColor(row.submissionStatus)} />
        ),
      },
      {
        key: 'billingCycle',
        label: 'Cycle',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
      },
      {
        key: 'invoiceReady',
        label: 'Invoice ready',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => (
          <Badge
            label={row.invoiceReady}
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
                label: 'Open invoice',
                onClick: () => onOpenInvoice?.(row.id),
              },
              {
                label: 'Open invoices list',
                onClick: () => onNavigate('/admin/finance/invoices'),
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate, onOpenInvoice],
  )

  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, px: 0.25 }}>
        Daily / weekly / fortnightly / monthly visa submission status for invoice posting.
      </Typography>
      <AccountsWorkListing
        title="Visa submission & status"
        description="Cases ready to post invoices"
        rows={data.visaSubmissionRows}
        columns={columns}
        getCellValue={getCellValue}
        loading={loading}
        onOpen={(row) => onOpenInvoice?.(row.id)}
        onViewAll={() => onNavigate('/admin/finance/invoices')}
        viewAllLabel="Open invoices"
        emptyTitle="No visa cases ready"
        emptyDescription="Submitted or collected cases awaiting invoice will appear here."
      />
    </Stack>
  )
}
