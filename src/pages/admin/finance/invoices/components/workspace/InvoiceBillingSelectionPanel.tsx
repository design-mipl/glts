import { Stack } from '@mui/material'
import { BaseCard, FormField, Select } from '@/design-system/UIComponents'
import type { ApplicationSelectionMode, BillingMode, InvoiceType } from '@/shared/types/invoice'
import { billingModeLabel, INVOICE_TYPE_OPTIONS } from '../../config/invoiceStatusConfig'
import { BillableApplicationsTable } from './BillableApplicationsTable'
import { CompanyWiseBillingFields } from './CompanyWiseBillingFields'

interface InvoiceBillingSelectionPanelProps {
  billingMode: BillingMode
  applicationSelectionMode: ApplicationSelectionMode
  invoiceType: InvoiceType
  companyId: string
  billingEntity: string
  billingEntityOverride: string
  vesselId: string
  applicationIds: string[]
  batchIds: string[]
  billingPeriodFrom: string
  billingPeriodTo: string
  poReference: string
  onBillingModeChange: (mode: BillingMode) => void
  onApplicationSelectionModeChange: (mode: ApplicationSelectionMode) => void
  onInvoiceTypeChange: (type: InvoiceType) => void
  onCompanyChange: (companyId: string, companyName: string, billingEntity: string) => void
  onBillingEntityOverrideChange: (value: string) => void
  onVesselChange: (vesselId: string, vesselName: string) => void
  onApplicationIdsChange: (ids: string[]) => void
  onBatchIdsChange: (ids: string[]) => void
  onBillingPeriodFromChange: (value: string) => void
  onBillingPeriodToChange: (value: string) => void
  onPoReferenceChange: (value: string) => void
}

const APPLICATION_SELECTION_OPTIONS = [
  { value: 'single', label: 'Single application' },
  { value: 'batch', label: 'Batch application' },
  { value: 'multiple', label: 'Multiple applications' },
]

export function InvoiceBillingSelectionPanel({
  billingMode,
  applicationSelectionMode,
  invoiceType,
  companyId,
  billingEntity,
  billingEntityOverride,
  vesselId,
  applicationIds,
  batchIds,
  billingPeriodFrom,
  billingPeriodTo,
  poReference,
  onBillingModeChange,
  onApplicationSelectionModeChange,
  onInvoiceTypeChange,
  onCompanyChange,
  onBillingEntityOverrideChange,
  onVesselChange,
  onApplicationIdsChange,
  onBatchIdsChange,
  onBillingPeriodFromChange,
  onBillingPeriodToChange,
  onPoReferenceChange,
}: InvoiceBillingSelectionPanelProps) {
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
        <FormField label="Billing mode">
          <Select
            value={billingMode}
            onChange={v => onBillingModeChange(v as BillingMode)}
            options={(Object.entries(billingModeLabel) as Array<[BillingMode, string]>).map(([value, label]) => ({
              value,
              label,
            }))}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Invoice type">
          <Select
            value={invoiceType}
            onChange={v => onInvoiceTypeChange(v as InvoiceType)}
            options={INVOICE_TYPE_OPTIONS}
            placeholder="Select invoice type"
            size="sm"
            fullWidth
          />
        </FormField>

        {billingMode === 'application_wise' ? (
          <>
            <FormField label="Application selection">
              <Select
                value={applicationSelectionMode}
                onChange={v => onApplicationSelectionModeChange(v as ApplicationSelectionMode)}
                options={APPLICATION_SELECTION_OPTIONS}
                size="sm"
                fullWidth
              />
            </FormField>
            <BillableApplicationsTable
              selectedIds={applicationIds}
              selectedBatchIds={batchIds}
              onSelectionChange={handleTableSelection}
            />
          </>
        ) : (
          <CompanyWiseBillingFields
            companyId={companyId}
            billingEntity={billingEntity}
            billingEntityOverride={billingEntityOverride}
            vesselId={vesselId}
            billingPeriodFrom={billingPeriodFrom}
            billingPeriodTo={billingPeriodTo}
            poReference={poReference}
            onCompanyChange={onCompanyChange}
            onBillingEntityOverrideChange={onBillingEntityOverrideChange}
            onVesselChange={onVesselChange}
            onBillingPeriodFromChange={onBillingPeriodFromChange}
            onBillingPeriodToChange={onBillingPeriodToChange}
            onPoReferenceChange={onPoReferenceChange}
          />
        )}
      </Stack>
    </BaseCard>
  )
}
