import { Box, Divider, Stack, Typography } from '@mui/material'
import { Clock, Layers, Stamp, Trash2 } from 'lucide-react'
import { BaseCard, RowActions, Toggle } from '@/design-system/UIComponents'
import type { RowAction } from '@/design-system/UIComponents'
import type { CountryVisaType, VisaTypeStatus } from '@/shared/types/countryMaster'
import { useCountryWorkspaceMode } from './countryWorkspaceModeContext'

interface VisaTypeCardListProps {
  rows: CountryVisaType[]
  onSelect?: (row: CountryVisaType) => void
  onStatusChange?: (row: CountryVisaType, status: VisaTypeStatus) => void
  onDelete?: (row: CountryVisaType) => void
}

interface VisaTypeCardProps {
  visaType: CountryVisaType
  onClick?: () => void
  onStatusChange?: (status: VisaTypeStatus) => void
  onDelete?: () => void
}

const VISA_TYPE_CARD_SX = {
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

function VisaTypeCard({ visaType, onClick, onStatusChange, onDelete }: VisaTypeCardProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const jurisdictionCount = visaType.jurisdictions?.length ?? 0

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
    <BaseCard sx={VISA_TYPE_CARD_SX} onClick={onClick}>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 0, flex: 1 }}>
            {visaType.name}
          </Typography>
          {actions.length > 0 ? (
            <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
              <RowActions actions={actions} row={visaType} />
            </Box>
          ) : null}
        </Stack>

        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0 }}>
              <Stamp size={14} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {visaType.visaCategory || '—'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0 }}>
              <Layers size={14} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {jurisdictionCount === 0
                ? 'No jurisdictions'
                : `${jurisdictionCount} jurisdiction${jurisdictionCount === 1 ? '' : 's'}`}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ color: 'text.secondary', flexShrink: 0 }}>
              <Clock size={14} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {visaType.processingTime || '—'}
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
                checked={visaType.status === 'active'}
                onChange={(v) => onStatusChange(v ? 'active' : 'inactive')}
                label={visaType.status === 'active' ? 'Enabled' : 'Disabled'}
                disabled={readOnly}
              />
            </Box>
          </>
        ) : null}
      </Stack>
    </BaseCard>
  )
}

export function VisaTypeCardList({
  rows,
  onSelect,
  onStatusChange,
  onDelete,
}: VisaTypeCardListProps) {
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No visa types configured. Add a visa type to continue building this segment.
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
        <VisaTypeCard
          key={row.id}
          visaType={row}
          onClick={() => onSelect?.(row)}
          onStatusChange={onStatusChange ? (status) => onStatusChange(row, status) : undefined}
          onDelete={onDelete ? () => onDelete(row) : undefined}
        />
      ))}
    </Box>
  )
}
