import { Box } from '@mui/material'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { WORKFLOW_ZIGZAG_PATH, WORKFLOW_ZIGZAG_VIEWBOX } from './workflowGeometry'

interface WorkflowZigZagConnectorProps {
  visible: boolean
  trackHeight: number
}

/** Thin dashed zig-zag connector through alternating step icon centers. */
export function WorkflowZigZagConnector({ visible, trackHeight }: WorkflowZigZagConnectorProps) {
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
        d={WORKFLOW_ZIGZAG_PATH}
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
