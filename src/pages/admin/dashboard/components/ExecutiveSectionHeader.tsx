import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export interface ExecutiveSectionHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  action?: ReactNode
}

export function ExecutiveSectionHeader({
  title,
  description,
  actionLabel = 'View queue',
  onAction,
  action,
}: ExecutiveSectionHeaderProps) {
  const colors = usePublicBrandColors()

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      spacing={1}
      sx={{ mb: 2 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy, lineHeight: 1.2 }}>
          {title}
        </Typography>
        {description ? (
          <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.textSecondary, maxWidth: 640 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ??
        (onAction ? (
          <Button
            label={actionLabel}
            variant="text"
            size="sm"
            endIcon={<ArrowRight size={14} />}
            onClick={onAction}
          />
        ) : null)}
    </Stack>
  )
}
