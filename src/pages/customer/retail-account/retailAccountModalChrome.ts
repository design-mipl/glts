import { applyFlow, applyMotion, applyRadius } from '@/pages/website/theme/applyFlowTheme'

/** Shared close control for retail account modals. */
export const retailModalCloseBtnSx = {
  width: 34,
  height: 34,
  display: 'grid',
  placeItems: 'center',
  appearance: 'none',
  border: `1px solid ${applyFlow.hairline}`,
  background: 'none',
  borderRadius: applyRadius.control,
  color: applyFlow.inkMuted,
  cursor: 'pointer',
  flex: '0 0 auto',
  transition: `color 150ms ${applyMotion.easeOut}, border-color 150ms ${applyMotion.easeOut}`,
  '@media (pointer: coarse)': { width: 44, height: 44 },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': { color: applyFlow.ink, borderColor: applyFlow.hairlineStrong },
  },
  '&:focus-visible': {
    outline: 'none',
    borderColor: applyFlow.accent,
    boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
  },
} as const
