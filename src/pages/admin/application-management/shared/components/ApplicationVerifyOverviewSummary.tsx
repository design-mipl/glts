import { Box, Divider, Stack, Typography } from '@mui/material'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { ApplicationPriority } from '@/pages/customer/features/applications/data/applicationFlowData'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { ApplicationVipStar } from './ApplicationVipStar'
import {
  applicationPriorityBadgeColor,
  applicationPriorityLabel,
} from '../config/applicationConsultantConfig'

/** Minimal overview shape shared by marine / corporate / b2b verify utils. */
export interface ApplicationOverviewSummaryData {
  gltsApplicationId?: string
  gltsBatchId?: string
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel?: string
  jurisdiction?: string
  travelDate: string
  travelerCount: number
  companyName?: string
  vesselName?: string
  poCidNo?: string
  compassNo?: string
  joiningPort?: string
  entityName?: string
  consultantName?: string
  consultantTeamName?: string
  priority?: string
  isVip?: boolean
}

interface ApplicationVerifyOverviewSummaryProps {
  overview: ApplicationOverviewSummaryData
  isBulk?: boolean
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="baseline" sx={{ minWidth: 0 }}>
      <Typography
        component="span"
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: 11, fontWeight: 600, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
        sx={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}
      >
        {value?.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

function isApplicationPriority(value: string): value is ApplicationPriority {
  return value === 'Urgent' || value === 'High' || value === 'Medium' || value === 'Low'
}

/** Application overview card used on verify + view-form pages opened from listing actions. */
export function ApplicationVerifyOverviewSummary({
  overview,
  isBulk = false,
}: ApplicationVerifyOverviewSummaryProps) {
  const primaryId = overview.gltsBatchId || overview.gltsApplicationId || '—'
  const visaLabel = overview.purposeLabel
    ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
    : overview.visaTypeLabel
  const countryLabel = [overview.countryFlag, overview.countryName].filter(Boolean).join(' ')

  const consultantName = overview.consultantName?.trim() || ''
  const consultantTeam = overview.consultantTeamName?.trim() || ''
  const hasConsultant = Boolean(consultantName || consultantTeam)
  const consultantPrimary = consultantName || consultantTeam || 'Unassigned'
  const consultantSecondary = consultantName && consultantTeam ? consultantTeam : null

  const priorityValue = overview.priority?.trim() || ''
  const priorityKnown = priorityValue && isApplicationPriority(priorityValue)

  return (
    <BaseCard>
      <Box sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.25 }}>
                Application overview
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.75} useFlexGap flexWrap="wrap">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    fontSize: 16,
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                  }}
                >
                  {primaryId}
                </Typography>
                {overview.isVip ? <ApplicationVipStar size={16} /> : null}
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  fontSize: 13,
                  fontWeight: 600,
                  color: hasConsultant ? 'text.primary' : 'text.secondary',
                  wordBreak: 'break-word',
                }}
              >
                Consultant · {consultantPrimary}
                {consultantSecondary ? (
                  <Typography
                    component="span"
                    sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary', ml: 0.75 }}
                  >
                    · {consultantSecondary}
                  </Typography>
                ) : null}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Badge label={isBulk ? 'Bulk' : 'Single'} color="neutral" size="sm" />
              <Badge
                label={`${overview.travelerCount} traveler${overview.travelerCount === 1 ? '' : 's'}`}
                color="info"
                size="sm"
              />
              {overview.isVip ? <Badge label="VIP" color="success" size="sm" /> : null}
              {priorityKnown ? (
                <Badge
                  label={applicationPriorityLabel[priorityValue]}
                  color={applicationPriorityBadgeColor(priorityValue)}
                  size="sm"
                />
              ) : (
                <Badge label="No priority" color="neutral" size="sm" />
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{ flexWrap: 'wrap', rowGap: 1, columnGap: 2.5 }}
          >
            {overview.gltsBatchId && overview.gltsApplicationId ? (
              <MetaChip label="App" value={overview.gltsApplicationId} />
            ) : null}
            <MetaChip label="Company" value={overview.companyName || '—'} />
            <MetaChip label="Billing entity" value={overview.entityName || '—'} />
            <MetaChip label="Vessel" value={overview.vesselName || '—'} />
            <MetaChip label="PO / CID no." value={overview.poCidNo || '—'} />
            <MetaChip label="Compass No." value={overview.compassNo || '—'} />
            <MetaChip label="Joining port" value={overview.joiningPort || '—'} />
            <MetaChip label="Country" value={countryLabel} />
            <MetaChip label="Visa" value={visaLabel} />
            <MetaChip label="Jurisdiction" value={overview.jurisdiction || '—'} />
            <MetaChip label="Travel" value={formatDisplayDate(overview.travelDate)} />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
