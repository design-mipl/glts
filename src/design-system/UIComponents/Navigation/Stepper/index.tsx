import {
  Stepper as MuiStepper, Step, StepLabel, StepButton,
  StepConnector, Typography, Box, useMediaQuery,
} from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'
import CheckIcon from '@mui/icons-material/Check'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import type { SxProps } from '@mui/material'

export interface StepItem {
  label: string
  description?: string
  optional?: boolean
  error?: boolean
}

export interface StepperProps {
  steps: StepItem[]
  activeStep: number
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'outlined' | 'dots'
  onStepClick?: (index: number) => void
  nonLinear?: boolean
  sx?: SxProps
}

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
}))

function StepIcon({ active, completed, error, index, variant }: {
  active: boolean
  completed: boolean
  error: boolean
  index: number
  variant: StepperProps['variant']
}) {
  const theme = useTheme()

  if (variant === 'dots') {
    return (
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: completed || active ? 'primary.main' : 'action.disabled',
          border: active ? '2px solid' : 'none',
          borderColor: 'primary.main',
          transition: 'all 200ms ease',
        }}
      />
    )
  }

  if (error) {
    return (
      <Box sx={{
        width: 28, height: 28, borderRadius: '50%',
        bgcolor: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ErrorOutlineIcon sx={{ fontSize: 16, color: '#fff' }} />
      </Box>
    )
  }

  if (completed) {
    return (
      <Box sx={{
        width: 28, height: 28, borderRadius: '50%',
        bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CheckIcon sx={{ fontSize: 16, color: '#fff' }} />
      </Box>
    )
  }

  if (active) {
    return (
      <Box sx={{
        width: 28, height: 28, borderRadius: '50%',
        bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 0 4px ${theme.palette.mode === 'dark'
          ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)'}`,
      }}>
        <Typography variant="caption" fontWeight={700} sx={{ color: '#fff', lineHeight: 1 }}>
          {index + 1}
        </Typography>
      </Box>
    )
  }

  if (variant === 'outlined') {
    return (
      <Box sx={{
        width: 28, height: 28, borderRadius: '50%',
        border: '2px solid', borderColor: 'divider',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ lineHeight: 1 }}>
          {index + 1}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      width: 28, height: 28, borderRadius: '50%',
      bgcolor: 'action.disabled', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Typography variant="caption" fontWeight={600} sx={{ color: '#fff', lineHeight: 1 }}>
        {index + 1}
      </Typography>
    </Box>
  )
}

export default function Stepper({
  steps,
  activeStep,
  orientation: orientationProp,
  variant = 'default',
  onStepClick,
  nonLinear = false,
  sx,
}: StepperProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const orientation = orientationProp ?? (isMobile ? 'vertical' : 'horizontal')

  return (
    <MuiStepper
      activeStep={activeStep}
      orientation={orientation}
      nonLinear={nonLinear}
      connector={<ColorConnector />}
      sx={{ ...sx as object }}
    >
      {steps.map((step, index) => {
        const completed = index < activeStep
        const active = index === activeStep

        const label = (
          <StepLabel
            error={step.error}
            optional={step.optional ? (
              <Typography variant="caption" color="text.secondary">Optional</Typography>
            ) : step.description ? (
              <Typography variant="caption" color="text.secondary">{step.description}</Typography>
            ) : undefined}
            StepIconComponent={() => (
              <StepIcon
                active={active}
                completed={completed}
                error={!!step.error}
                index={index}
                variant={variant}
              />
            )}
            sx={{
              '& .MuiStepLabel-label': {
                fontWeight: active ? 600 : 400,
                color: active ? 'text.primary' : 'text.secondary',
              },
            }}
          >
            {step.label}
          </StepLabel>
        )

        return (
          <Step key={index} completed={completed}>
            {onStepClick ? (
              <StepButton onClick={() => onStepClick(index)}>
                {label}
              </StepButton>
            ) : label}
          </Step>
        )
      })}
    </MuiStepper>
  )
}
