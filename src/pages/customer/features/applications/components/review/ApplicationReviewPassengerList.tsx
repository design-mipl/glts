import type { ReactNode } from 'react'
import { alpha, Box, Chip, Stack, Typography, useTheme } from '@mui/material'
import { Search } from 'lucide-react'
import { Input } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { ensureRowBasicDetails } from '../../utils/applicantBasicDetailsUtils'
import { formatQueueRowGltsLabel } from '../../utils/gltsReferenceIds'
import type { UploadQueueRow } from '../../data/applicationFlowData'
import type { ApplicationReviewOverview } from '../../utils/applicationReviewOverview'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  countVerifyTravelerBuckets,
  getTravelerDocProgress,
  type VerifyTravelerListFilter,
  type VerifyTravelerTone,
} from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'

interface ApplicationReviewPassengerListProps {
  rows: UploadQueueRow[]
  filteredRows: UploadQueueRow[]
  overview: ApplicationReviewOverview
  singleListing: boolean
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  search: string
  onSearchChange: (value: string) => void
  filter: VerifyTravelerListFilter
  onFilterChange: (value: VerifyTravelerListFilter) => void
}

function toneColor(tone: VerifyTravelerTone, colors: ReturnType<typeof usePublicBrandColors>): string {
  if (tone === 'completed') return colors.greenDark
  if (tone === 'correction') return '#C62828'
  return '#B45309'
}

function TravelerSelectCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  const theme = useTheme()
  const colors = usePublicBrandColors()

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      sx={{
        px: 1.25,
        py: 0.875,
        flexShrink: 0,
        borderRadius: BORDER_RADIUS.lg,
        border: `${BORDER_WIDTH.thin} solid ${selected ? colors.navy : colors.border}`,
        borderLeftWidth: selected ? 3 : 1,
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.05) : colors.white,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.07) : colors.surface,
          borderColor: selected ? colors.navy : alpha(theme.palette.primary.main, 0.25),
        },
      }}
    >
      {children}
    </Box>
  )
}

const FILTER_OPTIONS: Array<{ value: VerifyTravelerListFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'correction', label: 'Correction' },
]

export function ApplicationReviewPassengerList({
  rows,
  filteredRows,
  overview,
  singleListing,
  selectedTravelerId,
  onSelectTraveler,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: ApplicationReviewPassengerListProps) {
  const colors = usePublicBrandColors()
  const counts = countVerifyTravelerBuckets(rows)

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          p: 2.5,
          borderRadius: BORDER_RADIUS.xl,
          border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
          bgcolor: colors.white,
          flex: 1,
        }}
      >
        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
          No passengers available for this application yet.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        borderRadius: BORDER_RADIUS.xl,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        bgcolor: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Stack
        spacing={1}
        sx={{
          px: 1.5,
          py: 1.25,
          borderBottom: `${BORDER_WIDTH.thin} solid ${colors.border}`,
          flexShrink: 0,
          bgcolor: colors.white,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.navy }}>
            {singleListing ? 'Applicant' : 'Passengers'}
          </Typography>
          <Chip
            label={`${rows.length}`}
            size="small"
            sx={{ fontSize: 11, fontWeight: 700, height: 22, bgcolor: colors.surface }}
          />
        </Stack>

        <Input
          value={search}
          onChange={onSearchChange}
          placeholder="Search passenger"
          size="sm"
          startAdornment={<Search size={14} />}
          fullWidth
        />

        <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {FILTER_OPTIONS.map(option => {
            const active = filter === option.value
            return (
              <Chip
                key={option.value}
                label={`${option.label} (${counts[option.value]})`}
                size="small"
                onClick={() => onFilterChange(option.value)}
                sx={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 600,
                  height: 24,
                  cursor: 'pointer',
                  bgcolor: active ? alpha(colors.navy, 0.1) : colors.white,
                  border: `${BORDER_WIDTH.thin} solid ${active ? colors.navy : colors.border}`,
                  color: active ? colors.navy : colors.textSecondary,
                }}
              />
            )
          })}
        </Stack>
      </Stack>

      <Stack spacing={0.5} sx={{ p: 1, overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {filteredRows.length === 0 ? (
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, p: 1.5 }}>
            No passengers match this filter.
          </Typography>
        ) : (
          filteredRows.map(row => {
            const selected = selectedTravelerId === row.id
            const basic = ensureRowBasicDetails(row)
            const progress = getTravelerDocProgress(row)
            const passport = basic.basicDetails?.passportNumber?.trim() || row.passportNo

            return (
              <TravelerSelectCard
                key={row.id}
                selected={selected}
                onClick={() => onSelectTraveler(row.id)}
              >
                <Stack spacing={0.35}>
                  <Stack direction="row" alignItems="flex-start" spacing={0.75}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.text,
                        wordBreak: 'break-word',
                        lineHeight: 1.3,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {selected ? '▶ ' : ''}
                      {row.travelerName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: toneColor(progress.tone, colors),
                        flexShrink: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {progress.label}
                    </Typography>
                  </Stack>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        color: colors.textSecondary,
                        lineHeight: 1.3,
                      }}
                    >
                      {formatQueueRowGltsLabel(row, overview.gltsApplicationId, singleListing)}
                    </Typography>
                    {passport ? (
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: colors.textSecondary,
                          lineHeight: 1.35,
                          mt: 0.15,
                          wordBreak: 'break-word',
                        }}
                      >
                        {passport}
                        {row.nationality && row.nationality !== '—' ? ` · ${row.nationality}` : ''}
                      </Typography>
                    ) : null}
                  </Box>
                </Stack>
              </TravelerSelectCard>
            )
          })
        )}
      </Stack>
    </Box>
  )
}
