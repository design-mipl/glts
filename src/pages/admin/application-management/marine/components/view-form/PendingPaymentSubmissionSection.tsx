import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Plus, Upload, Pencil } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  DatePicker,
  FormField,
  Input,
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
  getAvailableServicesForPaymentDraft,
  getRemainingVfsServices,
  paymentEntryToDraft,
  resolvePaymentEntryServices,
  sumServiceAmounts,
  syncLegacyPaymentFieldsFromEntries,
  validatePaymentEntryDraft,
} from '../../utils/pendingPaymentUtils'
import { PaymentEntryServicesSection } from './PaymentEntryServicesSection'

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
  countryId,
  visaOfferingId,
  readOnly = false,
  onChange,
}: PendingPaymentSubmissionSectionProps) {
  const { showToast } = useToast()
  const [addingPayment, setAddingPayment] = useState(false)
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
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

  const draftAvailableServices = useMemo(
    () =>
      getAvailableServicesForPaymentDraft(
        submission.vfsServiceCharges ?? [],
        submission.paymentEntries ?? [],
        editingPaymentId ?? undefined,
      ),
    [editingPaymentId, submission.paymentEntries, submission.vfsServiceCharges],
  )

  const allowedServiceIds = useMemo(
    () => new Set(draftAvailableServices.map(line => line.id)),
    [draftAvailableServices],
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
    setEditingPaymentId(null)
  }

  const startAddPayment = () => {
    setDraft(createEmptyPaymentEntryDraft())
    setEditingPaymentId(null)
    setAddingPayment(true)
  }

  const startEditPayment = (entry: FormAssistPaymentEntry) => {
    setDraft(paymentEntryToDraft(entry))
    setAddingPayment(false)
    setEditingPaymentId(entry.id)
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
      allowedServiceIds,
    })
    if (errors.length > 0) {
      showToast({
        title: editingPaymentId ? 'Cannot update payment' : 'Cannot save payment',
        description: errors.join(' · '),
        variant: 'error',
      })
      return
    }

    const user = adminPortalUserService.getById(draft.paidByUserId)
    const paymentEntries = submission.paymentEntries ?? []

    if (editingPaymentId) {
      const existing = paymentEntries.find(entry => entry.id === editingPaymentId)
      if (!existing) {
        resetDraft()
        return
      }

      const updated: FormAssistPaymentEntry = {
        ...existing,
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
      }

      commitPaymentEntries(paymentEntries.map(entry => (entry.id === editingPaymentId ? updated : entry)))
      showToast({
        title: 'Payment updated',
        description: `${updated.paidByUserName} · ${formatPaymentAmountInr(updated.amountPaid)}`,
        variant: 'success',
      })
      resetDraft()
      return
    }

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
  const isPaymentFormOpen = addingPayment || editingPaymentId !== null

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
            <ReadOnlyValueRow
              label="Physical Submission Date"
              value={formatDisplayDate(submission.vfsSubmissionDate)}
            />
            <ReadOnlyValueRow
              label="Tentative Collection Date"
              value={formatDisplayDate(submission.tentativeCollectionDate)}
            />
          </>
        ) : (
          <>
            <FormField label="Physical Submission Date">
              <DatePicker
                value={parseDateString(submission.vfsSubmissionDate)}
                onChange={date => onChange({ vfsSubmissionDate: formatDateForStorage(date) })}
                placeholder="Select physical submission date"
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

      <AdminOverlayFormSection
        title="Payment entries"
        columns={1}
        importance="secondary"
        headerAction={
          readOnly || isPaymentFormOpen || remainingServices.length === 0 ? undefined : (
            <Button
              label="Record payment"
              size="sm"
              startIcon={<Plus size={14} />}
              onClick={startAddPayment}
            />
          )
        }
      >
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {(submission.paymentEntries ?? []).length === 0 && !isPaymentFormOpen ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, py: 1 }}>
              No payments recorded yet. Record a payment and select unpaid VFS services.
            </Typography>
          ) : null}

          {(submission.paymentEntries ?? []).map((entry, index) =>
            editingPaymentId === entry.id && !readOnly ? (
              <PaymentEntryEditor
                key={entry.id}
                title={`Edit payment ${index + 1}`}
                draft={draft}
                catalog={submission.vfsServiceCharges ?? []}
                availableServices={draftAvailableServices}
                allowedServiceIds={allowedServiceIds}
                userOptions={userOptions}
                cardTypeOptions={cardTypeOptions}
                showCardType={showCardType}
                onPatch={patchDraft}
                onCancel={resetDraft}
                onSave={handleSavePayment}
                saveLabel="Update payment"
              />
            ) : (
              <PaymentEntryCard
                key={entry.id}
                index={index + 1}
                entry={entry}
                services={resolvePaymentEntryServices(submission.vfsServiceCharges ?? [], entry)}
                onEdit={readOnly || isPaymentFormOpen ? undefined : () => startEditPayment(entry)}
              />
            ),
          )}

          {!readOnly && remainingServices.length === 0 && (submission.vfsServiceCharges ?? []).length > 0 && !isPaymentFormOpen ? (
            <Typography variant="caption" color="success.main" sx={{ fontSize: 12 }}>
              All VFS services have been paid.
            </Typography>
          ) : null}

          {addingPayment && !readOnly ? (
            <PaymentEntryEditor
              title="New payment"
              draft={draft}
              catalog={submission.vfsServiceCharges ?? []}
              availableServices={draftAvailableServices}
              allowedServiceIds={allowedServiceIds}
              userOptions={userOptions}
              cardTypeOptions={cardTypeOptions}
              showCardType={showCardType}
              onPatch={patchDraft}
              onCancel={resetDraft}
              onSave={handleSavePayment}
              saveLabel="Save payment"
            />
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

function PaymentEntryEditor({
  title,
  draft,
  catalog,
  availableServices,
  allowedServiceIds,
  userOptions,
  cardTypeOptions,
  showCardType,
  onPatch,
  onCancel,
  onSave,
  saveLabel,
}: {
  title: string
  draft: ReturnType<typeof createEmptyPaymentEntryDraft>
  catalog: FormAssistVfsServiceChargeLine[]
  availableServices: FormAssistVfsServiceChargeLine[]
  allowedServiceIds: Set<string>
  userOptions: Array<{ value: string; label: string }>
  cardTypeOptions: Array<{ value: string; label: string }>
  showCardType: boolean
  onPatch: (patch: Partial<ReturnType<typeof createEmptyPaymentEntryDraft>>) => void
  onCancel: () => void
  onSave: () => void
  saveLabel: string
}) {
  return (
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
        {title}
      </Typography>
      <Divider />

      <PaymentEntryServicesSection
        catalog={catalog}
        selectedServiceIds={draft.serviceIds}
        availableServices={availableServices}
        onChange={serviceIds =>
          onPatch({
            serviceIds: serviceIds.filter(id => allowedServiceIds.has(id)),
          })
        }
      />

      <AdminOverlayFormSection title="Payment details" columns={2} importance="secondary">
        <FormField label="Payment done by" required>
          <Select
            value={draft.paidByUserId}
            onChange={v => {
              const paidByUserId = String(v)
              const user = adminPortalUserService.getById(paidByUserId)
              onPatch({
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
            onChange={date => onPatch({ paymentDate: formatDateForStorage(date) })}
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
              onPatch({
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
              onChange={v => onPatch({ paymentCardId: String(v) })}
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
            onChange={v => onPatch({ paymentReferenceNumber: String(v) })}
            placeholder="e.g. TXN-2026-88421"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Amount paid" required>
          <Input
            type="number"
            value={draft.amountPaid}
            onChange={v => onPatch({ amountPaid: String(v) })}
            size="sm"
            fullWidth
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Receipt status" required>
          <Select
            value={draft.receiptStatus}
            onChange={v => onPatch({ receiptStatus: String(v) as FormAssistReceiptStatus })}
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
              onChange={v => onPatch({ paymentRemarks: String(v) })}
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
          onPick={file => onPatch({ paymentReceiptFileName: file.name })}
        />
      </AdminOverlayFormSection>

      <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave}>
          {saveLabel}
        </Button>
      </Stack>
    </Stack>
  )
}

export function PaymentEntryCard({
  index,
  entry,
  services,
  onEdit,
}: {
  index: number
  entry: FormAssistPaymentEntry
  services: FormAssistVfsServiceChargeLine[]
  onEdit?: () => void
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
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Badge
            label={labelForOption(RECEIPT_STATUS_OPTIONS, entry.receiptStatus)}
            color={entry.receiptStatus === 'received' ? 'success' : 'neutral'}
            size="sm"
          />
          {onEdit ? (
            <Button
              label="Edit"
              size="sm"
              variant="outlined"
              startIcon={<Pencil size={14} />}
              onClick={onEdit}
            />
          ) : null}
        </Stack>
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
