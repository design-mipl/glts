import { Box, Typography, Stack } from '@mui/material'
import { PublicContainer } from '../PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../../pages/LandingPage/landingPageSpacing'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../theme/publicSiteTokens'
import { WorkflowZigZagConnector } from './WorkflowZigZagConnector'
import { useWorkflowRevealAnimation } from './useWorkflowRevealAnimation'
import {
  WORKFLOW_BADGE_SIZE,
  WORKFLOW_ICON_INNER,
  WORKFLOW_ICON_SIZE,
  WORKFLOW_STEP_X_PERCENT,
  WORKFLOW_STEP_Y_DESKTOP,
  WORKFLOW_STEP_Y_TABLET,
  WORKFLOW_TRACK_HEIGHT,
} from './workflowGeometry'
import type { WorkflowTimelineSectionProps, WorkflowStep } from './types'

function WorkflowStepIcon({
  stepNumber,
  icon: Icon,
  revealed,
}: {
  stepNumber: number
  icon: WorkflowStep['icon']
  revealed: boolean
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'scale(1)' : 'scale(0.88)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      <Box
        sx={{
          width: WORKFLOW_ICON_SIZE,
          height: WORKFLOW_ICON_SIZE,
          borderRadius: '50%',
          bgcolor: colors.white,
          border: `1.5px solid rgba(${brandPrimaryGreenRgb}, 0.42)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(revealed && {
            animation: 'workflowStepGlow 0.75s ease',
          }),
          '@keyframes workflowStepGlow': {
            '0%': {
              boxShadow: 'none',
            },
            '40%': {
              boxShadow: `0 0 0 7px rgba(${brandPrimaryGreenRgb}, 0.2)`,
            },
            '100%': {
              boxShadow: 'none',
            },
          },
        }}
      >
        <Icon size={WORKFLOW_ICON_INNER} color={colors.greenBright} strokeWidth={2} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: -6,
          right: -8,
          minWidth: WORKFLOW_BADGE_SIZE,
          height: WORKFLOW_BADGE_SIZE,
          px: 0.25,
          borderRadius: '50%',
          bgcolor: colors.greenBright,
          color: colors.white,
          fontSize: '10px',
          fontWeight: 700,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {String(stepNumber).padStart(2, '0')}
      </Box>
    </Box>
  )
}

function WorkflowStepText({
  title,
  description,
  revealed,
}: {
  title: string
  description: string
  revealed: boolean
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        maxWidth: 210,
        px: 0.75,
        mx: 'auto',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
      }}
    >
      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: { xs: '13px', md: '14px' },
          fontWeight: 700,
          color: colors.navy,
          lineHeight: 1.35,
          mb: 0.75,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '12px', md: '12.5px' },
          color: colors.textSecondary,
          lineHeight: 1.55,
        }}
      >
        {description}
      </Typography>
    </Box>
  )
}

function HorizontalWorkflowFlow({
  steps,
  stepYPositions,
  trackHeight,
  lineVisible,
  revealedCount,
}: {
  steps: WorkflowStep[]
  stepYPositions: readonly number[]
  trackHeight: number
  lineVisible: boolean
  revealedCount: number
}) {
  const textGap = 1.75
  const flowMinHeight =
    Math.max(...stepYPositions) + WORKFLOW_ICON_SIZE / 2 + 96

  return (
    <Box sx={{ position: 'relative', minHeight: flowMinHeight }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: trackHeight,
          pointerEvents: 'none',
        }}
      >
        <WorkflowZigZagConnector visible={lineVisible} trackHeight={trackHeight} />
      </Box>

      {steps.map((step, index) => (
        <Box
          key={step.title}
          sx={{
            position: 'absolute',
            left: `${WORKFLOW_STEP_X_PERCENT[index]}%`,
            top: stepYPositions[index] - WORKFLOW_ICON_SIZE / 2,
            transform: 'translateX(-50%)',
            zIndex: 1,
            width: 210,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <WorkflowStepIcon
            stepNumber={index + 1}
            icon={step.icon}
            revealed={revealedCount > index}
          />
          <Box sx={{ mt: textGap, width: '100%' }}>
            <WorkflowStepText
              title={step.title}
              description={step.description}
              revealed={revealedCount > index}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function DesktopWorkflowFlow({
  steps,
  lineVisible,
  revealedCount,
}: {
  steps: WorkflowStep[]
  lineVisible: boolean
  revealedCount: number
}) {
  return (
    <Box sx={{ display: { xs: 'none', lg: 'block' }, px: { lg: 1 } }}>
      <HorizontalWorkflowFlow
        steps={steps}
        stepYPositions={WORKFLOW_STEP_Y_DESKTOP}
        trackHeight={WORKFLOW_TRACK_HEIGHT.desktop}
        lineVisible={lineVisible}
        revealedCount={revealedCount}
      />
    </Box>
  )
}

function TabletWorkflowFlow({
  steps,
  lineVisible,
  revealedCount,
}: {
  steps: WorkflowStep[]
  lineVisible: boolean
  revealedCount: number
}) {
  return (
    <Box sx={{ display: { xs: 'none', md: 'block', lg: 'none' } }}>
      <HorizontalWorkflowFlow
        steps={steps}
        stepYPositions={WORKFLOW_STEP_Y_TABLET}
        trackHeight={WORKFLOW_TRACK_HEIGHT.tablet}
        lineVisible={lineVisible}
        revealedCount={revealedCount}
      />
    </Box>
  )
}

function MobileWorkflowFlow({
  steps,
  lineVisible,
  revealedCount,
}: {
  steps: WorkflowStep[]
  lineVisible: boolean
  revealedCount: number
}) {
  return (
    <Stack
      spacing={0}
      sx={{
        display: { xs: 'flex', md: 'none' },
        maxWidth: 440,
        mx: 'auto',
      }}
    >
      {steps.map((step, index) => (
        <Stack key={step.title} direction="row" spacing={2} alignItems="stretch">
          <Stack alignItems="center" sx={{ width: WORKFLOW_ICON_SIZE + 8, flexShrink: 0 }}>
            <WorkflowStepIcon
              stepNumber={index + 1}
              icon={step.icon}
              revealed={revealedCount > index}
            />
            {index < steps.length - 1 && (
              <Box
                aria-hidden
                sx={{
                  width: 0,
                  flex: 1,
                  minHeight: 32,
                  borderLeft: `1.5px dashed rgba(${brandPrimaryGreenRgb}, 0.45)`,
                  opacity: lineVisible && revealedCount > index ? 1 : 0,
                  my: 1,
                  transition: 'opacity 0.4s ease',
                }}
              />
            )}
          </Stack>
          <Box
            sx={{
              pb: index < steps.length - 1 ? 3.5 : 0,
              pt: 0.5,
              flex: 1,
              textAlign: 'left',
            }}
          >
            <WorkflowStepText
              title={step.title}
              description={step.description}
              revealed={revealedCount > index}
            />
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

export function WorkflowTimelineSection({
  id,
  sectionLabel,
  heading,
  subheading,
  steps,
}: WorkflowTimelineSectionProps) {
  const colors = usePublicBrandColors()
  const { sectionRef, lineVisible, revealedCount } = useWorkflowRevealAnimation(steps.length)

  return (
    <Box
      component="section"
      id={id}
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            maxWidth: 640,
            mb: landingSectionHeaderMb,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1.5,
            }}
          >
            {sectionLabel}
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            {heading}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            {subheading}
          </Typography>
        </Box>

        <Box ref={sectionRef} sx={{ mt: { xs: 1, md: 2 } }}>
          <DesktopWorkflowFlow steps={steps} lineVisible={lineVisible} revealedCount={revealedCount} />
          <TabletWorkflowFlow steps={steps} lineVisible={lineVisible} revealedCount={revealedCount} />
          <MobileWorkflowFlow steps={steps} lineVisible={lineVisible} revealedCount={revealedCount} />
        </Box>
      </PublicContainer>
    </Box>
  )
}
