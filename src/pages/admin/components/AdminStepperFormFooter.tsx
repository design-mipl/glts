import { Box, Stack } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { tokens } from '@/design-system/tokens'

export interface AdminStepperFormFooterProps {
  activeStep: number
  isLastStep: boolean
  onCancel?: () => void
  cancelLabel?: string
  onDraft?: () => void
  draftLabel?: string
  onBack?: () => void
  onNext?: () => void | boolean
  onSubmit?: () => void
  nextLabel?: string
  submitLabel?: string
  loading?: boolean
  disabled?: boolean
}

/**
 * Stepper form footer — Cancel/Draft (optional) on the left; Back / Next / Submit on the right.
 * Matches AdminStepperFormShell + AdminFullPageFormFooter action hierarchy.
 */
export function AdminStepperFormFooter({
  activeStep,
  isLastStep,
  onCancel,
  cancelLabel = 'Cancel',
  onDraft,
  draftLabel = 'Save draft',
  onBack,
  onNext,
  onSubmit,
  nextLabel = 'Next',
  submitLabel = 'Submit',
  loading = false,
  disabled = false,
}: AdminStepperFormFooterProps) {
  const isDisabled = disabled || loading

  const handleNext = () => {
    if (!onNext) return
    const result = onNext()
    if (result === false) return
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: tokens.spacing[3],
      }}
    >
      {onCancel ? (
        <Button
          variant="neutral"
          onClick={onCancel}
          disabled={isDisabled}
          fullWidth
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {cancelLabel}
        </Button>
      ) : (
        <Box />
      )}

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ flexWrap: 'wrap', justifyContent: { xs: 'stretch', sm: 'flex-end' }, gap: 1 }}
      >
        {onDraft ? (
          <Button
            variant="soft"
            color="primary"
            onClick={onDraft}
            disabled={isDisabled}
            fullWidth
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {draftLabel}
          </Button>
        ) : null}
        <Button
          label="Back"
          variant="neutral"
          disabled={isDisabled || activeStep === 0}
          onClick={onBack}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        />
        {!isLastStep ? (
          <Button
            label={nextLabel}
            variant="contained"
            onClick={handleNext}
            disabled={isDisabled}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />
        ) : (
          <Button
            label={submitLabel}
            variant="contained"
            onClick={onSubmit}
            disabled={isDisabled}
            loading={loading}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />
        )}
      </Stack>
    </Box>
  )
}
