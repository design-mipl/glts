import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from './executiveDashboardTokens'

export interface ExecutiveCompactHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  filters?: ReactNode
}

export function ExecutiveCompactHeader({
  eyebrow,
  title,
  subtitle,
  filters,
}: ExecutiveCompactHeaderProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.default',
        pb: 2,
        mb: 0.5,
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          {eyebrow ? (
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: colors.greenDark,
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 24 }, color: colors.navy, lineHeight: 1.15 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.textSecondary, maxWidth: 720 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {filters ? (
          <Box sx={{ ...executiveCardLevel2Sx(colors), p: { xs: 1.25, sm: 1.5 } }}>
            {filters}
          </Box>
        ) : null}
      </Stack>
    </Box>
  )
}
