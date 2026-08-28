import { Box, Button, Stack, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website-v2/theme/applyFlowTheme'

interface StepShellProps {
  title: string
  /** Shorter headline swapped in below the `md` breakpoint (428px) — use when `title` wraps awkwardly on small phones. */
  mobileTitle?: string
  /** Helper under the title — string or rich node (e.g. accented date). */
  helperText?: ReactNode
  children: ReactNode
  onBack?: () => void
  onContinue?: () => void
  continueLabel?: string
  backLabel?: string
  continueDisabled?: boolean
  hideContinue?: boolean
  titleAccessory?: ReactNode
  /** Max width for title + body (footer stays full card width). */
  contentMaxWidth?: number
  /** Floor for the scrollable body so short steps still fill the card. */
  contentMinHeight?: number | string | Record<string, number | string>
  /** Optional action rendered left of Continue (e.g. Add travelers). */
  footerEndAction?: ReactNode
  /** Trust / policy microcopy under the footer actions. */
  footerCaption?: ReactNode
}

/**
 * Retail step content chrome — title top, body scrolls, actions pinned bottom.
 *
 * Hierarchy is carried by type scale and alignment rather than by nesting the step in
 * another card: the title is left-aligned slab display, the helper is a single quiet line,
 * and the only saturated element on the step is the gold Continue button.
 */
export function StepShell({
  title,
  mobileTitle,
  helperText,
  children,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  backLabel = 'Back',
  continueDisabled = false,
  hideContinue = false,
  titleAccessory,
  contentMaxWidth = 720,
  contentMinHeight,
  footerEndAction,
  footerCaption,
}: StepShellProps) {
  const titleSx = {
    fontFamily: applyFont.display,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    color: applyFlow.ink,
    m: 0,
  } as const

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flex: '0 0 auto',
          width: '100%',
          maxWidth: contentMaxWidth,
          pr: { xs: 0, md: '210px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: helperText ? 1.25 : 3.5,
          }}
        >
          {mobileTitle ? (
            <>
              <Typography sx={{ ...titleSx, display: { xs: 'block', md: 'none' }, fontSize: 20 }}>
                {mobileTitle}
              </Typography>
              <Typography sx={{ ...titleSx, display: { xs: 'none', md: 'block' }, fontSize: 23 }}>
                {title}
              </Typography>
            </>
          ) : (
            <Typography sx={{ ...titleSx, fontSize: { xs: 20, md: 23 } }}>{title}</Typography>
          )}
          {titleAccessory}
        </Box>
        {helperText ? (
          <Typography
            component="div"
            sx={{
              fontFamily: applyFont.body,
              fontSize: 13.5,
              color: applyFlow.inkMuted,
              mb: 3.5,
              lineHeight: 1.5,
              maxWidth: '68ch',
            }}
          >
            {helperText}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          flex: '1 1 auto',
          width: '100%',
          maxWidth: contentMaxWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          textAlign: 'left',
          minHeight: contentMinHeight ?? 0,
          pt: 0.5,
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          // Quiet scrollbar — the flow card is an instrument, not a document viewer.
          scrollbarWidth: 'thin',
          scrollbarColor: `${applyFlow.hairlineStrong} transparent`,
        }}
      >
        {children}
      </Box>

      {!hideContinue && onContinue ? (
        <Box
          sx={{
            flex: '0 0 auto',
            width: 'auto',
            mt: 'auto',
            // Full-bleed across the content pane so the action bar terminates the panel
            // rather than floating as one more block inside it.
            mx: { xs: -4, md: -7 },
            px: { xs: 4, md: 7 },
            pt: 3.5,
            borderTop: `1px solid ${applyFlow.hairlineSoft}`,
            bgcolor: applyFlow.surface,
            zIndex: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="nowrap"
            gap={3}
            sx={{ width: '100%', textAlign: 'left' }}
          >
            {onBack ? (
              <Button variant="text" onClick={onBack} sx={{ ...getQuietButtonSx(), px: 4, py: 2, minHeight: 44 }}>
                {backLabel}
              </Button>
            ) : (
              <Box />
            )}
            <Stack direction="row" alignItems="center" gap={3} flexWrap="wrap">
              {footerEndAction}
              <Button
                variant="contained"
                disableElevation
                endIcon={
                  <ArrowRight
                    size={16}
                    // Arrow nudges forward on hover — confirms direction of travel.
                    style={{ transition: `transform 180ms ${applyMotion.easeOut}` }}
                  />
                }
                onClick={onContinue}
                disabled={continueDisabled}
                sx={{
                  ...getAccentButtonSx(),
                  px: 5,
                  py: 2.5,
                  minHeight: 44,
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover .MuiButton-endIcon svg': { transform: 'translateX(3px)' },
                  },
                }}
              >
                {continueLabel}
              </Button>
            </Stack>
          </Stack>
          {footerCaption ? (
            <Typography
              sx={{
                mt: 2,
                fontFamily: applyFont.body,
                fontSize: 12,
                color: applyFlow.inkFaint,
                textAlign: 'center',
                lineHeight: 1.45,
              }}
            >
              {footerCaption}
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}
