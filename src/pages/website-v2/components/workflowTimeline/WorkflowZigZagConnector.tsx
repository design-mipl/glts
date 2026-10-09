import { Box } from '@mui/material'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { getWorkflowZigZagPath, WORKFLOW_ZIGZAG_VIEWBOX } from './workflowGeometry'

interface WorkflowZigZagConnectorProps {
  visible: boolean
  trackHeight: number
  stepCount: number
  variant: 'desktop' | 'tablet'
}

/** Thin dashed zig-zag connector through alternating step icon centers. */
export function WorkflowZigZagConnector({ visible, trackHeight, stepCount, variant }: WorkflowZigZagConnectorProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="svg"
      aria-hidden
      viewBox={WORKFLOW_ZIGZAG_VIEWBOX}
      preserveAspectRatio="none"
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: trackHeight,
        width: '100%',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.45s ease',
      }}
    >
      <path
        d={getWorkflowZigZagPath(stepCount, variant)}
        fill="none"
        stroke={colors.greenBright}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 7"
        opacity={0.75}
      />
    </Box>
  )
}
