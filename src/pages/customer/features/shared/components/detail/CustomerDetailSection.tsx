import { Box, Divider, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export interface CustomerDetailSectionProps {
  title: string
  action?: ReactNode
  children: ReactNode
  /** Show divider below section (default true) */
  divider?: boolean
  id?: string
}

export function CustomerDetailSection({
  title,
  action,
  children,
  divider = true,
  id,
}: CustomerDetailSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="section" id={id}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        sx={{ mb: 1.5 }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: colors.textMuted,
          }}
        >
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
      {divider && <Divider sx={{ my: 2.5, borderColor: colors.border }} />}
    </Box>
  )
}
