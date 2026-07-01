import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Building2, UserRound } from 'lucide-react'
import { Badge } from '@/design-system/UIComponents'
import { FORM_CONTROL } from '@/design-system/formControl'
import type { ApplicationFeePaidBy } from '@/shared/types/operationalCaseHandling'
import {
  APPLICATION_FEE_PAID_BY_OPTIONS,
  getApplicationFeePaidByLabel,
} from '@/shared/types/operationalCaseHandling'

const PAID_BY_ICONS: Record<ApplicationFeePaidBy, typeof Building2> = {
  glts: Building2,
  passenger: UserRound,
}

interface ApplicationFeePaidByFieldProps {
  value: ApplicationFeePaidBy
  readOnly?: boolean
  onChange?: (value: ApplicationFeePaidBy) => void
}

export function ApplicationFeePaidByField({
  value,
  readOnly = false,
  onChange,
}: ApplicationFeePaidByFieldProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        mt: 0.5,
        px: 1.5,
        py: 1.25,
        borderRadius: 1.5,
        border: 1,
        borderColor: 'divider',
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.03)
            : alpha(theme.palette.primary.main, 0.03),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
        useFlexGap
        flexWrap="wrap"
      >
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: FORM_CONTROL.labelFontSize,
              fontWeight: FORM_CONTROL.labelFontWeight,
              color: 'text.primary',
              lineHeight: 1.3,
            }}
          >
            Paid by
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.35 }}>
            Who settles VFS and application fees for this case
          </Typography>
        </Stack>

        {readOnly ? (
          <Badge
            label={getApplicationFeePaidByLabel(value)}
            color={value === 'glts' ? 'info' : 'neutral'}
            size="sm"
          />
        ) : (
          <Box
            role="group"
            aria-label="Paid by"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              p: '3px',
              borderRadius: FORM_CONTROL.borderRadius,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.04)}`,
            }}
          >
            {APPLICATION_FEE_PAID_BY_OPTIONS.map(option => {
              const selected = value === option.value
              const Icon = PAID_BY_ICONS[option.value]

              return (
                <Box
                  key={option.value}
                  component="button"
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange?.(option.value)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.625,
                    border: 0,
                    cursor: 'pointer',
                    minHeight: 32,
                    px: 1.5,
                    py: 0.375,
                    borderRadius: `calc(${FORM_CONTROL.borderRadius} - 3px)`,
                    fontSize: 12,
                    fontWeight: selected ? 600 : 500,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    color: selected ? 'primary.contrastText' : 'text.secondary',
                    bgcolor: selected ? 'primary.main' : 'transparent',
                    transition: 'color 150ms ease, background-color 150ms ease, box-shadow 150ms ease',
                    '&:hover': {
                      color: selected ? 'primary.contrastText' : 'text.primary',
                      bgcolor: selected ? 'primary.main' : alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  <Icon size={14} strokeWidth={selected ? 2.25 : 2} />
                  {option.label}
                </Box>
              )
            })}
          </Box>
        )}
      </Stack>
    </Box>
  )
}
