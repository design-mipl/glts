import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFieldSpan,
  type AdminFullPageFormSection,
} from '@/pages/admin/components/AdminFullPageFormShell'
import type { QuotationFormData } from '@/shared/types/quotation'
import { computePricingTotals } from '@/shared/utils/quotationCalculations'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../../agreements/config/agreementStatusConfig'
import { QuotationPricingMatrixTable } from './QuotationPricingMatrixTable'
import { QuotationPricingSummary } from './QuotationPricingSummary'

export interface QuotationFormSectionsProps {
  formData: QuotationFormData
  setFormData: Dispatch<SetStateAction<QuotationFormData>>
  errors: Record<string, string>
  readOnlyPricing?: boolean
  addPricingHandlerRef?: MutableRefObject<(() => void) | null>
}

export function buildQuotationFormSections({
  formData,
  setFormData,
  errors,
  readOnlyPricing = false,
  addPricingHandlerRef,
}: QuotationFormSectionsProps): AdminFullPageFormSection[] {
  const patch = (partial: Partial<QuotationFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  const totals = computePricingTotals(formData.pricingMatrix, formData.gstPercentage)

  return [
    {
      id: 'customer-info',
      title: 'Customer Information',
      columns: 2,
      importance: 'primary',
      children: (
        <>
          <FormField label="Workflow type" required>
            <Select
              value={formData.workflowType}
              onChange={(v) => patch({ workflowType: v as QuotationFormData['workflowType'] })}
              options={AGREEMENT_WORKFLOW_OPTIONS}
              fullWidth
            />
          </FormField>
          <FormField label="Company name" required error={Boolean(errors.companyName)} helperText={errors.companyName}>
            <Input
              value={formData.customer.companyName}
              onChange={(v) => patch({ customer: { ...formData.customer, companyName: v } })}
              placeholder="Enter company name"
              fullWidth
            />
          </FormField>
          <FormField label="Contact person" required error={Boolean(errors.contactPersonName)} helperText={errors.contactPersonName}>
            <Input
              value={formData.customer.contactPersonName}
              onChange={(v) => patch({ customer: { ...formData.customer, contactPersonName: v } })}
              placeholder="Enter contact person"
              fullWidth
            />
          </FormField>
          <FormField label="Contact number" error={Boolean(errors.contactNumber)} helperText={errors.contactNumber}>
            <Input
              value={formData.customer.contactNumber}
              onChange={(v) => patch({ customer: { ...formData.customer, contactNumber: v } })}
              placeholder="Enter contact number"
              fullWidth
            />
          </FormField>
          <FormField label="Email address">
            <Input
              value={formData.customer.emailAddress}
              onChange={(v) => patch({ customer: { ...formData.customer, emailAddress: v } })}
              placeholder="Enter email address"
              fullWidth
            />
          </FormField>
          <FormField label="Company address">
            <Input
              value={formData.customer.companyAddress}
              onChange={(v) => patch({ customer: { ...formData.customer, companyAddress: v } })}
              placeholder="Enter company address"
              fullWidth
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'quotation-info',
      title: 'Quotation Information',
      columns: 2,
      importance: 'secondary',
      children: (
        <>
          <FormField label="Quotation date" required error={Boolean(errors.quotationDate)} helperText={errors.quotationDate}>
            <Input type="date" value={formData.quotationDate} onChange={(v) => patch({ quotationDate: v })} fullWidth />
          </FormField>
          <FormField label="Valid till" required error={Boolean(errors.validTill)} helperText={errors.validTill}>
            <Input type="date" value={formData.validTill} onChange={(v) => patch({ validTill: v })} fullWidth />
          </FormField>
          <FormField label="GST percentage">
            <Input
              type="number"
              value={String(formData.gstPercentage)}
              onChange={(v) => patch({ gstPercentage: Number(v) || 0 })}
              fullWidth
            />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField label="Notes">
              <Textarea
                value={formData.notes}
                onChange={(v) => patch({ notes: v })}
                placeholder="Quotation notes"
                rows={3}
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
        </>
      ),
    },
    {
      id: 'pricing',
      title: 'Pricing',
      span: 2,
      columns: 1,
      importance: 'primary',
      headerAction: !readOnlyPricing ? (
        <Button
          label="Add pricing"
          size="sm"
          startIcon={<Plus size={14} />}
          onClick={() => addPricingHandlerRef?.current?.()}
        />
      ) : undefined,
      children: (
        <Stack spacing={2}>
          <QuotationPricingMatrixTable
            workflowType={formData.workflowType}
            pricingMatrix={formData.pricingMatrix}
            onChange={(pricingMatrix) => patch({ pricingMatrix })}
            error={errors.pricingMatrix}
            readOnly={readOnlyPricing}
            setAddPricingHandler={(handler) => {
              if (addPricingHandlerRef) addPricingHandlerRef.current = handler
            }}
          />
          <QuotationPricingSummary totals={totals} gstPercentage={formData.gstPercentage} />
        </Stack>
      ),
    },
  ]
}
