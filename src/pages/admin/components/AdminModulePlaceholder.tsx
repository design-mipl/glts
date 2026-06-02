import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ArrowLeft, Construction } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { AdminPageHeader } from './AdminPageHeader'

export interface AdminModulePlaceholderProps {
  eyebrow?: string
  title: string
  description?: string
  returnHref?: string
  returnLabel?: string
}

export function AdminModulePlaceholder({
  eyebrow,
  title,
  description = 'This module is under development.',
  returnHref = '/admin',
  returnLabel = 'Back to Admin dashboard',
}: AdminModulePlaceholderProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: 'min(420px, calc(100vh - 120px))', md: 'min(480px, calc(100vh - 120px))' },
      }}
    >
      <AdminPageHeader eyebrow={eyebrow} title={title} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pb: { xs: 3, md: 4 },
        }}
      >
        <BaseCard
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            p: { xs: 3, sm: 3.5 },
            boxShadow: 'none',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.text.primary, 0.02),
          }}
        >
          <Stack alignItems="center" spacing={2} textAlign="center">
            <Badge label="In development" color="neutral" size="sm" variant="soft" />

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
              }}
            >
              <Construction size={24} strokeWidth={1.75} />
            </Box>

            <Stack spacing={0.75} alignItems="center">
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Coming soon
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.65, maxWidth: 320 }}
              >
                {description}
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              size="sm"
              href={returnHref}
              label={returnLabel}
              startIcon={<ArrowLeft size={14} />}
              sx={{ mt: 0.5 }}
            />
          </Stack>
        </BaseCard>
      </Box>
    </Box>
  )
}
