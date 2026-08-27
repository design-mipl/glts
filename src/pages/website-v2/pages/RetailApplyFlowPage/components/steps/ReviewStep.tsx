import { useMemo, useState, type ReactNode } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { AlertTriangle, CheckCircle2, ChevronDown, Pencil } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { getElevatedCardSx, retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { retailCollectionMethodLabel } from '../../config/retailCollectionMethods'
import { initialsFromName } from '../../config/travelProfileQuestions'
import {
  SPONSOR_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailExtraSelection,
  type RetailFlowDraft,
  type RetailStepId,
} from '../../types'
import { checklistUploadKey } from './ChecklistStep'
import { StepShell } from '../StepShell'

interface ReviewStepProps {
  journey: RetailJourney
  draft: RetailFlowDraft
  onBack: () => void
  onContinue: () => void
  onEditStep?: (stepId: RetailStepId) => void
  /** Shown when an upstream edit changed the resolved document set. */
  requirementsUpdated?: boolean
  onDismissRequirementsUpdated?: () => void
  previewOnly?: boolean
}

function isIdentityCaptureDoc(documentId: string): 'photo' | 'passport' | null {
  const id = documentId.toLowerCase()
  if (id === 'photo' || id === 'photograph') return 'photo'
  if (id.includes('photo') && !id.includes('passport')) return 'photo'
  if (id === 'passport') return 'passport'
  if (id.includes('passport') && !/old|stamp|back|front|all|pages/.test(id)) return 'passport'
  return null
}

function isDocComplete(
  documentId: string,
  applicant: RetailApplicantParty,
  uploads: RetailFlowDraft['documentUploads'],
): boolean {
  const identity = isIdentityCaptureDoc(documentId)
  if (identity === 'photo' && applicant.photo) return true
  if (identity === 'passport' && applicant.passport) return true
  return Boolean(uploads[checklistUploadKey(applicant.id, documentId)] || uploads[documentId])
}

function sponsorComplete(
  applicant: RetailApplicantParty,
  uploads: RetailFlowDraft['documentUploads'],
): boolean {
  const sponsor = applicant.sponsor
  if (!sponsor) return false
  if (sponsor.mode === 'individual') return true
  return (
    Boolean(sponsor.profileComplete) &&
    sponsor.name.trim().length > 0 &&
    sponsor.relationship.trim().length > 0 &&
    sponsor.contact.trim().length > 0 &&
    Boolean(uploads[checklistUploadKey(applicant.id, SPONSOR_BANK_STATEMENT_DOC_ID)])
  )
}

function travellerComplete(
  applicant: RetailApplicantParty,
  journey: RetailJourney,
  draft: RetailFlowDraft,
): boolean {
  const docsOk = journey.documents
    .filter((d) => d.mandatory)
    .every((d) => isDocComplete(d.documentId, applicant, draft.documentUploads))
  const profileOk = Boolean(applicant.profileComplete || applicant.details.fullName.trim())
  const sponsorOk = sponsorComplete(applicant, draft.documentUploads)
  return docsOk && profileOk && sponsorOk
}

function extraLabel(selection: RetailExtraSelection, services: RetailJourney['insuranceServices']): string {
  if (selection.choice === 'skip') return 'Skipped'
  if (selection.choice === 'self_provided') return 'Upload own'
  return services.find((service) => service.id === selection.serviceId)?.serviceName ?? 'Get from GLTS'
}

function StatusBadge({ complete }: { complete: boolean }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.35,
        borderRadius: 999,
        bgcolor: complete ? retailFlowColors.greenMuted : 'rgba(180, 83, 9, 0.12)',
        color: complete ? retailFlowColors.green : '#B45309',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}
    >
      {complete ? <CheckCircle2 size={12} strokeWidth={2.4} /> : null}
      {complete ? 'Complete' : 'Incomplete'}
    </Box>
  )
}

function EditLink({ label = 'Edit', onClick }: { label?: string; onClick?: () => void }) {
  const colors = usePublicBrandColors()
  if (!onClick) return null
  return (
    <Box
      component="button"
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      sx={{
        appearance: 'none',
        border: 'none',
        bgcolor: 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color: retailFlowColors.green,
        fontSize: 12.5,
        fontWeight: 700,
        p: 0,
        '&:hover': { color: colors.greenDark },
      }}
    >
      <Pencil size={12} strokeWidth={2.4} />
      {label}
    </Box>
  )
}

function AccordionBlock({
  title,
  summary,
  defaultOpen = false,
  editLabel,
  onEdit,
  children,
}: {
  title: string
  summary?: string
  defaultOpen?: boolean
  editLabel?: string
  onEdit?: () => void
  children: ReactNode
}) {
  const colors = usePublicBrandColors()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Box
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        bgcolor: colors.white,
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        sx={{
          appearance: 'none',
          border: 'none',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1.25,
          cursor: 'pointer',
          font: 'inherit',
          bgcolor: colors.surfaceAlt,
          textAlign: 'left',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>{title}</Typography>
          {summary ? (
            <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.2, lineHeight: 1.35 }}>
              {summary}
            </Typography>
          ) : null}
        </Box>
        <EditLink label={editLabel} onClick={onEdit} />
        <ChevronDown
          size={16}
          color={colors.textMuted}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', flexShrink: 0 }}
        />
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 1.5, py: 1.5, borderTop: `1px solid ${colors.border}` }}>{children}</Box>
      </Collapse>
    </Box>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const colors = usePublicBrandColors()
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.55 }}>
      <Typography sx={{ fontSize: 12.5, color: colors.textMuted }}>{label}</Typography>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  )
}

/** B18 — Pre-payment review: accordion per traveller + category, edit links, requirements banner. */
export function ReviewStep({
  journey,
  draft,
  onBack,
  onContinue,
  onEditStep,
  requirementsUpdated = false,
  onDismissRequirementsUpdated,
  previewOnly = false,
}: ReviewStepProps) {
  const colors = usePublicBrandColors()
  const [openTravellerId, setOpenTravellerId] = useState(draft.applicants[0]?.id ?? '')

  const travellers = draft.applicants
  const completion = useMemo(
    () =>
      Object.fromEntries(
        travellers.map((a) => [a.id, travellerComplete(a, journey, draft)]),
      ) as Record<string, boolean>,
    [travellers, journey, draft],
  )

  const allComplete = travellers.every((a) => completion[a.id])
  const collectionLabel = draft.collectionMethod
    ? retailCollectionMethodLabel(draft.collectionMethod)
    : 'Not arranged'
  const collectionSummary = draft.collectionMethod
    ? draft.collectionDetails.pickupAddress ||
      draft.collectionDetails.addressLine1 ||
      draft.collectionDetails.receivingOfficeId ||
      'Details saved'
    : 'Choose how originals reach us'

  const body = (
    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left' }}>
      {requirementsUpdated ? (
        <Box
          sx={{
            ...getElevatedCardSx('rgba(180, 83, 9, 0.35)'),
            borderRadius: BORDER_RADIUS.lg,
            bgcolor: 'rgba(255, 247, 237, 1)',
            p: 1.75,
            display: 'flex',
            gap: 1.25,
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle size={18} color="#B45309" style={{ flexShrink: 0, marginTop: 2 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: '#92400E' }}>
              Requirements updated
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: '#9A3412', mt: 0.35, lineHeight: 1.45 }}>
              Your last edit changed what this application needs. Review each traveller’s documents
              before paying.
            </Typography>
            {onDismissRequirementsUpdated ? (
              <Box
                component="button"
                type="button"
                onClick={onDismissRequirementsUpdated}
                sx={{
                  appearance: 'none',
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  mt: 1,
                  p: 0,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#B45309',
                }}
              >
                Got it
              </Box>
            ) : null}
          </Box>
        </Box>
      ) : null}

      <Box
        sx={{
          ...getElevatedCardSx(colors.border),
          borderRadius: BORDER_RADIUS.lg,
          bgcolor: colors.white,
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.textMuted, mb: 1 }}>
          Trip
        </Typography>
        <MetaRow label="Destination" value={journey.country.name} />
        <MetaRow label="Visa type" value={journey.visaType.name} />
        {draft.travelDate ? <MetaRow label="Travel date" value={draft.travelDate} /> : null}
      </Box>

      {travellers.map((applicant, index) => {
        const name = applicant.details.fullName.trim() || applicant.label
        const open = openTravellerId === applicant.id
        const complete = completion[applicant.id]
        const mandatoryDocs = journey.documents.filter((d) => d.mandatory)
        const doneDocs = mandatoryDocs.filter((d) =>
          isDocComplete(d.documentId, applicant, draft.documentUploads),
        ).length
        const sponsor = applicant.sponsor

        return (
          <Box
            key={applicant.id}
            sx={{
              ...getElevatedCardSx(colors.border),
              borderRadius: BORDER_RADIUS.lg,
              bgcolor: colors.white,
              overflow: 'hidden',
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => setOpenTravellerId(open ? '' : applicant.id)}
              sx={{
                appearance: 'none',
                border: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                font: 'inherit',
                bgcolor: open ? colors.navy : colors.white,
                color: open ? '#fff' : colors.navy,
                textAlign: 'left',
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: open ? 'rgba(255,255,255,0.18)' : colors.surfaceAlt,
                  color: open ? '#fff' : colors.textSecondary,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {initialsFromName(name)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>{name}</Typography>
                <Typography sx={{ fontSize: 11.5, opacity: 0.75, mt: 0.2 }}>
                  {index === 0 ? 'Primary traveller' : `Traveller ${index + 1}`}
                </Typography>
              </Box>
              <StatusBadge complete={complete} />
              <ChevronDown
                size={16}
                style={{
                  transform: open ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                  opacity: 0.8,
                  flexShrink: 0,
                }}
              />
            </Box>

            <Collapse in={open}>
              <Stack spacing={1.25} sx={{ p: 2, bgcolor: colors.white }}>
                <AccordionBlock
                  title="Documents"
                  summary={`${doneDocs}/${mandatoryDocs.length} mandatory uploaded`}
                  defaultOpen
                  onEdit={onEditStep ? () => onEditStep('checklist') : undefined}
                >
                  <Stack spacing={0.5}>
                    {journey.documents.map((doc) => {
                      const ok = isDocComplete(doc.documentId, applicant, draft.documentUploads)
                      return (
                        <MetaRow
                          key={doc.documentId}
                          label={`${doc.name}${doc.mandatory ? '' : ' (optional)'}`}
                          value={ok ? 'Uploaded' : 'Missing'}
                        />
                      )
                    })}
                  </Stack>
                </AccordionBlock>

                <AccordionBlock
                  title="Sponsor"
                  summary={
                    !sponsor
                      ? 'Not answered'
                      : sponsor.mode === 'individual'
                        ? 'Individual (self-funded)'
                        : `Sponsored by ${sponsor.name || '—'}`
                  }
                  onEdit={onEditStep ? () => onEditStep('sponsor') : undefined}
                >
                  {sponsor?.mode === 'someone_else' ? (
                    <>
                      <MetaRow label="Name" value={sponsor.name || '—'} />
                      <MetaRow label="Relationship" value={sponsor.relationship || '—'} />
                      <MetaRow label="Contact" value={sponsor.contact || '—'} />
                      <MetaRow
                        label="Bank statement"
                        value={
                          draft.documentUploads[
                            checklistUploadKey(applicant.id, SPONSOR_BANK_STATEMENT_DOC_ID)
                          ]
                            ? 'Uploaded'
                            : 'Missing'
                        }
                      />
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 12.5, color: colors.textMuted }}>
                      This traveller is funding their own trip.
                    </Typography>
                  )}
                </AccordionBlock>

                <AccordionBlock
                  title="Profile"
                  summary={
                    applicant.details.passportNumber
                      ? `Passport ${applicant.details.passportNumber}`
                      : 'Travel profile'
                  }
                  onEdit={onEditStep ? () => onEditStep('travelProfile') : undefined}
                >
                  <MetaRow label="Full name" value={applicant.details.fullName || '—'} />
                  <MetaRow label="Passport" value={applicant.details.passportNumber || '—'} />
                  <MetaRow label="Nationality" value={applicant.details.nationality || '—'} />
                </AccordionBlock>
              </Stack>
            </Collapse>
          </Box>
        )
      })}

      <Box
        sx={{
          ...getElevatedCardSx(colors.border),
          borderRadius: BORDER_RADIUS.lg,
          bgcolor: colors.white,
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: colors.textMuted,
            mb: 1.25,
          }}
        >
          Application
        </Typography>
        <Stack spacing={1.25}>
          <AccordionBlock
            title="Collection method"
            summary={`${collectionLabel} · ${collectionSummary}`}
            onEdit={
              onEditStep
                ? () => onEditStep(draft.collectionMethod ? 'collectionDetails' : 'collectionMethod')
                : undefined
            }
          >
            <MetaRow label="Method" value={collectionLabel} />
            {draft.collectionDetails.pickupAddress || draft.collectionDetails.addressLine1 ? (
              <MetaRow
                label="Address"
                value={
                  draft.collectionDetails.pickupAddress ||
                  draft.collectionDetails.addressLine1 ||
                  '—'
                }
              />
            ) : null}
            {draft.collectionDetails.receivingOfficeId ? (
              <MetaRow label="Office" value={draft.collectionDetails.receivingOfficeId} />
            ) : null}
          </AccordionBlock>

          <AccordionBlock
            title="Essentials"
            summary={`Insurance: ${extraLabel(draft.insurance, journey.insuranceServices)} · Ticket: ${extraLabel(draft.flightTicket, journey.flightTicketServices)}`}
            defaultOpen
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 12.5, color: colors.textMuted }}>Travel insurance</Typography>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: colors.navy }}>
                    {extraLabel(draft.insurance, journey.insuranceServices)}
                  </Typography>
                  <EditLink
                    label="Edit"
                    onClick={onEditStep ? () => onEditStep('insurance') : undefined}
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 12.5, color: colors.textMuted }}>Flight ticket</Typography>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: colors.navy }}>
                    {extraLabel(draft.flightTicket, journey.flightTicketServices)}
                  </Typography>
                  <EditLink
                    label="Edit"
                    onClick={onEditStep ? () => onEditStep('flightTicket') : undefined}
                  />
                </Stack>
              </Stack>
            </Stack>
          </AccordionBlock>
        </Stack>
      </Box>

      {!allComplete ? (
        <Typography sx={{ fontSize: 12.5, color: colors.textMuted, textAlign: 'center' }}>
          Finish incomplete travellers before payment — you can still proceed to review pricing.
        </Typography>
      ) : null}
    </Stack>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="Review your application"
      helperText="Check each traveller, then continue to payment. Use Edit to jump back and fix anything."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Proceed to payment"
      contentMaxWidth={720}
    >
      {body}
    </StepShell>
  )
}
