import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export interface ExecutiveSectionHeaderProps {
  title: string
  description?: string
  /** Optional count badge shown beside the title (e.g. segment or row count). */
  count?: number
  actionLabel?: string
  onAction?: () => void
  action?: ReactNode
}

export function ExecutiveSectionHeader({
  title,
  description,
  count,
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
      sx={{ mb: 0 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy, lineHeight: 1.2 }}>
            {title}
          </Typography>
          {count != null ? (
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 22,
                height: 22,
                px: 0.75,
                borderRadius: '999px',
                bgcolor: alpha(colors.navy, 0.08),
                color: colors.navy,
              }}
            >
              <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>
                {count}
              </Typography>
            </Box>
          ) : null}
        </Stack>
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
