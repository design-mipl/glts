import { Box, Typography, Stack } from '@mui/material'
import { PublicContainer } from '../PublicContainer'
import { featureSectionPy, landingSectionHeaderMb } from '../../pages/LandingPage/landingPageSpacing'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../theme/publicSiteTokens'
import { WorkflowZigZagConnector } from './WorkflowZigZagConnector'
import { useWorkflowRevealAnimation } from './useWorkflowRevealAnimation'
import { websiteHeadingSx } from '../../theme/websiteComponentStyles'
import { ProcessTimelineCopy, ProcessTimelineMarker } from './ProcessTimeline'
import {
  WORKFLOW_BADGE_SIZE,
  WORKFLOW_ICON_INNER,
  WORKFLOW_ICON_SIZE,
  WORKFLOW_TRACK_HEIGHT,
  getWorkflowStepXPercent,
  getWorkflowStepYPositions,
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
      <ProcessTimelineMarker
        icon={Icon}
        number={String(stepNumber).padStart(2, '0')}
        iconSize={WORKFLOW_ICON_INNER}
        containerSize={WORKFLOW_ICON_SIZE}
        numberSize={WORKFLOW_BADGE_SIZE}
        background={colors.white}
        borderColor={`rgba(${brandPrimaryGreenRgb}, 0.42)`}
        color={colors.greenBright}
        numberBackground={colors.greenBright}
        numberColor={colors.white}
        borderWidth={1.5}
        sx={{ ...(revealed && { animation: 'workflowStepGlow 0.75s ease' }), '@keyframes workflowStepGlow': { '0%': { boxShadow: 'none' }, '40%': { boxShadow: `0 0 0 7px rgba(${brandPrimaryGreenRgb}, 0.2)` }, '100%': { boxShadow: 'none' } } }}
      />
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
        maxWidth: 260,
        px: 0.75,
        mx: 'auto',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
      }}
    >
      <ProcessTimelineCopy title={title} description={description} titleSx={{ fontFamily: publicFonts.heading, color: colors.navy, mb: 1 }} descriptionSx={{ color: colors.textSecondary }} />
    </Box>
  )
}

function HorizontalWorkflowFlow({
  steps,
  stepYPositions,
  connectorVariant,
  trackHeight,
  stepWidth,
  lineVisible,
  revealedCount,
}: {
  steps: WorkflowStep[]
  stepYPositions: readonly number[]
  connectorVariant: 'desktop' | 'tablet'
  trackHeight: number
  stepWidth: number
  lineVisible: boolean
  revealedCount: number
}) {
  const textGap = 2
  const flowMinHeight =
    Math.max(...stepYPositions) + WORKFLOW_ICON_SIZE / 2 + 128

  return (
    <Box component="ol" role="list" aria-label="Workflow steps" sx={{ position: 'relative', minHeight: flowMinHeight, listStyle: 'none', m: 0, p: 0 }}>
      <Box
        component="li"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: trackHeight,
          pointerEvents: 'none',
        }}
      >
        <WorkflowZigZagConnector visible={lineVisible} trackHeight={trackHeight} stepCount={steps.length} variant={connectorVariant} />
      </Box>

      {steps.map((step, index) => (
        <Box
          key={step.title}
          component="li"
          sx={{
            listStyle: 'none',
            position: 'absolute',
            left: `${getWorkflowStepXPercent(steps.length)[index]}%`,
            top: (stepYPositions[index] ?? 42) - WORKFLOW_ICON_SIZE / 2,
            transform: 'translateX(-50%)',
            zIndex: 1,
            width: stepWidth,
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
    <Box sx={{ display: { xs: 'none', desktopMd: 'block' }, px: { desktopMd: 1 } }}>
      <HorizontalWorkflowFlow
        steps={steps}
        stepYPositions={getWorkflowStepYPositions(steps.length, 'desktop')}
        connectorVariant="desktop"
        trackHeight={WORKFLOW_TRACK_HEIGHT.desktop}
        stepWidth={260}
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
    <Box sx={{ display: { xs: 'none', desktop: 'block', desktopMd: 'none' } }}>
      <HorizontalWorkflowFlow
        steps={steps}
        stepYPositions={getWorkflowStepYPositions(steps.length, 'tablet')}
        connectorVariant="tablet"
        trackHeight={WORKFLOW_TRACK_HEIGHT.tablet}
        stepWidth={230}
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
      component="ol"
      role="list"
      aria-label="Workflow steps"
      spacing={0}
      sx={{
        display: { xs: 'flex', desktop: 'none' },
        maxWidth: 440,
        mx: 'auto',
        listStyle: 'none',
        m: 0,
        p: 0,
      }}
    >
      {steps.map((step, index) => (
        <Stack component="li" role="listitem" key={step.title} direction="row" spacing={2} alignItems="stretch" sx={{ listStyle: 'none' }}>
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
        py: featureSectionPy,
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
              ...websiteHeadingSx.h2,
              fontFamily: publicFonts.display,
              color: colors.navy,
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
