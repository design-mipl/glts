import { useState } from 'react'
import { Stack } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { ApplicationSelectionMode } from '@/shared/types/invoice'
import { BillableApplicationsTable } from './BillableApplicationsTable'

interface InvoiceBillingSelectionPanelProps {
  applicationIds: string[]
  batchIds: string[]
  onApplicationSelectionModeChange: (mode: ApplicationSelectionMode) => void
  onApplicationIdsChange: (ids: string[]) => void
  onBatchIdsChange: (ids: string[]) => void
}

export function InvoiceBillingSelectionPanel({
  applicationIds,
  batchIds,
  onApplicationSelectionModeChange,
  onApplicationIdsChange,
  onBatchIdsChange,
}: InvoiceBillingSelectionPanelProps) {
  const [applicationsCompanyFilterId, setApplicationsCompanyFilterId] = useState('')

  const handleTableSelection = (appIds: string[], batchRowIds: string[]) => {
    onApplicationIdsChange(appIds)
    onBatchIdsChange(batchRowIds)
    if (batchRowIds.length === 1 && appIds.length === 0) {
      onApplicationSelectionModeChange('batch')
    } else if (appIds.length === 1 && batchRowIds.length === 0) {
      onApplicationSelectionModeChange('single')
    } else if (appIds.length > 1 || batchRowIds.length > 1 || (appIds.length > 0 && batchRowIds.length > 0)) {
      onApplicationSelectionModeChange('multiple')
    }
  }

  return (
    <BaseCard sx={{ p: 2 }}>
      <Stack spacing={2}>
        <BillableApplicationsTable
          companyFilterId={applicationsCompanyFilterId}
          onCompanyFilterChange={setApplicationsCompanyFilterId}
          selectedIds={applicationIds}
          selectedBatchIds={batchIds}
          onSelectionChange={handleTableSelection}
        />
      </Stack>
    </BaseCard>
  )
}
