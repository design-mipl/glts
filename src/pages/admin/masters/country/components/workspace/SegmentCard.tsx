import { Box, Stack, Typography } from '@mui/material'
import { Building2, Handshake, Ship, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BaseCard, Toggle } from '@/design-system/UIComponents'
import type { BusinessSegment, CountrySegmentConfig } from '@/shared/types/countryMaster'
import { SEGMENT_LABELS } from '../../config/countrySegmentConfig'
import { useCountryWorkspaceMode } from './countryWorkspaceModeContext'

const SEGMENT_ICONS: Record<BusinessSegment, LucideIcon> = {
  retail: Users,
  corporate: Building2,
  marine: Ship,
  b2bAgents: Handshake,
}

interface SegmentCardProps {
  segment: CountrySegmentConfig
  onToggle: (enabled: boolean) => void
  onClick?: () => void
}

export function SegmentCard({ segment, onToggle, onClick }: SegmentCardProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const Icon = SEGMENT_ICONS[segment.segment]

  return (
    <BaseCard
      sx={{
        p: 2,
        cursor: onClick ? 'pointer' : 'default',
        borderColor: segment.enabled ? 'primary.light' : 'divider',
        borderWidth: 1,
        opacity: segment.enabled ? 1 : 0.65,
        bgcolor: segment.enabled ? 'background.paper' : 'action.hover',
        transition: 'border-color 0.15s, background-color 0.15s',
        '&:hover': onClick
          ? { borderColor: 'primary.main', bgcolor: 'action.hover' }
          : undefined,
      }}
      onClick={onClick}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            <Icon size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {SEGMENT_LABELS[segment.segment]}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {segment.visaTypes.length} visa type(s) configured
            </Typography>
          </Box>
        </Stack>
        <Box onClick={(e) => e.stopPropagation()}>
          <Toggle
            checked={segment.enabled}
            onChange={(checked) => onToggle(checked)}
            label={segment.enabled ? 'Enabled' : 'Disabled'}
            disabled={readOnly}
          />
        </Box>
      </Stack>
    </BaseCard>
  )
}
