import { useMemo, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  AlertTriangle,
  CalendarRange,
  FileText,
  HandCoins,
  MapPin,
  Pencil,
  Plane,
  Shield,
  Truck,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
import { checklistUploadKey, isRetailDocumentUploadComplete } from '@/shared/utils/retailDocumentFlowUtils'
import { StepShell } from '../StepShell'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
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

function isDocComplete(
  documentId: string,
  applicant: RetailApplicantParty,
  uploads: RetailFlowDraft['documentUploads'],
): boolean {
  return isRetailDocumentUploadComplete(documentId, applicant, uploads)
}

function sponsorComplete(applicant: RetailApplicantParty): boolean {
  const sponsor = applicant.sponsor
  if (!sponsor) return false
  if (sponsor.mode === 'individual') return true
  // Sponsor documents are counted with the traveller's own set on the Documents step,
  // so completeness here is just the sponsor's identity and relationship.
  return Boolean(sponsor.profileComplete) && sponsor.name.trim().length > 0 &&
    sponsor.relationship.trim().length > 0
}

function extraLabel(
  selection: RetailExtraSelection,
  services: RetailJourney['insuranceServices'],
): string {
  if (selection.choice === 'skip') return 'Not added'
  if (selection.choice === 'self_provided') return 'Own policy uploaded'
  return services.find((service) => service.id === selection.serviceId)?.serviceName ?? 'Arranged by GLTS'
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function EditLink({ label = 'Edit', onClick }: { label?: string; onClick?: () => void }) {
  if (!onClick) return null
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        appearance: 'none',
        border: 'none',
        bgcolor: 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        flex: '0 0 auto',
        px: 2,
        py: 1,
        minHeight: 32,
        '@media (pointer: coarse)': { minHeight: 44, px: 3 },
        borderRadius: applyRadius.chip,
        color: applyFlow.inkMuted,
        fontFamily: applyFont.mono,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transition: `color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { color: applyFlow.accentInk, backgroundColor: applyFlow.accentSoft },
        },
        '&:focus-visible': { outline: 'none', boxShadow: `0 0 0 2px ${applyFlow.accent}` },
      }}
    >
      <Pencil size={11} strokeWidth={2.2} />
      {label}
    </Box>
  )
}

/**
 * One verification card.
 *
 * Everything is open. This screen exists so somebody can find the one wrong date before
 * they pay, and the previous version buried every field behind a collapsed accordion — you
 * had to expand eight sections to check the thing you came to check. Sections are titled
 * cards, each with its own way back to the step that owns it.
 */
function ReviewSection({
  icon: Icon,
  title,
  onEdit,
  editLabel,
  status,
  children,
}: {
  icon: LucideIcon
  title: string
  onEdit?: () => void
  editLabel?: string
  status?: ReactNode
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        borderRadius: applyRadius.control,
        border: `1px solid ${applyFlow.hairline}`,
        backgroundColor: applyFlow.surface,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2.5}
        sx={{
          px: 3,
          py: 1.75,
          borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 26,
            height: 26,
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
            borderRadius: applyRadius.chip,
            backgroundColor: applyFlow.canvas,
            border: `1px solid ${applyFlow.hairline}`,
            color: applyFlow.inkMuted,
          }}
        >
          <Icon size={13} strokeWidth={1.9} />
        </Box>
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontFamily: applyFont.mono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
          }}
        >
          {title}
        </Typography>
        {status}
        <EditLink label={editLabel} onClick={onEdit} />
      </Stack>
      <Box sx={{ px: 3, py: 2 }}>{children}</Box>
    </Box>
  )
}

/** Label above value — reads faster down a column than a label/value row on a wide card. */
function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: applyFlow.inkFaint,
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...tabularNums,
          fontFamily: applyFont.body,
          fontSize: 13,
          fontWeight: 600,
          color: applyFlow.ink,
          lineHeight: 1.35,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        columnGap: 4,
        rowGap: 2.25,
      }}
    >
      {children}
    </Box>
  )
}

/** B18 — pre-payment verification. Money lives on the next step, not this one. */
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
  const travellers = draft.applicants
  const mandatoryDocs = useMemo(
    () => journey.documents.filter((doc) => doc.mandatory),
    [journey.documents],
  )

  const docTotals = useMemo(() => {
    let done = 0
    let total = 0
    for (const applicant of travellers) {
      for (const doc of mandatoryDocs) {
        total += 1
        if (isDocComplete(doc.documentId, applicant, draft.documentUploads)) done += 1
      }
    }
    return { done, total }
  }, [travellers, mandatoryDocs, draft.documentUploads])

  const sponsored = travellers.filter((a) => a.sponsor?.mode === 'someone_else')
  const allDocsIn = docTotals.total > 0 && docTotals.done === docTotals.total
  const sponsorsResolved = travellers.every(sponsorComplete)

  const collectionLabel = draft.collectionMethod
    ? retailCollectionMethodLabel(draft.collectionMethod)
    : 'Not arranged'
  const collectionAddress =
    draft.collectionDetails.pickupAddress ||
    draft.collectionDetails.addressLine1 ||
    draft.collectionDetails.receivingOfficeId ||
    '—'

  const body = (
    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left' }}>
      {requirementsUpdated ? (
        <Box
          sx={{
            border: `1px solid rgba(180, 83, 9, 0.30)`,
            borderLeft: `2px solid ${applyFlow.warning}`,
            borderRadius: applyRadius.control,
            bgcolor: applyFlow.warningSoft,
            p: 3,
            display: 'flex',
            gap: 2.5,
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle
            size={17}
            color={applyFlow.warning}
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13.5,
                fontWeight: 700,
                color: applyFlow.warning,
              }}
            >
              Requirements updated
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 12.5,
                color: applyFlow.inkMuted,
                mt: 0.75,
                lineHeight: 1.5,
              }}
            >
              Your last edit changed what this application needs. Check the documents section
              before you pay.
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
                  mt: 1.5,
                  p: 0,
                  fontFamily: applyFont.mono,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: applyFlow.warning,
                }}
              >
                Got it
              </Box>
            ) : null}
          </Box>
        </Box>
      ) : null}

      <ReviewSection
        icon={MapPin}
        title="Visa & application"
        onEdit={onEditStep ? () => onEditStep('visa') : undefined}
      >
        <FieldGrid>
          <Field label="Destination" value={`${journey.country.flag ?? ''} ${journey.country.name}`.trim()} />
          <Field label="Visa type" value={journey.visaType.name} />
          <Field
            label="Application centre"
            value={draft.jurisdictionName || draft.jurisdictionId || '—'}
          />
          <Field label="Passport issued in" value={draft.issuedPassportState || '—'} />
          {draft.placeOfResidence ? (
            <Field label="Place of residence" value={draft.placeOfResidence} />
          ) : null}
        </FieldGrid>
      </ReviewSection>

      <ReviewSection
        icon={CalendarRange}
        title="Travel dates"
        onEdit={onEditStep ? () => onEditStep('jurisdiction') : undefined}
      >
        <FieldGrid>
          <Field label="Departure" value={formatDate(draft.travelDate)} />
          <Field label="Return" value={formatDate(draft.travelDateEnd)} />
        </FieldGrid>
      </ReviewSection>

      <ReviewSection
        icon={Users}
        title={`Applicants · ${travellers.length}`}
        onEdit={onEditStep ? () => onEditStep('travelProfile') : undefined}
      >
        <Stack spacing={0}>
          {travellers.map((applicant, index) => {
            const name = applicant.details.fullName.trim() || applicant.label
            const done = mandatoryDocs.filter((doc) =>
              isDocComplete(doc.documentId, applicant, draft.documentUploads),
            ).length
            const ready = done === mandatoryDocs.length && Boolean(applicant.profileComplete)

            return (
              <Stack
                key={applicant.id}
                direction="row"
                alignItems="center"
                spacing={2.5}
                sx={{
                  py: 2,
                  borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 28,
                    height: 28,
                    flex: '0 0 auto',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: applyRadius.chip,
                    backgroundColor: applyFlow.canvas,
                    border: `1px solid ${ready ? applyFlow.successBorder : applyFlow.hairline}`,
                    fontFamily: applyFont.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: applyFlow.inkMuted,
                  }}
                >
                  {initialsFromName(name) || String(index + 1).padStart(2, '0')}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: applyFlow.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    sx={{
                      ...tabularNums,
                      fontFamily: applyFont.mono,
                      fontSize: 10.5,
                      color: applyFlow.inkMuted,
                      mt: 0.5,
                    }}
                  >
                    {index === 0 ? 'Primary traveller' : `Traveller ${String(index + 1).padStart(2, '0')}`}
                    {'  ·  '}
                    {done}/{mandatoryDocs.length} documents
                  </Typography>
                </Box>
                <StatusPill tone={ready ? 'done' : 'attention'}>
                  {ready ? 'Ready' : 'Incomplete'}
                </StatusPill>
              </Stack>
            )
          })}
        </Stack>
      </ReviewSection>

      <ReviewSection
        icon={HandCoins}
        title="Funding"
        onEdit={onEditStep ? () => onEditStep('sponsor') : undefined}
        status={
          sponsorsResolved ? null : <StatusPill tone="attention">Incomplete</StatusPill>
        }
      >
        {sponsored.length === 0 ? (
          <Typography
            sx={{ fontFamily: applyFont.body, fontSize: 13, color: applyFlow.inkMuted }}
          >
            Every traveller is funding their own trip.
          </Typography>
        ) : (
          <Stack spacing={0}>
            {travellers.map((applicant) => {
              const sponsor = applicant.sponsor
              if (sponsor?.mode !== 'someone_else') return null
              const travellerName = applicant.details.fullName.trim() || applicant.label
              return (
                <Box
                  key={applicant.id}
                  sx={{
                    py: 2,
                    borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                    '&:last-of-type': { borderBottom: 'none' },
                  }}
                >
                  <FieldGrid>
                    <Field label="Sponsor" value={sponsor.name || '—'} />
                    <Field
                      label="Relationship"
                      value={`${sponsor.relationship || '—'} · funding ${travellerName}`}
                    />
                  </FieldGrid>
                </Box>
              )
            })}
          </Stack>
        )}
      </ReviewSection>

      <ReviewSection
        icon={FileText}
        title="Documents"
        onEdit={onEditStep ? () => onEditStep('checklist') : undefined}
        status={
          <StatusPill tone={allDocsIn ? 'done' : 'attention'}>
            {docTotals.done}/{docTotals.total} uploaded
          </StatusPill>
        }
      >
        <Stack spacing={0}>
          {journey.documents.map((doc) => {
            const missingFor = travellers.filter(
              (applicant) => !isDocComplete(doc.documentId, applicant, draft.documentUploads),
            )
            const ok = missingFor.length === 0
            return (
              <Stack
                key={doc.documentId}
                direction="row"
                alignItems="center"
                spacing={2.5}
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: applyFont.body,
                    fontSize: 13,
                    color: applyFlow.ink,
                    lineHeight: 1.35,
                  }}
                >
                  {doc.name}
                  {doc.mandatory ? null : (
                    <Box component="span" sx={{ color: applyFlow.inkFaint }}> · optional</Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    ...tabularNums,
                    fontFamily: applyFont.mono,
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: ok ? applyFlow.success : applyFlow.warning,
                    flex: '0 0 auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ok
                    ? 'All uploaded'
                    : `Missing for ${missingFor.length} of ${travellers.length}`}
                </Typography>
              </Stack>
            )
          })}
          {sponsored.length > 0 &&
          sponsored.some(
            (applicant) =>
              draft.documentUploads[
                checklistUploadKey(applicant.id, SPONSOR_BANK_STATEMENT_DOC_ID)
              ],
          ) ? (
            <Typography
              sx={{
                fontFamily: applyFont.mono,
                fontSize: 10.5,
                color: applyFlow.inkMuted,
                mt: 2,
              }}
            >
              Sponsor documents included.
            </Typography>
          ) : null}
        </Stack>
      </ReviewSection>

      <ReviewSection
        icon={Truck}
        title="Original documents"
        onEdit={onEditStep ? () => onEditStep('collectionDetails') : undefined}
      >
        <FieldGrid>
          <Field label="Handover" value={collectionLabel} />
          <Field label="Address / office" value={collectionAddress} />
        </FieldGrid>
      </ReviewSection>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <ReviewSection
          icon={Shield}
          title="Travel insurance"
          onEdit={onEditStep ? () => onEditStep('insurance') : undefined}
        >
          <Field
            label="Selection"
            value={extraLabel(draft.insurance, journey.insuranceServices)}
          />
        </ReviewSection>

        <ReviewSection
          icon={Plane}
          title="Flight ticket"
          onEdit={onEditStep ? () => onEditStep('flightTicket') : undefined}
        >
          <Field
            label="Selection"
            value={extraLabel(draft.flightTicket, journey.flightTicketServices)}
          />
        </ReviewSection>
      </Box>
    </Stack>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="Review your application"
      helperText="Check every detail against your passports before we price it up. Use Edit on any section to go back and fix something — nothing you've entered is lost."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Everything looks right"
      contentMaxWidth={860}
      footerCaption={
        allDocsIn
          ? undefined
          : 'You can continue to pricing with documents outstanding — we just cannot submit until they are in.'
      }
    >
      {body}
    </StepShell>
  )
}
