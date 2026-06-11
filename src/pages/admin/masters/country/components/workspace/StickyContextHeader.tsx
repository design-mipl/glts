import { Box, Stack, Typography } from '@mui/material'
import { ChevronRight, Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/design-system/UIComponents'
import { formatConfigNodePath } from '@/shared/utils/countryConfigValidation'
import type { CountryMaster } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_COLORS,
  COUNTRY_STATUS_LABELS,
} from '../../config/countryProcessingConfig'

interface StickyContextHeaderProps {
  country: CountryMaster
  activeNode: string
  segmentLocked?: boolean
  actions?: ReactNode
}

export function StickyContextHeader({
  country,
  activeNode,
  segmentLocked,
  actions,
}: StickyContextHeaderProps) {
  const pathLabel = formatConfigNodePath(country, activeNode)
  const segments = pathLabel.split(' > ')

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        px: { xs: 2, md: 3 },
        py: 1.5,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            {segments.map((part, index) => (
              <Stack key={`${part}-${index}`} direction="row" alignItems="center" spacing={0.5}>
                {index > 0 ? (
                  <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                ) : null}
                <Typography
                  variant="body2"
                  fontWeight={index === segments.length - 1 ? 600 : 400}
                  color={index === segments.length - 1 ? 'text.primary' : 'text.secondary'}
                  sx={{ lineHeight: 1.4 }}
                >
                  {part}
                </Typography>
              </Stack>
            ))}
            {segmentLocked ? <Lock size={14} style={{ opacity: 0.6 }} /> : null}
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <Badge
            label={COUNTRY_STATUS_LABELS[country.status]}
            color={COUNTRY_STATUS_COLORS[country.status]}
          />
          {actions}
        </Stack>
      </Stack>
    </Box>
  )
}
