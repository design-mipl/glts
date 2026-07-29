import type { ReactNode } from 'react'
import { alpha, Box, Chip, Stack, Typography, useTheme } from '@mui/material'
import { Search } from 'lucide-react'
import { Input } from '@/design-system/UIComponents'
import { ensureRowBasicDetails } from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'
import { formatQueueRowGltsLabel } from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { VerifyOverviewData } from '../../utils/verifyDocumentsUtils'
import {
  countVerifyTravelerBuckets,
  getTravelerDocProgress,
  type VerifyTravelerListFilter,
  type VerifyTravelerTone,
} from '../../utils/verifyDocumentsUtils'

interface VerifyTravelerListProps {
  rows: UploadQueueRow[]
  filteredRows: UploadQueueRow[]
  overview: VerifyOverviewData
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
        borderRadius: 1.25,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        borderLeftWidth: selected ? 3 : 1,
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: selected
            ? alpha(theme.palette.primary.main, 0.07)
            : alpha(theme.palette.action.hover, 0.04),
          borderColor: selected ? 'primary.main' : alpha(theme.palette.primary.main, 0.25),
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

export function VerifyTravelerList({
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
}: VerifyTravelerListProps) {
  const colors = usePublicBrandColors()
  const counts = countVerifyTravelerBuckets(rows)

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: 'background.paper',
          flex: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          No passengers available for this application yet.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        alignSelf: 'stretch',
      }}
    >
      <Stack
        spacing={1}
        sx={{
          px: 1.5,
          py: 1.25,
          borderBottom: `1px solid ${colors.border}`,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.navy }}>
            {singleListing ? 'Applicant' : 'Passenger list'}
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
            const count = counts[option.value]
            return (
              <Chip
                key={option.value}
                label={`${option.label} (${count})`}
                size="small"
                onClick={() => onFilterChange(option.value)}
                sx={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 600,
                  height: 24,
                  cursor: 'pointer',
                  bgcolor: active ? alpha(colors.navy, 0.1) : 'background.paper',
                  border: `1px solid ${active ? colors.navy : colors.border}`,
                  color: active ? colors.navy : 'text.secondary',
                }}
              />
            )
          })}
        </Stack>
      </Stack>

      <Stack
        spacing={0.5}
        sx={{
          p: 1,
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        }}
      >
        {filteredRows.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, p: 1.5 }}>
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
                        color: 'text.primary',
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
                        color: 'text.secondary',
                        lineHeight: 1.3,
                      }}
                    >
                      {formatQueueRowGltsLabel(row, overview.gltsApplicationId, singleListing)}
                    </Typography>
                    {passport ? (
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: 'text.secondary',
                          lineHeight: 1.35,
                          mt: 0.15,
                          wordBreak: 'break-word',
                        }}
                      >
                        {passport}
                        {row.nationality && row.nationality !== '—'
                          ? ` · ${row.nationality}`
                          : ''}
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
