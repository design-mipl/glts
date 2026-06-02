import { Stack } from '@mui/material'
import { BaseCard, Checkbox, FormField, Input, Select } from '@/design-system/UIComponents'
import type { BillingMode, InvoiceType } from '@/shared/types/invoice'
import {
  getApplicationOptions,
  getBatchOptions,
  getCompanyOptions,
  getVesselOptions,
  SERVICE_TYPE_OPTIONS,
} from '@/shared/utils/invoiceBillingEngine'
import { billingModeLabel, INVOICE_TYPE_OPTIONS } from '../../config/invoiceStatusConfig'

interface InvoiceBillingSelectionPanelProps {
  billingMode: BillingMode
  invoiceType: InvoiceType
  companyId: string
  billingEntity: string
  billingEntityOverride: string
  vesselId: string
  applicationIds: string[]
  batchIds: string[]
  serviceTypes: string[]
  billableOnly: boolean
  onBillingModeChange: (mode: BillingMode) => void
  onInvoiceTypeChange: (type: InvoiceType) => void
  onCompanyChange: (companyId: string, companyName: string, billingEntity: string) => void
  onBillingEntityOverrideChange: (value: string) => void
  onVesselChange: (vesselId: string, vesselName: string) => void
  onApplicationIdsChange: (ids: string[]) => void
  onBatchIdsChange: (ids: string[]) => void
  onServiceTypesChange: (types: string[]) => void
  onBillableOnlyChange: (value: boolean) => void
}

export function InvoiceBillingSelectionPanel({
  billingMode,
  invoiceType,
  companyId,
  billingEntity,
  billingEntityOverride,
  vesselId,
  applicationIds,
  batchIds,
  serviceTypes,
  billableOnly,
  onBillingModeChange,
  onInvoiceTypeChange,
  onCompanyChange,
  onBillingEntityOverrideChange,
  onVesselChange,
  onApplicationIdsChange,
  onBatchIdsChange,
  onServiceTypesChange,
  onBillableOnlyChange,
}: InvoiceBillingSelectionPanelProps) {
  const companyOptions = getCompanyOptions()
  const vesselOptions = getVesselOptions()
  const appOptions = getApplicationOptions(billableOnly)
  const batchOptions = getBatchOptions(billableOnly)

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
        <FormField label="Company">
          <Select
            value={companyId}
            onChange={v => {
              const opt = companyOptions.find(c => c.value === v)
              if (opt) onCompanyChange(opt.value, opt.label, opt.billingEntity)
            }}
            options={companyOptions.map(c => ({ value: c.value, label: c.label }))}
            placeholder="Select company"
            size="sm"
            clearable
            fullWidth
          />
        </FormField>
        <FormField label="Billing entity">
          <Input value={billingEntityOverride || billingEntity} onChange={onBillingEntityOverrideChange} size="sm" fullWidth />
        </FormField>
        <FormField label="Vessel">
          <Select
            value={vesselId}
            onChange={v => {
              const opt = vesselOptions.find(o => o.value === v)
              if (opt) onVesselChange(opt.value, opt.label)
            }}
            options={vesselOptions}
            placeholder="Select vessel"
            size="sm"
            clearable
            fullWidth
          />
        </FormField>
        <FormField label="Invoice type">
          <Select
            value={invoiceType}
            onChange={v => onInvoiceTypeChange(v as InvoiceType)}
            options={INVOICE_TYPE_OPTIONS.filter(o => o.value !== 'credit_note')}
            size="sm"
            fullWidth
          />
        </FormField>
        <Checkbox checked={billableOnly} onChange={onBillableOnlyChange} label="Billable applications only (Appointment Booked)" />
        {(billingMode === 'single' || billingMode === 'cumulative' || billingMode === 'service_wise') && (
          <FormField label="Applications">
            <Select
              value={applicationIds[0] ?? ''}
              onChange={v => {
                const id = String(v)
                if (billingMode === 'cumulative') {
                  onApplicationIdsChange(applicationIds.includes(id) ? applicationIds.filter(x => x !== id) : [...applicationIds, id])
                } else {
                  onApplicationIdsChange(id ? [id] : [])
                }
              }}
              options={appOptions}
              placeholder="Select application"
              size="sm"
              clearable
              fullWidth
            />
          </FormField>
        )}
        {billingMode === 'cumulative' && applicationIds.length > 0 ? (
          <FormField label="Selected applications">
            <Input value={applicationIds.join(', ')} onChange={() => {}} size="sm" fullWidth disabled />
          </FormField>
        ) : null}
        {(billingMode === 'batch' || billingMode === 'cumulative') && (
          <FormField label="Batch">
            <Select
              value={batchIds[0] ?? ''}
              onChange={v => onBatchIdsChange(v ? [String(v)] : [])}
              options={batchOptions}
              placeholder="Select batch"
              size="sm"
              clearable
              fullWidth
            />
          </FormField>
        )}
        {(billingMode === 'service_wise' || invoiceType === 'additional_expense') && (
          <FormField label="Service types">
            <Select
              value={serviceTypes[0] ?? ''}
              onChange={v => onServiceTypesChange(v ? [String(v)] : [])}
              options={SERVICE_TYPE_OPTIONS.map(s => ({ value: s, label: s }))}
              placeholder="Select service"
              size="sm"
              clearable
              fullWidth
            />
          </FormField>
        )}
      </Stack>
    </BaseCard>
  )
}
