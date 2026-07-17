import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Plus, Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  DatePicker,
  FormField,
  Input,
  MultiSelect,
  Select,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { ApplicationTrackingUrlLink } from '@/shared/components/ApplicationTrackingUrlLink'
import {
  resolveApplicationTrackingUrl,
  resolveOfferingVfsServiceRates,
} from '@/shared/services/countryMasterService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type {
  FormAssistPaymentEntry,
  FormAssistPaymentMode,
  FormAssistReceiptStatus,
  FormAssistSubmissionDraft,
  FormAssistVfsServiceChargeLine,
} from '@/shared/services/applicationFormAssistService'
import {
  listCardSelectOptions,
  resolveCardLabel,
} from '@/shared/utils/cardMasterOptions'
import { mapCountryVfsRatesToChargeLines } from '@/shared/utils/countryVfsServiceRateUtils'
import {
  PAYMENT_MODE_OPTIONS,
  RECEIPT_STATUS_OPTIONS,
} from '../../config/submissionPaymentConfig'
import {
  createEmptyPaymentEntryDraft,
  formatPaymentAmountInr,
  getRemainingVfsServices,
  resolvePaymentEntryServices,
  sumServiceAmounts,
  syncLegacyPaymentFieldsFromEntries,
  validatePaymentEntryDraft,
} from '../../utils/pendingPaymentUtils'
import { ViewFormVfsChargesServicesSection } from './ViewFormVfsChargesServicesSection'

function parseDateString(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.toDate() : null
}

function formatDateForStorage(date: Date | null): string {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

function labelForOption(options: Array<{ value: string; label: string }>, value: string): string {
  return options.find(opt => opt.value === value)?.label ?? value
}

function FileUploadRow({
  label,
  fileName,
  required = false,
  onPick,
}: {
  label: string
  fileName: string
  required?: boolean
  onPick: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      spacing={1}
      sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={0.25}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {label}
          {required ? (
            <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
              *
            </Typography>
          ) : null}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fileName || 'No file selected'}
        </Typography>
      </Stack>
      <Button
        label="Upload"
        variant="outlined"
        size="sm"
        startIcon={<Upload size={14} />}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
    </Stack>
  )
}

export interface PendingPaymentSubmissionSectionProps {
  submission: FormAssistSubmissionDraft
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  readOnly?: boolean
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
}

export function PendingPaymentSubmissionSection({
  submission,
  country,
  visaType,
  countryId,
  visaOfferingId,
  readOnly = false,
  onChange,
}: PendingPaymentSubmissionSectionProps) {
  const { showToast } = useToast()
  const [addingPayment, setAddingPayment] = useState(false)
  const [draft, setDraft] = useState(() => createEmptyPaymentEntryDraft())

  const applicationTrackingUrl = resolveApplicationTrackingUrl({ countryName: country })
  const cardTypeOptions = useMemo(
    () => [{ value: '', label: 'Select card' }, ...listCardSelectOptions()],
    [],
  )

  const userOptions = useMemo(
    () =>
      adminPortalUserService
        .list({ status: 'active' })
        .map(user => ({ value: user.id, label: `${user.fullName} · ${user.email}` })),
    [],
  )

  const remainingServices = useMemo(
    () => getRemainingVfsServices(submission.vfsServiceCharges ?? [], submission.paymentEntries ?? []),
    [submission.vfsServiceCharges, submission.paymentEntries],
  )

  const remainingServiceIds = useMemo(
    () => new Set(remainingServices.map(line => line.id)),
    [remainingServices],
  )

  const serviceOptions = useMemo(
    () =>
      remainingServices.map(line => ({
        value: line.id,
        label: `${line.serviceName} · ${formatPaymentAmountInr(line.amount)}`,
      })),
    [remainingServices],
  )

  useEffect(() => {
    if (readOnly) return
    if (!countryId || !visaOfferingId) return
    if ((submission.vfsServiceCharges ?? []).length > 0) return
    const configuredRates = resolveOfferingVfsServiceRates(countryId, visaOfferingId)
    if (configuredRates.length === 0) return
    onChange({ vfsServiceCharges: mapCountryVfsRatesToChargeLines(configuredRates) })
  }, [readOnly, countryId, onChange, submission.vfsServiceCharges, visaOfferingId])

  useEffect(() => {
    if (draft.serviceIds.length === 0) return
    const total = sumServiceAmounts(submission.vfsServiceCharges ?? [], draft.serviceIds)
    const nextAmount = total > 0 ? String(total) : draft.amountPaid
    if (nextAmount === draft.amountPaid) return
    setDraft(prev => ({ ...prev, amountPaid: nextAmount }))
  }, [draft.serviceIds, draft.amountPaid, submission.vfsServiceCharges])

  const patchDraft = (patch: Partial<typeof draft>) => {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  const resetDraft = () => {
    setDraft(createEmptyPaymentEntryDraft())
    setAddingPayment(false)
  }

  const commitPaymentEntries = (paymentEntries: FormAssistPaymentEntry[]) => {
    onChange({
      paymentEntries,
      ...syncLegacyPaymentFieldsFromEntries({ ...submission, paymentEntries }),
    })
  }

  const handleSavePayment = () => {
    const errors = validatePaymentEntryDraft({
      paidByUserId: draft.paidByUserId,
      serviceIds: draft.serviceIds,
      paymentDate: draft.paymentDate,
      paymentMode: draft.paymentMode,
      paymentCardId: draft.paymentCardId,
      paymentReferenceNumber: draft.paymentReferenceNumber,
      amountPaid: draft.amountPaid,
      paymentReceiptFileName: draft.paymentReceiptFileName,
      remainingServiceIds,
    })
    if (errors.length > 0) {
      showToast({
        title: 'Cannot save payment',
        description: errors.join(' · '),
        variant: 'error',
      })
      return
    }

    const user = adminPortalUserService.getById(draft.paidByUserId)
    const entry: FormAssistPaymentEntry = {
      id: `payment-entry-${Date.now()}`,
      paidByUserId: draft.paidByUserId,
      paidByUserName: user?.fullName ?? draft.paidByUserName,
      serviceIds: [...draft.serviceIds],
      paymentDate: draft.paymentDate,
      paymentMode: draft.paymentMode,
      paymentCardId: draft.paymentMode === 'card' ? draft.paymentCardId : '',
      paymentReferenceNumber: draft.paymentReferenceNumber,
      amountPaid: draft.amountPaid,
      receiptStatus: draft.receiptStatus,
      paymentRemarks: draft.paymentRemarks,
      paymentReceiptFileName: draft.paymentReceiptFileName,
      createdAt: new Date().toISOString(),
      createdByUserId: draft.paidByUserId,
    }

    commitPaymentEntries([...(submission.paymentEntries ?? []), entry])
    showToast({
      title: 'Payment recorded',
      description: `${entry.paidByUserName} · ${formatPaymentAmountInr(entry.amountPaid)}`,
      variant: 'success',
    })
    resetDraft()
  }

  const showCardType = draft.paymentMode === 'card'

  return (
    <Stack spacing={2}>
      <AdminOverlayFormSection title="Submission details" columns={2}>
        {applicationTrackingUrl ? (
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={1}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              <Stack spacing={0.25}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                  Application Tracking URL
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Embassy / VFS portal for {country || 'this country'}
                </Typography>
              </Stack>
              <ApplicationTrackingUrlLink countryName={country} label="Open tracking portal" />
            </Stack>
          </Box>
        ) : null}
        {readOnly ? (
          <>
            <ReadOnlyValueRow label="Online Submitted By" value={submission.submittedBy} />
            <ReadOnlyValueRow
              label="VFS Submission Date"
              value={formatDisplayDate(submission.vfsSubmissionDate)}
            />
            <ReadOnlyValueRow
              label="Tentative Collection Date"
              value={formatDisplayDate(submission.tentativeCollectionDate)}
            />
          </>
        ) : (
          <>
            <FormField label="Online Submitted By" required>
              <Input
                value={submission.submittedBy}
                onChange={v => onChange({ submittedBy: String(v) })}
                placeholder="Enter officer or team name"
                size="sm"
                fullWidth
              />
            </FormField>
            <FormField label="VFS Submission Date">
              <DatePicker
                value={parseDateString(submission.vfsSubmissionDate)}
                onChange={date => onChange({ vfsSubmissionDate: formatDateForStorage(date) })}
                placeholder="Select VFS submission date"
                size="sm"
                fullWidth
              />
            </FormField>
            <FormField label="Tentative Collection Date" required>
              <DatePicker
                value={parseDateString(submission.tentativeCollectionDate)}
                onChange={date =>
                  onChange({ tentativeCollectionDate: formatDateForStorage(date) })
                }
                placeholder="Select tentative collection date"
                size="sm"
                fullWidth
              />
            </FormField>
          </>
        )}
      </AdminOverlayFormSection>

      <ViewFormVfsChargesServicesSection
        country={country}
        visaType={visaType}
        countryId={countryId}
        visaOfferingId={visaOfferingId}
        serviceCharges={submission.vfsServiceCharges ?? []}
        onChange={vfsServiceCharges => onChange({ vfsServiceCharges })}
        readOnly={readOnly}
      />

      <AdminOverlayFormSection
        title="Payment entries"
        columns={1}
        importance="secondary"
        headerAction={
          readOnly || addingPayment || remainingServices.length === 0 ? undefined : (
            <Button
              label="Record payment"
              size="sm"
              startIcon={<Plus size={14} />}
              onClick={() => setAddingPayment(true)}
            />
          )
        }
      >
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {(submission.paymentEntries ?? []).length === 0 && !addingPayment ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, py: 1 }}>
              No payments recorded yet. Record a payment and select unpaid VFS services.
            </Typography>
          ) : null}

          {(submission.paymentEntries ?? []).map((entry, index) => (
            <PaymentEntryCard
              key={entry.id}
              index={index + 1}
              entry={entry}
              services={resolvePaymentEntryServices(submission.vfsServiceCharges ?? [], entry)}
            />
          ))}

          {!readOnly && remainingServices.length === 0 && (submission.vfsServiceCharges ?? []).length > 0 ? (
            <Typography variant="caption" color="success.main" sx={{ fontSize: 12 }}>
              All catalog services have been paid.
            </Typography>
          ) : null}

          {addingPayment && !readOnly ? (
            <Stack
              spacing={2}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 13 }}>
                New payment
              </Typography>
              <Divider />

              <FormField label="VFS Charges & Services" required>
                <MultiSelect
                  value={draft.serviceIds}
                  onChange={values =>
                    patchDraft({
                      serviceIds: values.map(String).filter(id => remainingServiceIds.has(id)),
                    })
                  }
                  options={serviceOptions}
                  placeholder="Select unpaid services"
                  size="sm"
                  fullWidth
                  clearable
                />
              </FormField>

              <AdminOverlayFormSection title="Payment details" columns={2} importance="secondary">
                <FormField label="Payment done by" required>
                  <Select
                    value={draft.paidByUserId}
                    onChange={v => {
                      const paidByUserId = String(v)
                      const user = adminPortalUserService.getById(paidByUserId)
                      patchDraft({
                        paidByUserId,
                        paidByUserName: user?.fullName ?? '',
                      })
                    }}
                    options={userOptions}
                    placeholder="Select user"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <FormField label="Payment date" required>
                  <DatePicker
                    value={parseDateString(draft.paymentDate)}
                    onChange={date => patchDraft({ paymentDate: formatDateForStorage(date) })}
                    placeholder="Select payment date"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <FormField label="Payment mode" required>
                  <Select
                    value={draft.paymentMode}
                    onChange={v => {
                      const paymentMode = String(v) as FormAssistPaymentMode
                      patchDraft({
                        paymentMode,
                        ...(paymentMode !== 'card' ? { paymentCardId: '' } : {}),
                      })
                    }}
                    options={PAYMENT_MODE_OPTIONS}
                    placeholder="Select payment mode"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                {showCardType ? (
                  <FormField label="Payment card" required>
                    <Select
                      value={draft.paymentCardId}
                      onChange={v => patchDraft({ paymentCardId: String(v) })}
                      options={cardTypeOptions}
                      placeholder="Select card from card master"
                      size="sm"
                      fullWidth
                      clearable
                    />
                  </FormField>
                ) : null}
                <FormField label="Payment Reference / CC Avenue Ref. No." required>
                  <Input
                    value={draft.paymentReferenceNumber}
                    onChange={v => patchDraft({ paymentReferenceNumber: String(v) })}
                    placeholder="e.g. TXN-2026-88421"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <FormField label="Amount paid" required>
                  <Input
                    type="number"
                    value={draft.amountPaid}
                    onChange={v => patchDraft({ amountPaid: String(v) })}
                    size="sm"
                    fullWidth
                    placeholder="0.00"
                  />
                </FormField>
                <FormField label="Receipt status" required>
                  <Select
                    value={draft.receiptStatus}
                    onChange={v =>
                      patchDraft({ receiptStatus: String(v) as FormAssistReceiptStatus })
                    }
                    options={RECEIPT_STATUS_OPTIONS}
                    placeholder="Select receipt status"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <FormField label="Payment remarks">
                    <Textarea
                      value={draft.paymentRemarks}
                      onChange={v => patchDraft({ paymentRemarks: String(v) })}
                      rows={2}
                      fullWidth
                      placeholder="Optional notes about payment or receipt"
                    />
                  </FormField>
                </Box>
              </AdminOverlayFormSection>

              <AdminOverlayFormSection title="Document uploads" columns={1} importance="secondary">
                <FileUploadRow
                  label="Payment Receipt"
                  fileName={draft.paymentReceiptFileName}
                  required
                  onPick={file => patchDraft({ paymentReceiptFileName: file.name })}
                />
              </AdminOverlayFormSection>

              <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                <Button variant="outlined" onClick={resetDraft}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSavePayment}>
                  Save payment
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </AdminOverlayFormSection>
    </Stack>
  )
}

function ReadOnlyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      spacing={0.75}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, wordBreak: 'break-word' }}>
        {value?.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

function PaymentEntryCard({
  index,
  entry,
  services,
}: {
  index: number
  entry: FormAssistPaymentEntry
  services: FormAssistVfsServiceChargeLine[]
}) {
  const showCard = entry.paymentMode === 'card'
  return (
    <Stack
      spacing={1.25}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
      >
        <Stack spacing={0.35}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            Payment {index} · {entry.paidByUserName || 'Unknown user'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDisplayDate(entry.paymentDate)} ·{' '}
            {labelForOption(PAYMENT_MODE_OPTIONS, entry.paymentMode)} ·{' '}
            {formatPaymentAmountInr(entry.amountPaid)}
          </Typography>
        </Stack>
        <Badge
          label={labelForOption(RECEIPT_STATUS_OPTIONS, entry.receiptStatus)}
          color={entry.receiptStatus === 'received' ? 'success' : 'neutral'}
          size="sm"
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Services
        </Typography>
        {services.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            —
          </Typography>
        ) : (
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {services.map(service => (
              <Badge
                key={service.id}
                label={`${service.serviceName} · ${formatPaymentAmountInr(service.amount)}`}
                color="info"
                size="sm"
              />
            ))}
          </Stack>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
        <Typography variant="caption" color="text.secondary">
          Ref: {entry.paymentReferenceNumber || '—'}
        </Typography>
        {showCard ? (
          <Typography variant="caption" color="text.secondary">
            Card: {resolveCardLabel(entry.paymentCardId) || '—'}
          </Typography>
        ) : null}
        <Typography variant="caption" color="text.secondary">
          Receipt: {entry.paymentReceiptFileName || '—'}
        </Typography>
      </Stack>
      {entry.paymentRemarks?.trim() ? (
        <Typography variant="caption" color="text.secondary">
          Remarks: {entry.paymentRemarks}
        </Typography>
      ) : null}
    </Stack>
  )
}
