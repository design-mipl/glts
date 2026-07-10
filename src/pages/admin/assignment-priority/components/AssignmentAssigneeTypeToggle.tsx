import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Building2, UserRound } from 'lucide-react'
import { FORM_CONTROL } from '@/design-system/formControl'
import {
  ASSIGNMENT_ASSIGNEE_TYPE_OPTIONS,
  type AssignmentAssigneeType,
} from '../config/assignmentActionConfig'

const ASSIGNEE_ICONS: Record<AssignmentAssigneeType, typeof UserRound> = {
  user: UserRound,
  vendor: Building2,
}

interface AssignmentAssigneeTypeToggleProps {
  value: AssignmentAssigneeType
  onChange: (value: AssignmentAssigneeType) => void
}

export function AssignmentAssigneeTypeToggle({
  value,
  onChange,
}: AssignmentAssigneeTypeToggleProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        minHeight: FORM_CONTROL.heightSm,
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: FORM_CONTROL.labelFontSize,
          fontWeight: FORM_CONTROL.labelFontWeight,
          color: 'text.primary',
          whiteSpace: 'nowrap',
        }}
      >
        Assign to
      </Typography>

      <Box
        role="group"
        aria-label="Assign to user or vendor"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          p: '2px',
          borderRadius: FORM_CONTROL.borderRadius,
          border: 1,
          borderColor: 'divider',
          bgcolor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.common.black, 0.03),
        }}
      >
        {ASSIGNMENT_ASSIGNEE_TYPE_OPTIONS.map(option => {
          const selected = value === option.value
          const Icon = ASSIGNEE_ICONS[option.value]

          return (
            <Box
              key={option.value}
              component="button"
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                border: 0,
                cursor: 'pointer',
                minHeight: 28,
                px: 1.25,
                py: 0.25,
                borderRadius: `calc(${FORM_CONTROL.borderRadius} - 2px)`,
                fontSize: 12,
                fontWeight: selected ? 600 : 500,
                lineHeight: 1.2,
                color: selected ? 'primary.main' : 'text.secondary',
                bgcolor: selected ? 'background.paper' : 'transparent',
                boxShadow: selected ? `0 1px 2px ${alpha(theme.palette.common.black, 0.08)}` : 'none',
                transition: 'color 150ms ease, background-color 150ms ease, box-shadow 150ms ease',
                '&:hover': {
                  color: selected ? 'primary.main' : 'text.primary',
                },
              }}
            >
              <Icon size={13} strokeWidth={selected ? 2.25 : 2} />
              {option.label}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
