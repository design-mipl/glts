import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { DatePicker, FormField, Input } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { ApplicationTrackingUrlLink } from '@/shared/components/ApplicationTrackingUrlLink'
import { resolveApplicationTrackingUrl, resolveOfferingVfsServiceRates } from '@/shared/services/countryMasterService'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import { resolveCardLabel } from '@/shared/utils/cardMasterOptions'
import { mapCountryVfsRatesToChargeLines } from '@/shared/utils/countryVfsServiceRateUtils'
import {
  PAYMENT_MODE_OPTIONS,
  RECEIPT_STATUS_OPTIONS,
} from '../../config/submissionPaymentConfig'
import { resolvePaymentEntryServices } from '../../utils/pendingPaymentUtils'
import { PaymentEntryCard } from './PendingPaymentSubmissionSection'
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
  /** Pending Payment workspace: hide online submission date / reference fields. */
  hideOnlineSubmissionFields?: boolean
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
  onPickFile: (field: keyof FormAssistSubmissionDraft, file: File) => void
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

function PhysicalSubmissionDatesPanel({
  vfsSubmissionDate,
  tentativeCollectionDate,
}: {
  vfsSubmissionDate: string
  tentativeCollectionDate: string
}) {
  return (
    <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 3,
        }}
      >
        <ReadOnlyValueRow
          label="Physical Submission Date"
          value={formatDisplayDate(vfsSubmissionDate)}
        />
        <ReadOnlyValueRow
          label="Tentative Collection Date"
          value={formatDisplayDate(tentativeCollectionDate)}
        />
      </Box>
    </Box>
  )
}

export function ViewFormSubmissionSection({
  submission,
  country,
  visaType,
  countryId,
  visaOfferingId,
  readOnly = false,
  hideOnlineSubmissionFields = false,
  onChange,
}: ViewFormSubmissionSectionProps) {
  const showCardType = submission.paymentMode === 'card'
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
          {!hideOnlineSubmissionFields ? (
            <>
              <ReadOnlyValueRow
                label="Online Submission Date"
                value={formatDisplayDate(submission.submissionDate)}
              />
              <ReadOnlyValueRow
                label="Online Submission Reference No."
                value={submission.submissionReferenceNumber}
              />
            </>
          ) : null}
          <ReadOnlyValueRow label="Online Submitted By" value={submission.submittedBy} />
          <PhysicalSubmissionDatesPanel
            vfsSubmissionDate={submission.vfsSubmissionDate}
            tentativeCollectionDate={submission.tentativeCollectionDate}
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
          {showCardType ? (
            <ReadOnlyValueRow
              label="Payment card"
              value={resolveCardLabel(submission.paymentCardId)}
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

        <AdminOverlayFormSection title="Document uploads" columns={1} importance="secondary">
          <ReadOnlyValueRow
            label="Payment Receipt"
            value={submission.paymentReceiptFileName}
          />
        </AdminOverlayFormSection>
      </Stack>
    )
  }

  const paymentEntries = submission.paymentEntries ?? []

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
        {!hideOnlineSubmissionFields ? (
          <>
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
          </>
        ) : null}
        <FormField label="Online Submitted By" required>
          <Input
            value={submission.submittedBy}
            onChange={v => onChange({ submittedBy: String(v) })}
            placeholder="Enter officer or team name"
            size="sm"
            fullWidth
          />
        </FormField>
        <PhysicalSubmissionDatesPanel
          vfsSubmissionDate={submission.vfsSubmissionDate}
          tentativeCollectionDate={submission.tentativeCollectionDate}
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

      {paymentEntries.length > 0 ? (
        <AdminOverlayFormSection title="Payment entries" columns={1} importance="secondary">
          <Stack spacing={1.5} sx={{ width: '100%' }}>
            {paymentEntries.map((entry, index) => (
              <PaymentEntryCard
                key={entry.id}
                index={index + 1}
                entry={entry}
                services={resolvePaymentEntryServices(submission.vfsServiceCharges ?? [], entry)}
              />
            ))}
          </Stack>
        </AdminOverlayFormSection>
      ) : (
        <AdminOverlayFormSection title="Payment details" columns={2} importance="secondary">
          <ReadOnlyValueRow label="Payment date" value={formatDisplayDate(submission.paymentDate)} />
          <ReadOnlyValueRow
            label="Payment mode"
            value={labelForOption(PAYMENT_MODE_OPTIONS, submission.paymentMode)}
          />
          {showCardType ? (
            <ReadOnlyValueRow
              label="Payment card"
              value={resolveCardLabel(submission.paymentCardId)}
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
      )}

      <AdminOverlayFormSection title="Document uploads" columns={1} importance="secondary">
        <ReadOnlyValueRow label="Payment Receipt" value={submission.paymentReceiptFileName} />
      </AdminOverlayFormSection>
    </Stack>
  )
}
