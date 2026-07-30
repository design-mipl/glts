import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { CollectionsTab } from './CollectionsTab'
import { InvoicingTab } from './InvoicingTab'
import { ReconciliationTab } from './ReconciliationTab'
import type { AccountsDashboardTabProps } from '../types'

type WorkTeamTabId = 'reconciliation' | 'invoicing' | 'credit_control'

/**
 * Work tab — daily desks for Reconciliation, Invoicing, and Credit Control teams.
 */
export function WorkTab(props: AccountsDashboardTabProps) {
  const [teamTab, setTeamTab] = useState<WorkTeamTabId>('reconciliation')

  const reconBadge = props.data.expenseDailyRows.length + props.data.reconciliationRows.length
  const invoiceBadge =
    props.data.visaSubmissionRows.filter((r) => r.invoiceReady === 'Yes').length +
    props.data.invoicePostingQueue.length
  const creditBadge =
    props.data.paymentAllocationRows.filter((r) => r.allocationStatus !== 'Allocated').length +
    props.data.followUpRows.length

  const tabItems = useMemo(
    () => [
      { value: 'reconciliation' as const, label: `Reconciliation (${reconBadge})` },
      { value: 'invoicing' as const, label: `Invoicing (${invoiceBadge})` },
      { value: 'credit_control' as const, label: `Credit control (${creditBadge})` },
    ],
    [reconBadge, invoiceBadge, creditBadge],
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

      {teamTab === 'reconciliation' ? <ReconciliationTab {...props} /> : null}
      {teamTab === 'invoicing' ? <InvoicingTab {...props} /> : null}
      {teamTab === 'credit_control' ? <CollectionsTab {...props} /> : null}
    </Stack>
  )
}
