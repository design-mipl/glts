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

interface StepShellProps {
  title: string
  /** Shorter headline swapped in below the `md` breakpoint (428px) — use when `title` wraps awkwardly on small phones. */
  mobileTitle?: string
  helperText?: string
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
  /** Optional action rendered left of Continue (e.g. Add travelers). */
  footerEndAction?: ReactNode
}

/** Retail step content chrome — centered body, actions pinned to card bottom. */
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
  footerEndAction,
}: StepShellProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        minHeight: { xs: 'auto', md: 0 },
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
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontSize: 26,
                  color: colors.navy,
                  m: 0,
                }}
              >
                {mobileTitle}
              </Typography>
              <Typography
                sx={{
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontSize: 32,
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
                fontWeight: 900,
                letterSpacing: '-0.02em',
                fontSize: { xs: 26, md: 32 },
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
          <Typography sx={{ fontSize: 14, color: colors.textSecondary, mb: 3, lineHeight: 1.5 }}>
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
          textAlign: 'left',
          minHeight: 0,
          pt: 2.0,
        }}
      >
        {children}
      </Box>

      {!hideContinue && onContinue ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="nowrap"
          gap={1.5}
          sx={{
            flex: '0 0 auto',
            width: '100%',
            mt: 'auto',
            pt: 2.5,
            borderTop: `1px solid ${colors.border}`,
            bgcolor: colors.white,
            textAlign: 'left',
          }}
        >
          {onBack ? (
            <Button
              variant="outlined"
              onClick={onBack}
              sx={mergeButtonSx(getOutlinedButtonSx(), overlayFooterButtonSx)}
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
              sx={mergeButtonSx(getPrimaryButtonSx(colors), overlayFooterButtonSx)}
            >
              {continueLabel}
            </Button>
          </Stack>
        </Stack>
      ) : null}
    </Box>
  )
}
