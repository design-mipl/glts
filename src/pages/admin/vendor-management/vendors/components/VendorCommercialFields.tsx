import { FormField, Input, Select, Toggle } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'
import { PAYMENT_TERMS_OPTIONS, SETTLEMENT_TYPE_OPTIONS } from '../config/paymentTermsConfig'

interface VendorCommercialFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorCommercialFields({ data, onChange }: VendorCommercialFieldsProps) {
  const patchCommercial = (partial: Partial<VendorFormData['commercial']>) =>
    onChange({ ...data, commercial: { ...data.commercial, ...partial } })

  return (
    <>
      <FormField label="Payment terms" required>
        <Select
          size="sm"
          value={data.commercial.paymentTerms}
          onChange={v =>
            patchCommercial({ paymentTerms: v as VendorFormData['commercial']['paymentTerms'] })
          }
          options={PAYMENT_TERMS_OPTIONS}
          placeholder="Select payment terms"
          fullWidth
        />
      </FormField>
      <FormField label="Settlement type" required>
        <Select
          size="sm"
          value={data.commercial.settlementType}
          onChange={v =>
            patchCommercial({ settlementType: v as VendorFormData['commercial']['settlementType'] })
          }
          options={SETTLEMENT_TYPE_OPTIONS}
          placeholder="Select settlement type"
          fullWidth
        />
      </FormField>
      <FormField label="Credit allowed">
        <Toggle
          checked={data.commercial.creditAllowed}
          onChange={checked =>
            patchCommercial({
              creditAllowed: checked,
              creditLimit: checked ? data.commercial.creditLimit : null,
            })
          }
          label={data.commercial.creditAllowed ? 'Yes' : 'No'}
        />
      </FormField>
      {data.commercial.creditAllowed ? (
        <FormField label="Credit limit" required>
          <Input
            size="sm"
            type="number"
            value={data.commercial.creditLimit != null ? String(data.commercial.creditLimit) : ''}
            onChange={v => patchCommercial({ creditLimit: v ? Number(v) : null })}
            placeholder="Enter credit limit"
            fullWidth
          />
        </FormField>
      ) : null}
      <FormField label="Advance required">
        <Toggle
          checked={data.commercial.advanceRequired}
          onChange={checked =>
            patchCommercial({
              advanceRequired: checked,
              advanceAmount: checked ? data.commercial.advanceAmount : null,
              advancePercentage: checked ? data.commercial.advancePercentage : null,
            })
          }
          label={data.commercial.advanceRequired ? 'Yes' : 'No'}
        />
      </FormField>
      {data.commercial.advanceRequired ? (
        <>
          <FormField label="Advance amount">
            <Input
              size="sm"
              type="number"
              value={data.commercial.advanceAmount != null ? String(data.commercial.advanceAmount) : ''}
              onChange={v => patchCommercial({ advanceAmount: v ? Number(v) : null })}
              placeholder="Fixed advance amount"
              fullWidth
            />
          </FormField>
          <FormField label="Advance percentage">
            <Input
              size="sm"
              type="number"
              value={
                data.commercial.advancePercentage != null
                  ? String(data.commercial.advancePercentage)
                  : ''
              }
              onChange={v => patchCommercial({ advancePercentage: v ? Number(v) : null })}
              placeholder="Percentage (0–100)"
              fullWidth
            />
          </FormField>
        </>
      ) : null}
      <FormField label="TDS applicable">
        <Toggle
          checked={data.commercial.tdsApplicable}
          onChange={checked =>
            patchCommercial({
              tdsApplicable: checked,
              tdsPercentage: checked ? data.commercial.tdsPercentage : null,
            })
          }
          label={data.commercial.tdsApplicable ? 'Yes' : 'No'}
        />
      </FormField>
      {data.commercial.tdsApplicable ? (
        <FormField label="TDS percentage" required>
          <Input
            size="sm"
            type="number"
            value={data.commercial.tdsPercentage != null ? String(data.commercial.tdsPercentage) : ''}
            onChange={v => patchCommercial({ tdsPercentage: v ? Number(v) : null })}
            placeholder="e.g. 2"
            fullWidth
          />
        </FormField>
      ) : null}
    </>
  )
}
