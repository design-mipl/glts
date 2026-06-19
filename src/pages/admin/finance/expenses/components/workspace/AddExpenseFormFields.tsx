import { FormField, Input, MultiSelect, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { ApplicationExpensePassengerSummaryRow } from '@/shared/types/applicationExpenseManagement'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  EXPENSE_BILL_TO_OPTIONS,
  EXPENSE_PAID_BY_OPTIONS,
  EXPENSE_PROOF_TYPE_OPTIONS,
  EXPENSE_SERVICE_OPTIONS,
  EXPENSE_VENDOR_OPTIONS,
} from '../../config/expenseDetailFormConfig'
import type { AddExpenseFormValue } from './addExpenseFormTypes'

type AddExpenseFormSection = 'service' | 'amount' | 'billing'

interface AddExpenseFormFieldsProps {
  form: AddExpenseFormValue
  passengers: ApplicationExpensePassengerSummaryRow[]
  isSinglePassenger: boolean
  isEdit?: boolean
  serviceDisplayName?: string
  totalAmount: number
  onPatch: (partial: Partial<AddExpenseFormValue>) => void
  section: AddExpenseFormSection
}

export function AddExpenseFormFields({
  form,
  passengers,
  isSinglePassenger,
  isEdit = false,
  serviceDisplayName,
  totalAmount,
  onPatch,
  section,
}: AddExpenseFormFieldsProps) {
  if (section === 'service') {
    return (
      <>
        <FormField label="Service" required>
          {isEdit ? (
            <Input
              value={serviceDisplayName ?? '—'}
              disabled
              size="sm"
              fullWidth
            />
          ) : (
            <Select
              value={form.service}
              onChange={v => onPatch({ service: String(v) as AddExpenseFormValue['service'] })}
              options={EXPENSE_SERVICE_OPTIONS.map(option => ({ value: option.value, label: option.label }))}
              size="sm"
              fullWidth
            />
          )}
        </FormField>
        <FormField label="Vendor / provider">
          <Select
            value={form.vendorProvider}
            onChange={v => onPatch({ vendorProvider: String(v) })}
            options={EXPENSE_VENDOR_OPTIONS.map(option => ({ value: option, label: option }))}
            size="sm"
            fullWidth
          />
        </FormField>
        {isSinglePassenger ? (
          <AdminFullPageFormFieldSpan>
            <FormField label="Passenger mapping">
              <Input
                value={passengers[0]?.passengerName ?? 'Applicant'}
                disabled
                size="sm"
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
        ) : (
          <>
            <FormField label="Passenger mapping">
              <Select
                value={form.mappingScope}
                onChange={v =>
                  onPatch({
                    mappingScope: String(v) as AddExpenseFormValue['mappingScope'],
                    passengerId: '',
                    passengerIds: [],
                  })
                }
                options={[
                  { value: 'application', label: 'Entire Application' },
                  { value: 'passenger', label: 'Single Passenger' },
                  { value: 'multiple_passengers', label: 'Multiple Passengers' },
                ]}
                size="sm"
                fullWidth
              />
            </FormField>
            {form.mappingScope === 'passenger' ? (
              <FormField label="Passenger">
                <Select
                  value={form.passengerId}
                  onChange={v => onPatch({ passengerId: String(v) })}
                  options={passengers.map(p => ({ value: p.passengerId, label: p.passengerName }))}
                  placeholder="Select passenger"
                  size="sm"
                  fullWidth
                />
              </FormField>
            ) : null}
            {form.mappingScope === 'multiple_passengers' ? (
              <AdminFullPageFormFieldSpan>
                <FormField label="Passengers">
                  <MultiSelect
                    value={form.passengerIds}
                    onChange={values => onPatch({ passengerIds: values.map(String) })}
                    options={passengers.map(p => ({ value: p.passengerId, label: p.passengerName }))}
                    placeholder="Select passengers"
                    size="sm"
                    fullWidth
                  />
                </FormField>
              </AdminFullPageFormFieldSpan>
            ) : null}
          </>
        )}
      </>
    )
  }

  if (section === 'amount') {
    return (
      <>
        <FormField label="Amount" required>
          <Input
            value={form.amount}
            onChange={v => onPatch({ amount: v })}
            placeholder="Enter amount in INR"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="GST applicable">
          <Select
            value={form.gstApplicable ? 'yes' : 'no'}
            onChange={v =>
              onPatch({
                gstApplicable: v === 'yes',
                gstValue: v === 'yes' ? form.gstValue : '0',
              })
            }
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="GST value">
          <Input
            value={form.gstValue}
            onChange={v => onPatch({ gstValue: v })}
            placeholder="0"
            disabled={!form.gstApplicable}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Total amount">
          <Input value={formatInr(totalAmount)} disabled size="sm" fullWidth />
        </FormField>
      </>
    )
  }

  return (
    <>
      <FormField label="Paid by">
        <Select
          value={form.paidBy}
          onChange={v => onPatch({ paidBy: String(v) as AddExpenseFormValue['paidBy'] })}
          options={EXPENSE_PAID_BY_OPTIONS}
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Bill to">
        <Select
          value={form.billTo}
          onChange={v => onPatch({ billTo: String(v) as AddExpenseFormValue['billTo'] })}
          options={EXPENSE_BILL_TO_OPTIONS}
          size="sm"
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Notes" optional>
          <Textarea
            value={form.notes}
            onChange={v => onPatch({ notes: v })}
            placeholder="Optional notes for finance or operations"
            minRows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <FormField label="Proof document type">
        <Select
          value={form.proofDocumentType}
          onChange={v =>
            onPatch({
              proofDocumentType: String(v) as AddExpenseFormValue['proofDocumentType'],
            })
          }
          options={EXPENSE_PROOF_TYPE_OPTIONS}
          placeholder="Select document type"
          size="sm"
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Proof upload" optional helperText="Attach bill, receipt, invoice, or supporting document.">
          <Input
            value={form.proofFileName}
            onChange={v => onPatch({ proofFileName: v })}
            placeholder="Enter file name (mock upload)"
            size="sm"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
