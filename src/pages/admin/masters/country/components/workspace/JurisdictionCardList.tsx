import { Box, Divider, Stack, Typography } from '@mui/material'
import { Building2, Clock, MapPin, Trash2 } from 'lucide-react'
import { BaseCard, RowActions, Toggle } from '@/design-system/UIComponents'
import type { RowAction } from '@/design-system/UIComponents'
import type { CountryVisaJurisdiction, VisaTypeStatus } from '@/shared/types/countryMaster'
import { formatJurisdictionProcessingDays } from '../../utils/jurisdictionProcessingTime'
import { useCountryWorkspaceMode } from './countryWorkspaceModeContext'

interface JurisdictionCardListProps {
  rows: CountryVisaJurisdiction[]
  onSelect?: (row: CountryVisaJurisdiction) => void
  onStatusChange?: (row: CountryVisaJurisdiction, status: VisaTypeStatus) => void
  onDelete?: (row: CountryVisaJurisdiction) => void
}

function formatApplicableStates(states: string[]) {
  if (states.length === 0) return 'No states selected'
  if (states.length <= 3) return states.join(', ')
  return `${states.slice(0, 3).join(', ')} +${states.length - 3} more`
}

interface JurisdictionCardProps {
  jurisdiction: CountryVisaJurisdiction
  onClick?: () => void
  onStatusChange?: (status: VisaTypeStatus) => void
  onDelete?: () => void
}

const JURISDICTION_CARD_SX = {
  p: 2,
  height: '100%',
  borderWidth: 1,
  borderColor: 'divider',
  transition: 'border-color 0.15s, background-color 0.15s',
  cursor: 'pointer',
  '&:hover': {
    borderColor: 'primary.main',
    bgcolor: 'action.hover',
  },
} as const

function JurisdictionCard({ jurisdiction, onClick, onStatusChange, onDelete }: JurisdictionCardProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const embassyLabel = jurisdiction.embassyOrVfs || jurisdiction.submissionCenter || '—'

  const actions: RowAction[] = onDelete && !readOnly
    ? [
        {
          label: 'Delete',
          icon: <Trash2 size={14} />,
          onClick: () => onDelete(),
          variant: 'destructive',
        },
      ]
    : []

  return (
    <BaseCard sx={JURISDICTION_CARD_SX} onClick={onClick}>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 0, flex: 1 }}>
            {jurisdiction.name}
          </Typography>
          {actions.length > 0 ? (
            <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
              <RowActions actions={actions} row={jurisdiction} />
            </Box>
          ) : null}
        </Stack>

        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0 }}>
              <Building2 size={14} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {embassyLabel}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0 }}>
              <MapPin size={14} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {formatApplicableStates(jurisdiction.applicableStates)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ color: 'text.secondary', flexShrink: 0 }}>
              <Clock size={14} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {formatJurisdictionProcessingDays(jurisdiction.processingTime)}
            </Typography>
          </Stack>
        </Stack>

        {onStatusChange ? (
          <>
            <Divider />
            <Box
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Toggle
                checked={jurisdiction.status === 'active'}
                onChange={(v) => onStatusChange(v ? 'active' : 'inactive')}
                label={jurisdiction.status === 'active' ? 'Enabled' : 'Disabled'}
                disabled={readOnly}
              />
            </Box>
          </>
        ) : null}
      </Stack>
    </BaseCard>
  )
}

export function JurisdictionCardList({
  rows,
  onSelect,
  onStatusChange,
  onDelete,
}: JurisdictionCardListProps) {
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No jurisdictions configured. Add a jurisdiction to configure processing rules and documents.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 1.5,
      }}
    >
      {rows.map((row) => (
        <JurisdictionCard
          key={row.id}
          jurisdiction={row}
          onClick={() => onSelect?.(row)}
          onStatusChange={onStatusChange ? (status) => onStatusChange(row, status) : undefined}
          onDelete={onDelete ? () => onDelete(row) : undefined}
        />
      ))}
    </Box>
  )
}
