import { Box, IconButton, Stack, Typography } from '@mui/material'
import { FileText, X } from 'lucide-react'
import { FileUpload, FormField, Input, MultiSelect, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { ApplicationExpensePassengerSummaryRow } from '@/shared/types/applicationExpenseManagement'
import { taxMasterService } from '@/shared/services/taxMasterService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  EXPENSE_PAID_BY_OPTIONS,
  EXPENSE_PROOF_TYPE_OPTIONS,
  EXPENSE_VENDOR_OPTIONS,
} from '../../config/expenseDetailFormConfig'
import type { AgreementExpenseServiceOption } from '../../utils/agreementExpenseServiceUtils'
import type { AddExpenseFormValue } from './addExpenseFormTypes'

type AddExpenseFormSection = 'service' | 'amount' | 'billing'

interface AddExpenseFormFieldsProps {
  form: AddExpenseFormValue
  passengers: ApplicationExpensePassengerSummaryRow[]
  isSinglePassenger: boolean
  isEdit?: boolean
  serviceDisplayName?: string
  agreementServiceOptions: AgreementExpenseServiceOption[]
  agreementLabel?: string
  totalAmount: number
  onPatch: (partial: Partial<AddExpenseFormValue>) => void
  onSelectAgreementService: (serviceId: string) => void
  section: AddExpenseFormSection
}

export function AddExpenseFormFields({
  form,
  passengers,
  isSinglePassenger,
  isEdit = false,
  serviceDisplayName,
  agreementServiceOptions,
  agreementLabel,
  totalAmount,
  onPatch,
  onSelectAgreementService,
  section,
}: AddExpenseFormFieldsProps) {
  if (section === 'service') {
    const serviceOptions = agreementServiceOptions.map(option => ({
      value: option.id,
      label: option.label,
      description: [option.description, option.amount > 0 ? formatInr(option.amount) : undefined]
        .filter(Boolean)
        .join(' · '),
    }))

    return (
      <>
        <AdminFullPageFormFieldSpan>
          <FormField
            label="Service"
            required={!isEdit}
            helperText={
              isEdit
                ? undefined
                : agreementServiceOptions.length > 0
                  ? agreementLabel
                    ? `Pick a service (or add-on) from agreement ${agreementLabel} to add as an expense`
                    : 'Pick a service or add-on from the client commercial agreement'
                  : 'No active agreement services found for this client. Activate an agreement or add pricing / add-on services.'
            }
          >
            {isEdit ? (
              <Input value={serviceDisplayName ?? '—'} disabled size="sm" fullWidth />
            ) : (
              <Select
                value={form.agreementServiceId}
                onChange={v => onSelectAgreementService(String(v))}
                options={serviceOptions}
                placeholder={
                  agreementServiceOptions.length > 0
                    ? 'Select service or add-on to add'
                    : 'No agreement services available'
                }
                disabled={agreementServiceOptions.length === 0}
                size="sm"
                fullWidth
              />
            )}
          </FormField>
        </AdminFullPageFormFieldSpan>
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
            onChange={v => {
              const applicable = v === 'yes'
              const defaultRateId =
                form.gstRateId || String(taxMasterService.listActiveGstOptions()[0]?.value ?? 'gst-18')
              onPatch({
                gstApplicable: applicable,
                gstRateId: applicable ? defaultRateId : '',
              })
            }}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="GST rate" helperText={form.gstApplicable ? 'From GST master' : undefined}>
          <Select
            value={form.gstRateId}
            onChange={v => onPatch({ gstRateId: String(v) })}
            options={taxMasterService.listActiveGstOptions()}
            placeholder="Select GST %"
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
      <FormField label="Bill to" helperText="Most expenses are billed to the client.">
        <Input value="Client" disabled size="sm" fullWidth />
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
        <FormField
          label="Proof upload"
          optional
          helperText="Attach bill, receipt, invoice, or supporting document (PDF, JPG, or PNG)."
        >
          <Stack spacing={1}>
            <FileUpload
              key={`expense-proof-${form.proofFileName || 'empty'}`}
              compact
              dropzoneTitle="Choose a file or drag & drop it here"
              dropzoneCaption="PDF, JPG, or PNG · max 10 MB"
              browseLabel="Browse files"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              maxFiles={1}
              onUpload={files => {
                onPatch({ proofFileName: files[0]?.name ?? '' })
              }}
            />
            {form.proofFileName.trim() ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  px: 1,
                  py: 0.75,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                  <FileText size={16} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, fontSize: 12, minWidth: 0 }}
                  noWrap
                  title={form.proofFileName}
                >
                  {form.proofFileName}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={`Remove ${form.proofFileName}`}
                  onClick={() => onPatch({ proofFileName: '' })}
                >
                  <X size={14} />
                </IconButton>
              </Stack>
            ) : null}
          </Stack>
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
