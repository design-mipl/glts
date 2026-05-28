import { Stack, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
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
    <Stack direction="row" justifyContent="flex-end" alignItems="center" flexWrap="wrap" gap={1.5} sx={{ mt: 3 }}>
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
