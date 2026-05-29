import { Box, Stack, Typography } from '@mui/material'
import { Building2, Ship, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BaseCard, Toggle } from '@/design-system/UIComponents'
import type { BusinessSegment, CountryMasterFormData } from '@/shared/types/countryMaster'
import { SEGMENT_DESCRIPTIONS, SEGMENT_LABELS } from '../config/countrySegmentConfig'

const SEGMENT_ICONS: Record<BusinessSegment, LucideIcon> = {
  retail: Users,
  corporate: Building2,
  marine: Ship,
}

interface CountryFormSegmentCardsProps {
  data: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
}

export function CountryFormSegmentCards({ data, onChange }: CountryFormSegmentCardsProps) {
  const toggleSegment = (segment: BusinessSegment, enabled: boolean) => {
    onChange({
      ...data,
      segments: data.segments.map((s) =>
        s.segment === segment ? { ...s, enabled } : s,
      ),
    })
  }

  return (
    <Stack spacing={1.5}>
      {data.segments.map((seg) => {
        const Icon = SEGMENT_ICONS[seg.segment]
        return (
          <BaseCard
            key={seg.segment}
            sx={{
              p: 2,
              borderColor: seg.enabled ? 'primary.main' : 'divider',
              borderWidth: seg.enabled ? 2 : 1,
            }}
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
                    {SEGMENT_LABELS[seg.segment]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {SEGMENT_DESCRIPTIONS[seg.segment]}
                  </Typography>
                  {seg.enabled ? (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {seg.visaTypes.length} visa type(s) configured
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
              <Toggle
                checked={seg.enabled}
                onChange={(checked) => toggleSegment(seg.segment, checked)}
                label={seg.enabled ? 'Enabled' : 'Disabled'}
              />
            </Stack>
          </BaseCard>
        )
      })}
    </Stack>
  )
}
