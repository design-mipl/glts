import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Upload } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button, DatePicker, FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { ApplicationTrackingUrlLink } from '@/shared/components/ApplicationTrackingUrlLink'
import { resolveApplicationTrackingUrl, resolveOfferingVfsServiceRates } from '@/shared/services/countryMasterService'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import { mapCountryVfsRatesToChargeLines } from '@/shared/utils/countryVfsServiceRateUtils'
import {
  CARD_NAME_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  RECEIPT_STATUS_OPTIONS,
} from '../../config/submissionPaymentConfig'
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

interface ViewFormSubmissionSectionProps {
  submission: FormAssistSubmissionDraft
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  readOnly?: boolean
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
  onPickFile: (field: keyof FormAssistSubmissionDraft, file: File) => void
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

function labelForOption(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
): string {
  return options.find(option => option.value === value)?.label ?? (value?.trim() ? value : '—')
}

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

export function ViewFormSubmissionSection({
  submission,
  country,
  visaType,
  countryId,
  visaOfferingId,
  readOnly = false,
  onChange,
  onPickFile,
}: ViewFormSubmissionSectionProps) {
  const showCardName = submission.paymentMode === 'card'
  const applicationTrackingUrl = resolveApplicationTrackingUrl({ countryName: country })

  useEffect(() => {
    if (readOnly) return
    if (!countryId || !visaOfferingId) return
    if ((submission.vfsServiceCharges ?? []).length > 0) return
    const configuredRates = resolveOfferingVfsServiceRates(countryId, visaOfferingId)
    if (configuredRates.length === 0) return
    onChange({ vfsServiceCharges: mapCountryVfsRatesToChargeLines(configuredRates) })
  }, [readOnly, countryId, onChange, submission.vfsServiceCharges, visaOfferingId])

  if (readOnly) {
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
          <ReadOnlyValueRow
            label="Online Submission Date"
            value={formatDisplayDate(submission.submissionDate)}
          />
          <ReadOnlyValueRow
            label="Online Submission Reference No."
            value={submission.submissionReferenceNumber}
          />
          <ReadOnlyValueRow label="Online Submitted By" value={submission.submittedBy} />
          <ReadOnlyValueRow
            label="VFS Submission Date"
            value={formatDisplayDate(submission.vfsSubmissionDate)}
          />
          <ReadOnlyValueRow
            label="Tentative Collection Date"
            value={formatDisplayDate(submission.tentativeCollectionDate)}
          />
        </AdminOverlayFormSection>

        <ViewFormVfsChargesServicesSection
          country={country}
          visaType={visaType}
          countryId={countryId}
          visaOfferingId={visaOfferingId}
          serviceCharges={submission.vfsServiceCharges ?? []}
          onChange={() => {}}
          readOnly
        />

        <AdminOverlayFormSection title="Payment details" columns={2} importance="secondary">
          <ReadOnlyValueRow label="Payment date" value={formatDisplayDate(submission.paymentDate)} />
          <ReadOnlyValueRow
            label="Payment mode"
            value={labelForOption(PAYMENT_MODE_OPTIONS, submission.paymentMode)}
          />
          {showCardName ? (
            <ReadOnlyValueRow
              label="Card name"
              value={labelForOption(CARD_NAME_OPTIONS, submission.cardName)}
            />
          ) : null}
          <ReadOnlyValueRow
            label="Payment Reference / CC Avenue Ref. No."
            value={submission.paymentReferenceNumber}
          />
          <ReadOnlyValueRow label="Amount paid" value={submission.amountPaid} />
          <ReadOnlyValueRow
            label="Receipt status"
            value={labelForOption(RECEIPT_STATUS_OPTIONS, submission.receiptStatus)}
          />
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <ReadOnlyValueRow label="Payment remarks" value={submission.paymentRemarks} />
          </Box>
        </AdminOverlayFormSection>

        <AdminOverlayFormSection title="Document uploads" columns={2} importance="secondary">
          <ReadOnlyValueRow
            label="Confirmation PDF"
            value={submission.confirmationPdfFileName}
          />
          <ReadOnlyValueRow label="Invoice PDF" value={submission.invoicePdfFileName} />
        </AdminOverlayFormSection>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <AdminOverlayFormSection
        title="Submission details"
        columns={2}
      >
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
        <FormField label="Online Submission Date" required>
          <DatePicker
            value={parseDateString(submission.submissionDate)}
            onChange={date => onChange({ submissionDate: formatDateForStorage(date) })}
            placeholder="Select online submission date"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Online Submission Reference No." required>
          <Input
            value={submission.submissionReferenceNumber}
            onChange={v => onChange({ submissionReferenceNumber: String(v) })}
            placeholder="e.g. VFS-ONL-2026-0142"
            size="sm"
            fullWidth
          />
        </FormField>
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
            onChange={date => onChange({ tentativeCollectionDate: formatDateForStorage(date) })}
            placeholder="Select tentative collection date"
            size="sm"
            fullWidth
          />
        </FormField>
      </AdminOverlayFormSection>

      <ViewFormVfsChargesServicesSection
        country={country}
        visaType={visaType}
        countryId={countryId}
        visaOfferingId={visaOfferingId}
        serviceCharges={submission.vfsServiceCharges ?? []}
        onChange={vfsServiceCharges => onChange({ vfsServiceCharges })}
      />

      <AdminOverlayFormSection
        title="Payment details"
        columns={2}
        importance="secondary"
      >
        <FormField label="Payment date" required>
          <DatePicker
            value={parseDateString(submission.paymentDate)}
            onChange={date => onChange({ paymentDate: formatDateForStorage(date) })}
            placeholder="Select payment date"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Payment mode" required>
          <Select
            value={submission.paymentMode}
            onChange={v => {
              const paymentMode = String(v) as FormAssistSubmissionDraft['paymentMode']
              onChange({
                paymentMode,
                ...(paymentMode !== 'card' ? { cardName: '' } : {}),
              })
            }}
            options={PAYMENT_MODE_OPTIONS}
            placeholder="Select payment mode"
            size="sm"
            fullWidth
          />
        </FormField>
        {showCardName ? (
          <FormField label="Card name" required>
            <Select
              value={submission.cardName}
              onChange={v => onChange({ cardName: String(v) })}
              options={CARD_NAME_OPTIONS}
              placeholder="Select card"
              size="sm"
              fullWidth
              clearable
            />
          </FormField>
        ) : null}
        <FormField label="Payment Reference / CC Avenue Ref. No." required>
          <Input
            value={submission.paymentReferenceNumber}
            onChange={v => onChange({ paymentReferenceNumber: String(v) })}
            placeholder="e.g. TXN-2026-88421"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Amount paid" required>
          <Input
            type="number"
            value={submission.amountPaid}
            onChange={v => onChange({ amountPaid: String(v) })}
            size="sm"
            fullWidth
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Receipt status" required>
          <Select
            value={submission.receiptStatus}
            onChange={v =>
              onChange({ receiptStatus: String(v) as FormAssistSubmissionDraft['receiptStatus'] })
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
              value={submission.paymentRemarks}
              onChange={v => onChange({ paymentRemarks: String(v) })}
              rows={3}
              fullWidth
              placeholder="Optional notes about payment or receipt"
            />
          </FormField>
        </Box>
      </AdminOverlayFormSection>

      <AdminOverlayFormSection
        title="Document uploads"
        columns={2}
        importance="secondary"
      >
        <FileUploadRow
          label="Confirmation PDF"
          fileName={submission.confirmationPdfFileName}
          required
          onPick={file => onPickFile('confirmationPdfFileName', file)}
        />
        <FileUploadRow
          label="Invoice PDF"
          fileName={submission.invoicePdfFileName}
          required
          onPick={file => onPickFile('invoicePdfFileName', file)}
        />
      </AdminOverlayFormSection>
    </Stack>
  )
}
