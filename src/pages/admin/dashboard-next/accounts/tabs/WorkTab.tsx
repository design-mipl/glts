import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { CollectionsTab } from './CollectionsTab'
import { FundAllocationDeskTab } from './FundAllocationDeskTab'
import { InvoicingTab } from './InvoicingTab'
import { ReconciliationTab } from './ReconciliationTab'
import { VendorBillingDeskTab } from './VendorBillingDeskTab'
import type { AccountsDashboardTabProps } from '../types'

type WorkTeamTabId =
  | 'expenses'
  | 'fund_allocation'
  | 'vendor_billing'
  | 'invoicing'
  | 'credit_control'

/**
 * Work tab — desks aligned to finance modules:
 * Expenses · Fund allocation · Vendor billing · Invoicing · Credit control.
 */
export function WorkTab(props: AccountsDashboardTabProps) {
  const [teamTab, setTeamTab] = useState<WorkTeamTabId>('expenses')

  const expensesBadge =
    props.data.expenseDailyRows.length +
    props.data.expenseRefundRows.filter((r) => r.status.toLowerCase().includes('pending')).length

  const fundsBadge =
    props.data.fundAllocationRows.filter((r) => r.allocationStatus === 'Pending').length +
    props.data.claimSheetRows.filter((r) => r.status === 'Pending review').length

  const vendorBadge = props.data.vendorBillingRows.reduce(
    (sum, r) => sum + r.awaitingInvoiceCount,
    0,
  )

  const invoiceBadge =
    props.data.visaSubmissionRows.filter((r) => r.invoiceReady === 'Yes').length +
    props.data.invoiceExceptionRows.length

  const creditBadge = props.data.followUpRows.length

  const tabItems = useMemo(
    () => [
      { value: 'expenses' as const, label: `Expenses (${expensesBadge})` },
      { value: 'fund_allocation' as const, label: `Fund allocation (${fundsBadge})` },
      { value: 'vendor_billing' as const, label: `Vendor billing (${vendorBadge})` },
      { value: 'invoicing' as const, label: `Invoicing (${invoiceBadge})` },
      { value: 'credit_control' as const, label: `Credit control (${creditBadge})` },
    ],
    [expensesBadge, fundsBadge, vendorBadge, invoiceBadge, creditBadge],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={teamTab}
          onChange={(value) => setTeamTab(value as WorkTeamTabId)}
          variant="underline"
          size="sm"
          items={tabItems}
        />
      </Box>

      {teamTab === 'expenses' ? <ReconciliationTab {...props} /> : null}
      {teamTab === 'fund_allocation' ? <FundAllocationDeskTab {...props} /> : null}
      {teamTab === 'vendor_billing' ? <VendorBillingDeskTab {...props} /> : null}
      {teamTab === 'invoicing' ? <InvoicingTab {...props} /> : null}
      {teamTab === 'credit_control' ? <CollectionsTab {...props} /> : null}
    </Stack>
  )
}
