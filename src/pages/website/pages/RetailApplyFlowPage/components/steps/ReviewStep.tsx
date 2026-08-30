import { useMemo, useState, type ReactNode } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { AlertTriangle, ChevronDown, Pencil } from 'lucide-react'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
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
import { applyFlow, applyFont, applyMotion, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { StatusPill } from '@/pages/website/theme/applyFormControls'

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
  return <StatusPill tone={complete ? 'done' : 'attention'}>{complete ? 'Complete' : 'Incomplete'}</StatusPill>
}

function EditLink({ label = 'Edit', onClick }: { label?: string; onClick?: () => void }) {
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
        gap: 1,
        px: 1.5,
        py: 1,
        borderRadius: applyRadius.chip,
        color: applyFlow.inkMuted,
        fontFamily: applyFont.mono,
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transition: `color 150ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { color: applyFlow.accentInk },
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${applyFlow.accent}`,
        },
      }}
    >
      <Pencil size={11} strokeWidth={2.2} />
      {label}
    </Box>
  )
}

/**
 * Review section. A hairline-separated disclosure, not a bordered card — the review page
 * is a single document to scan top to bottom, and boxing each section made it read as
 * eight unrelated widgets.
 */
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
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Box sx={{ borderBottom: `1px solid ${applyFlow.hairlineSoft}` }}>
      <Box
        component="button"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        sx={{
          appearance: 'none',
          border: 'none',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          px: 0,
          py: 3,
          minHeight: 44,
          cursor: 'pointer',
          font: 'inherit',
          bgcolor: 'transparent',
          textAlign: 'left',
          '&:focus-visible': {
            outline: 'none',
            boxShadow: `inset 0 0 0 2px ${applyFlow.accent}`,
            borderRadius: applyRadius.chip,
          },
        }}
      >
        <ChevronDown
          size={14}
          style={{
            color: applyFlow.inkFaint,
            flexShrink: 0,
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: `transform 180ms ${applyMotion.easeOut}`,
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: 14,
              fontWeight: 600,
              color: applyFlow.ink,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          {summary ? (
            <Typography
              sx={{
                fontFamily: applyFont.mono,
                fontSize: 11,
                color: applyFlow.inkMuted,
                mt: 0.75,
                lineHeight: 1.4,
              }}
            >
              {summary}
            </Typography>
          ) : null}
        </Box>
        <EditLink label={editLabel} onClick={onEdit} />
      </Box>
      <Collapse in={open}>
        <Box sx={{ pl: 6, pr: 0, pb: 3.5 }}>{children}</Box>
      </Collapse>
    </Box>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={3} sx={{ py: 1.25 }}>
      <Typography sx={{ fontFamily: applyFont.body, fontSize: 13, color: applyFlow.inkMuted }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 12,
          fontWeight: 500,
          color: applyFlow.ink,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
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
            border: `1px solid rgba(180, 83, 9, 0.30)`,
            borderLeft: `2px solid ${applyFlow.warning}`,
            borderRadius: applyRadius.control,
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
          borderRadius: applyRadius.control,
          bgcolor: applyFlow.surface,
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: applyFlow.inkMuted, mb: 1 }}>
          Trip
        </Typography>
        <MetaRow label="Destination" value={journey.country.name} />
        <MetaRow label="Visa type" value={journey.visaType.name} />
        {draft.travelDate ? <MetaRow label="Travel date" value={draft.travelDate} /> : null}
        {draft.jurisdictionName || draft.jurisdictionId ? (
          <MetaRow label="Application centre" value={draft.jurisdictionName || draft.jurisdictionId || '—'} />
        ) : null}
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
                  borderRadius: applyRadius.control,
              bgcolor: applyFlow.surface,
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
                bgcolor: open ? applyFlow.accentSoft : applyFlow.surface,
                color: applyFlow.ink,
                textAlign: 'left',
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: applyFlow.canvas,
                  color: applyFlow.inkMuted,
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
              <Stack spacing={1.25} sx={{ p: 2, bgcolor: applyFlow.surface }}>
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
                    <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted }}>
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
          borderRadius: applyRadius.control,
          bgcolor: applyFlow.surface,
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
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
                <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted }}>Travel insurance</Typography>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: applyFlow.ink }}>
                    {extraLabel(draft.insurance, journey.insuranceServices)}
                  </Typography>
                  <EditLink
                    label="Edit"
                    onClick={onEditStep ? () => onEditStep('insurance') : undefined}
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted }}>Flight ticket</Typography>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: applyFlow.ink }}>
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
        <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted, textAlign: 'center' }}>
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
