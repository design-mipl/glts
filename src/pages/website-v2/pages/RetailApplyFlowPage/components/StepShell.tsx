import { Box, Button, Stack, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  getOutlinedButtonSx,
  getPrimaryButtonSx,
  mergeButtonSx,
  usePublicBrandColors,
} from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'
import { getPressableSx } from '@/pages/website-v2/theme/retailFlowTokens'

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

/** Retail step content chrome — title top, body scrolls, actions pinned bottom. */
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
  const colors = usePublicBrandColors()

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
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          flex: '0 0 auto',
          width: '100%',
          maxWidth: contentMaxWidth,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: helperText ? 0.5 : 2.5,
          }}
        >
          {mobileTitle ? (
            <>
              <Typography
                sx={{
                  display: { xs: 'block', md: 'none' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontSize: 20,
                  color: colors.navy,
                  m: 0,
                }}
              >
                {mobileTitle}
              </Typography>
              <Typography
                sx={{
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontSize: 22,
                  color: colors.navy,
                  m: 0,
                }}
              >
                {title}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: { xs: 20, md: 22 },
                color: colors.navy,
                m: 0,
              }}
            >
              {title}
            </Typography>
          )}
          {titleAccessory}
        </Box>
        {helperText ? (
          <Typography
            component="div"
            sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5, lineHeight: 1.5 }}
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
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          textAlign: 'left',
          minHeight: 0,
          pt: 0.5,
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </Box>

      {!hideContinue && onContinue ? (
        <Box
          sx={{
            flex: '0 0 auto',
            width: '100%',
            mt: 'auto',
            pt: 2,
            borderTop: `1px solid ${colors.border}`,
            bgcolor: colors.white,
            zIndex: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="nowrap"
            gap={1.5}
            sx={{ width: '100%', textAlign: 'left' }}
          >
            {onBack ? (
              <Button
                variant="outlined"
                onClick={onBack}
                sx={mergeButtonSx(getOutlinedButtonSx(), overlayFooterButtonSx, getPressableSx())}
              >
                {backLabel}
              </Button>
            ) : (
              <Box />
            )}
            <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
              {footerEndAction}
              <Button
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                onClick={onContinue}
                disabled={continueDisabled}
                sx={mergeButtonSx(getPrimaryButtonSx(colors), overlayFooterButtonSx, getPressableSx())}
              >
                {continueLabel}
              </Button>
            </Stack>
          </Stack>
          {footerCaption ? (
            <Typography
              sx={{
                mt: 1.25,
                fontSize: 12,
                color: colors.textMuted,
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
