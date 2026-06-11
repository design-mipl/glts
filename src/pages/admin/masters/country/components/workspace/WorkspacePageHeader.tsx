import { Box, Stack, Typography } from '@mui/material'
import { ClipboardCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/design-system/UIComponents'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import type { CountryMaster } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_COLORS,
  COUNTRY_STATUS_LABELS,
} from '../../config/countryProcessingConfig'

interface WorkspacePageHeaderProps {
  country: CountryMaster
  actions?: ReactNode
}

export function WorkspacePageHeader({ country, actions }: WorkspacePageHeaderProps) {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 2,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              flexShrink: 0,
            }}
          >
            <CountryFlagVisual flag={country.flag} size={24} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                {country.name}
              </Typography>
              <Badge
                label={COUNTRY_STATUS_LABELS[country.status]}
                color={COUNTRY_STATUS_COLORS[country.status]}
              />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
              <ClipboardCheck size={13} style={{ opacity: 0.55 }} />
              <Typography variant="body2" color="text.secondary">
                Country configuration workspace · {country.code} · {country.region}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        {actions ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {actions}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  )
}
