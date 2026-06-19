import type { ReactNode } from 'react'
import { alpha, Box, Chip, Stack, Typography, useTheme } from '@mui/material'
import { ensureRowBasicDetails } from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'
import { formatQueueRowGltsLabel } from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { VerifyOverviewData } from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

interface ExpenseTravelerCardListProps {
  rows: UploadQueueRow[]
  overview: VerifyOverviewData
  singleListing: boolean
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  expenseByPassengerId: Map<string, number>
  rankByPassengerId: Map<string, string>
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

export function ExpenseTravelerCardList({
  rows,
  overview,
  singleListing,
  selectedTravelerId,
  onSelectTraveler,
  expenseByPassengerId,
  rankByPassengerId,
}: ExpenseTravelerCardListProps) {
  const colors = usePublicBrandColors()

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
        spacing={0.75}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${colors.border}`,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 700, fontSize: '15px', color: colors.navy }}>
            {singleListing ? 'Applicant' : 'Travelers'}
          </Typography>
          <Chip
            label={`${rows.length} passenger${rows.length === 1 ? '' : 's'}`}
            size="small"
            sx={{ fontSize: '11px', fontWeight: 700, bgcolor: colors.surface }}
          />
          {overview.gltsApplicationId && !singleListing ? (
            <Chip
              label={overview.gltsApplicationId}
              size="small"
              sx={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', bgcolor: colors.surface }}
            />
          ) : null}
          {overview.gltsBatchId && !singleListing ? (
            <Chip
              label={overview.gltsBatchId}
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }}
            />
          ) : null}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Select a passenger — overview, documents, and expenses are shown on the right.
        </Typography>
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
        {rows.map(row => {
          const selected = selectedTravelerId === row.id
          const basic = ensureRowBasicDetails(row)
          const expenseTotal = expenseByPassengerId.get(row.gltsApplicantId) ?? 0
          const rank =
            rankByPassengerId.get(row.gltsApplicantId) ||
            row.additionalDetails?.employmentOccupation?.trim() ||
            ''
          const passport = basic.basicDetails?.passportNumber?.trim() || row.passportNo
          const cdc = basic.basicDetails?.cdcNumber?.trim() || ''
          const metaParts = [
            passport,
            cdc || null,
            rank || null,
            row.nationality && row.nationality !== '—' ? row.nationality : null,
          ].filter(Boolean)

          return (
            <TravelerSelectCard
              key={row.id}
              selected={selected}
              onClick={() => onSelectTraveler(row.id)}
            >
              <Stack spacing={0.35}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'text.primary',
                    wordBreak: 'break-word',
                    lineHeight: 1.3,
                  }}
                >
                  {row.travelerName}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
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
                    {metaParts.length > 0 ? (
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: 'text.secondary',
                          lineHeight: 1.35,
                          mt: 0.15,
                          wordBreak: 'break-word',
                        }}
                      >
                        {metaParts.join(' · ')}
                      </Typography>
                    ) : null}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'text.primary',
                      flexShrink: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {formatInr(expenseTotal)}
                  </Typography>
                </Stack>
              </Stack>
            </TravelerSelectCard>
          )
        })}
      </Stack>
    </Box>
  )
}
