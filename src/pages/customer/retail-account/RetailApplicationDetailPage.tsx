import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, CircleAlert, FileText } from 'lucide-react'
import { AccentButton, TextButton } from './retailAccountButtons'
import { PublicContainer } from '@/pages/website/components/PublicContainer'
import {
  applyCanvasSx,
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  eyebrowSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { navigateToContinueRetailApplication } from '@/pages/customer/features/applications/utils/createApplicationNavigation'
import { resolveApplicationReferenceDisplay } from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import { mockSingleApplications } from '@/pages/customer/features/applications/data/applicationFlowData'
import { getSavedDraftListingRows } from '@/shared/services/applicationListingDraftStorage'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

const DOC_TONE_LABEL = {
  success: 'Verified',
  warning: 'Action needed',
  neutral: 'In review',
} as const

/**
 * Retail-language application view. Deliberately separate from the shared
 * `ApplicationDetailPage`, which is styled for the Marine / Corporate / B2B portals —
 * this reuses the same `customerPortalService` data, only the presentation differs.
 */
export function RetailApplicationDetailPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()

  const detail = customerPortalService.getApplicationDetail(applicationId)
  const app = detail.application

  const listingRow = useMemo(
    () =>
      [...getSavedDraftListingRows(), ...mockSingleApplications].find(
        row => row.id === (detail.resolvedId ?? applicationId),
      ),
    [detail.resolvedId, applicationId],
  )

  if (!app) {
    return (
      <Shell>
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            borderRadius: applyRadius.card,
            bgcolor: applyFlow.surface,
            border: `1px solid ${applyFlow.hairline}`,
          }}
        >
          <Typography sx={{ fontFamily: applyFont.display, fontWeight: 700, fontSize: 19, color: applyFlow.ink }}>
            We couldn't find that application
          </Typography>
          <Typography sx={{ mt: 1, fontSize: 13.5, color: applyFlow.inkMuted }}>
            It may have been deleted, or it belongs to a different account.
          </Typography>
          <AccentButton sx={{ mt: 2.5 }} onClick={() => navigate('/retail/account')}>
            Back to my account
          </AccentButton>
        </Box>
      </Shell>
    )
  }

  const isDraft = app.statusLabel === 'Draft'
  const needsFix = app.statusLabel === 'Correction Required'
  const reference = resolveApplicationReferenceDisplay(detail.resolvedId ?? app.id).primaryId ?? app.id

  const completed = detail.timeline.filter(t => t.status === 'completed').length
  const percent = detail.timeline.length
    ? Math.round((completed / detail.timeline.length) * 100)
    : 0
  const currentStage =
    detail.timeline.find(t => t.status === 'in_progress')?.title ??
    detail.timeline.filter(t => t.status === 'completed').at(-1)?.title ??
    app.statusLabel

  const verified = detail.documents.filter(d => d.tone === 'success').length
  const pending = detail.documents.filter(d => d.tone === 'warning').length

  return (
    <Shell>
      <TextButton
        startIcon={<ArrowLeft size={15} />}
        onClick={() => navigate('/retail/account')}
        sx={{ mb: 2, ml: -1 }}
      >
        My account
      </TextButton>

      {/* Header — identity of the application and the one action worth taking from here. */}
      <Box
        sx={{
          p: { xs: 2.5, lg: 3 },
          borderRadius: applyRadius.card,
          bgcolor: applyFlow.surface,
          border: `1px solid ${applyFlow.hairline}`,
          mb: { xs: 2.5, lg: 3 },
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ ...eyebrowSx, mb: 0.75 }}>{reference}</Typography>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Typography sx={{ fontSize: 26, lineHeight: 1 }}>{app.countryFlag || '🛂'}</Typography>
              <Typography
                sx={{
                  fontFamily: applyFont.display,
                  fontWeight: 700,
                  fontSize: { xs: 20, lg: 23 },
                  color: applyFlow.ink,
                  letterSpacing: '-0.015em',
                }}
              >
                {app.visaType}
              </Typography>
            </Stack>
            <Typography sx={{ mt: 0.75, fontSize: 13.5, color: applyFlow.inkMuted }}>
              {app.country}
              {listingRow ? ` · ${listingRow.applicantName}` : ''}
              {app.applicantCount > 1 ? ` +${app.applicantCount - 1} more` : ''}
            </Typography>
          </Box>

          {(isDraft || needsFix) && listingRow ? (
            <AccentButton
              onClick={() => navigateToContinueRetailApplication(navigate, listingRow, '/retail')}
            >
              {needsFix ? 'Fix and resubmit' : 'Continue application'}
            </AccentButton>
          ) : null}
        </Stack>

        {!isDraft && detail.timeline.length ? (
          <Box sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: applyFlow.ink }}>
                {currentStage}
              </Typography>
              <Typography
                sx={{
                  fontFamily: applyFont.mono,
                  fontSize: 11.5,
                  color: applyFlow.inkFaint,
                  ...tabularNums,
                }}
              >
                {completed}/{detail.timeline.length} stages
              </Typography>
            </Stack>
            <Box
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Processing progress"
              sx={{
                height: 5,
                borderRadius: applyRadius.full,
                bgcolor: applyFlow.accentTrack,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${percent}%`,
                  height: '100%',
                  borderRadius: applyRadius.full,
                  bgcolor: applyFlow.accent,
                  transition: `width 520ms ${applyMotion.easeInOut}`,
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              />
            </Box>
          </Box>
        ) : null}
      </Box>

      <Grid container spacing={{ xs: 2.5, lg: 3 }} alignItems="flex-start">
        <Grid size={{ xs: 12, xl: 7 }}>
          <Panel title="Progress" eyebrow="What happens next">
            {detail.timeline.length ? (
              <Stack spacing={0}>
                {detail.timeline.map((stage, i) => (
                  <TimelineRow
                    key={stage.id}
                    title={stage.title}
                    status={stage.status}
                    date={stage.date}
                    isLast={i === detail.timeline.length - 1}
                  />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ fontSize: 13.5, color: applyFlow.inkMuted }}>
                Tracking starts once your application is submitted.
              </Typography>
            )}
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <Stack spacing={{ xs: 2.5, lg: 3 }}>
            <Panel
              title="Documents"
              eyebrow={
                detail.documents.length
                  ? `${verified} verified · ${pending} pending`
                  : 'Nothing uploaded yet'
              }
            >
              {detail.documents.length ? (
                <Stack spacing={1}>
                  {detail.documents.map(doc => (
                    <DocumentRow key={doc.name} name={doc.name} tone={doc.tone} />
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: 13.5, color: applyFlow.inkMuted }}>
                  Documents you upload during the application will be listed here with their
                  verification status.
                </Typography>
              )}
            </Panel>

            <Panel title="Details" eyebrow="Application">
              <Stack spacing={1.5}>
                <DetailRow label="Reference" value={reference} mono />
                <DetailRow label="Status" value={app.statusLabel} />
                {app.jurisdiction ? <DetailRow label="Jurisdiction" value={app.jurisdiction} /> : null}
                <DetailRow label="Travel date" value={formatDisplayDate(app.travelDate)} mono />
                <DetailRow label="Travellers" value={String(app.applicantCount)} mono />
                {app.eta ? <DetailRow label="Estimated decision" value={app.eta} /> : null}
                <DetailRow label="Last updated" value={app.updatedAt} />
              </Stack>
            </Panel>
          </Stack>
        </Grid>
      </Grid>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ ...applyCanvasSx, py: { xs: 3, lg: 5 }, minHeight: '100%' }}>
      <PublicContainer>{children}</PublicContainer>
    </Box>
  )
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow?: string
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, lg: 3 },
        borderRadius: applyRadius.card,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
      }}
    >
      {eyebrow ? <Typography sx={{ ...eyebrowSx, mb: 0.75 }}>{eyebrow}</Typography> : null}
      <Typography
        sx={{
          fontFamily: applyFont.display,
          fontWeight: 700,
          fontSize: 17,
          color: applyFlow.ink,
          letterSpacing: '-0.01em',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function TimelineRow({
  title,
  status,
  date,
  isLast,
}: {
  title: string
  status: 'completed' | 'in_progress' | 'pending'
  date?: string
  isLast: boolean
}) {
  const done = status === 'completed'
  const active = status === 'in_progress'

  return (
    <Stack direction="row" spacing={1.75} sx={{ minHeight: isLast ? 'auto' : 56 }}>
      {/* Node + connector rail. The rail is the only vertical structure in the panel,
          so stage order reads without numbering the steps. */}
      <Stack alignItems="center" sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: done ? applyFlow.success : active ? applyFlow.accent : 'transparent',
            border: done || active ? 'none' : `1.5px solid ${applyFlow.hairlineStrong}`,
          }}
        >
          {done ? <Check size={12} color={applyFlow.surface} strokeWidth={3} /> : null}
          {active ? (
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: applyFlow.onAccent }} />
          ) : null}
        </Box>
        {!isLast ? (
          <Box
            sx={{
              flex: 1,
              width: 1.5,
              minHeight: 22,
              my: 0.5,
              bgcolor: done ? applyFlow.successBorder : applyFlow.hairline,
            }}
          />
        ) : null}
      </Stack>

      <Box sx={{ pb: isLast ? 0 : 2.25, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: active ? 700 : 600,
            color: done || active ? applyFlow.ink : applyFlow.inkFaint,
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>
        {date ? (
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 11.5,
              color: applyFlow.inkFaint,
              mt: 0.35,
              ...tabularNums,
            }}
          >
            {date}
          </Typography>
        ) : active ? (
          <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted, mt: 0.35 }}>
            In progress
          </Typography>
        ) : null}
      </Box>
    </Stack>
  )
}

function DocumentRow({ name, tone }: { name: string; tone: 'success' | 'warning' | 'neutral' }) {
  const styles =
    tone === 'success'
      ? { color: applyFlow.success, bg: applyFlow.successSoft, Icon: Check }
      : tone === 'warning'
        ? { color: applyFlow.warning, bg: applyFlow.warningSoft, Icon: CircleAlert }
        : { color: applyFlow.inkMuted, bg: applyFlow.canvas, Icon: FileText }

  const { Icon } = styles

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        p: 1.25,
        borderRadius: applyRadius.control,
        border: `1px solid ${applyFlow.hairlineSoft}`,
        bgcolor: applyFlow.surface,
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          flexShrink: 0,
          borderRadius: applyRadius.chip,
          display: 'grid',
          placeItems: 'center',
          bgcolor: styles.bg,
        }}
      >
        <Icon size={13} color={styles.color} strokeWidth={tone === 'success' ? 3 : 2} />
      </Box>
      <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: applyFlow.ink }} noWrap>
        {name}
      </Typography>
      <Typography
        sx={{ fontSize: 11.5, fontWeight: 700, color: styles.color, flexShrink: 0 }}
      >
        {DOC_TONE_LABEL[tone]}
      </Typography>
    </Stack>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
      <Typography sx={{ fontSize: 13, color: applyFlow.inkMuted, flexShrink: 0 }}>{label}</Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: applyFlow.ink,
          textAlign: 'right',
          minWidth: 0,
          ...(mono ? { fontFamily: applyFont.mono, ...tabularNums } : {}),
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}
