import { Box, Divider, Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { BaseCard, Button, Stepper } from '@/design-system/UIComponents'
import type { BreadcrumbItem, StepItem } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from './AdminFormSectionsLayout'
import { AdminRecordPageChrome } from './AdminRecordPageChrome'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import { ADMIN_STEPPER_FORM_LAYOUT } from './adminOverlayFormLayout'
import type { AdminFullPageFormSection } from './AdminFullPageFormShell'

export interface AdminStepperFormStep {
  id: string
  label: string
  description?: string
  sections?: AdminFullPageFormSection[]
  review?: ReactNode
}

export interface AdminStepperFormShellProps {
  breadcrumbs: BreadcrumbItem[]
  steps: AdminStepperFormStep[]
  activeStep: number
  onActiveStepChange: (step: number) => void
  onStepClick?: (index: number) => void
  /** Replaces default Back / Next / Submit footer when provided */
  footer?: ReactNode
  onNext?: () => void
  onSubmit?: () => void
}

/**
 * Breadcrumb + back · stepper · divider · section cards · divider · step footer.
 */
export function AdminStepperFormShell({
  breadcrumbs,
  steps,
  activeStep,
  onActiveStepChange,
  onStepClick,
  footer,
  onNext,
  onSubmit,
}: AdminStepperFormShellProps) {
  const current = steps[activeStep]
  const isLast = activeStep === steps.length - 1
  const { shellPaddingX } = ADMIN_FULL_PAGE_FORM_LAYOUT

  const stepperSteps: StepItem[] = steps.map((step) => ({
    label: step.label,
    description: step.description,
  }))

  const handleStepClick = (index: number) => {
    if (onStepClick) {
      onStepClick(index)
      return
    }
    if (index <= activeStep) {
      onActiveStepChange(index)
    }
  }

  const stepBody = current.review ? (
    current.review
  ) : current.sections ? (
    <AdminFormSectionsLayout sections={current.sections} variant="page" />
  ) : null

  return (
    <AdminRecordPageChrome breadcrumbs={breadcrumbs}>
      <BaseCard sx={{ overflow: 'hidden' }}>
        <Box sx={{ px: shellPaddingX, pt: shellPaddingX, pb: 2 }}>
          <Stepper steps={stepperSteps} activeStep={activeStep} onStepClick={handleStepClick} />
        </Box>

        <Divider />

        <Box sx={{ px: shellPaddingX, py: ADMIN_STEPPER_FORM_LAYOUT.contentPaddingY }}>
          {stepBody}
        </Box>

        <Divider />

        <Box sx={{ px: shellPaddingX, py: 2 }}>
          {footer ?? (
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              <Button
                label="Back"
                variant="outlined"
                color="secondary"
                disabled={activeStep === 0}
                onClick={() => onActiveStepChange(Math.max(0, activeStep - 1))}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              />
              {!isLast ? (
                <Button
                  label="Next"
                  variant="contained"
                  onClick={() => {
                    onNext?.()
                    onActiveStepChange(Math.min(steps.length - 1, activeStep + 1))
                  }}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
              ) : (
                <Button
                  label="Submit"
                  variant="contained"
                  onClick={onSubmit}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
              )}
            </Stack>
          )}
        </Box>
      </BaseCard>
    </AdminRecordPageChrome>
  )
}
