import { Stack, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { getPrimaryButtonSx, getOutlinedButtonSx, mergeButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'

interface FlowStepActionsProps {
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  secondaryLabel?: string
  onSecondary?: () => void
}

export function FlowStepActions({
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  secondaryLabel,
  onSecondary,
}: FlowStepActionsProps) {
  const colors = usePublicBrandColors()

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      flexWrap="wrap"
      gap={1.5}
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 5,
        mt: 2,
        pt: { xs: 2, md: 2.5 },
        pb: { xs: 2, md: 2.5 },
        mx: { xs: -2, md: -3 },
        mb: { xs: -2, md: -3 },
        px: { xs: 2, md: 3 },
        bgcolor: 'background.paper',
        borderTop: `${BORDER_WIDTH.thin} solid`,
        borderColor: 'divider',
        borderBottomLeftRadius: BORDER_RADIUS.lg,
        borderBottomRightRadius: BORDER_RADIUS.lg,
      }}
    >
      <Stack direction="row" spacing={1}>
        {secondaryLabel && onSecondary && (
          <Button variant="outlined" onClick={onSecondary} sx={mergeButtonSx(getOutlinedButtonSx(), overlayFooterButtonSx)}>
            {secondaryLabel}
          </Button>
        )}
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
  )
}
