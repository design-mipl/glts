import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { UI_KIT_SPACING } from '../../dashboard-ui-kit'
import { StatusBadge } from '../StatusBadge'
import type { DashboardStatusTone } from '../../types'

export type JourneyFlowStageStatus = 'completed' | 'active' | 'pending' | 'error'

export interface JourneyFlowStage {
  id: string
  label: string
  status: JourneyFlowStageStatus
  detail?: string
}

export interface JourneyFlowProps {
  stages: JourneyFlowStage[]
  /** Current tracking / meta line under the flow. */
  meta?: string
}

function statusToTone(status: JourneyFlowStageStatus): DashboardStatusTone {
  switch (status) {
    case 'completed':
      return 'success'
    case 'active':
      return 'primary'
    case 'error':
      return 'error'
    case 'pending':
    default:
      return 'neutral'
  }
}

/**
 * Horizontal stage journey — presentational.
 * Uses Dashboard UI Kit spacing/status language on top of DS tokens.
 */
export function JourneyFlow({ stages, meta }: JourneyFlowProps) {
  const theme = useTheme()

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={0}
        sx={{
          overflowX: 'auto',
          pb: UI_KIT_SPACING.field,
          gap: 0,
        }}
      >
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1
          const connectorColor =
            stage.status === 'completed' || stage.status === 'active'
              ? theme.palette.primary.main
              : theme.palette.divider

          return (
            <Box
              key={stage.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                minWidth: theme.spacing(14),
                flex: isLast ? '0 0 auto' : 1,
              }}
            >
              <Stack alignItems="center" spacing={UI_KIT_SPACING.field} sx={{ width: '100%' }}>
                <Box
                  sx={{
                    width: theme.spacing(1.5),
                    height: theme.spacing(1.5),
                    borderRadius: tokens.borderRadius.full,
                    bgcolor:
                      stage.status === 'pending'
                        ? theme.palette.action.disabledBackground
                        : stage.status === 'error'
                          ? theme.palette.error.main
                          : stage.status === 'active'
                            ? theme.palette.primary.main
                            : theme.palette.success.main,
                    boxShadow: stage.status === 'active' ? theme.shadows[2] : undefined,
                  }}
                  aria-hidden
                />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                  textAlign="center"
                >
                  {stage.label}
                </Typography>
                <StatusBadge label={stage.status} tone={statusToTone(stage.status)} size="sm" />
                {stage.detail ? (
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    {stage.detail}
                  </Typography>
                ) : null}
              </Stack>
              {!isLast ? (
                <Box
                  sx={{
                    flex: 1,
                    height: theme.spacing(0.25),
                    bgcolor: connectorColor,
                    mt: theme.spacing(0.75),
                    mx: UI_KIT_SPACING.field,
                    minWidth: theme.spacing(2),
                    alignSelf: 'flex-start',
                  }}
                  aria-hidden
                />
              ) : null}
            </Box>
          )
        })}
      </Stack>
      {meta ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: UI_KIT_SPACING.field }}>
          {meta}
        </Typography>
      ) : null}
    </Box>
  )
}
