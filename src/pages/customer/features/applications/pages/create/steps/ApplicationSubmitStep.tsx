import { useMemo, useState } from 'react'
import { Box, Typography, Stack, Button, Checkbox, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx, getOutlinedButtonSx, mergeButtonSx } from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { deriveApplicationSubmitKind } from '../../../utils/applicationSubmitKind'
import { ApplicationReviewPanels } from '../../../components/ApplicationReviewPanels'
import type { CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'

interface ApplicationSubmitStepProps {
  state: ApplicationFlowState
  onSubmitted: () => void
}

export function ApplicationSubmitStep({ state, onSubmitted }: ApplicationSubmitStepProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()
  const [declared, setDeclared] = useState(false)

  const rows = state.uploadQueueRows
  const readyRows = useMemo(() => rows.filter(r => r.status !== 'processing'), [rows])
  const submitKind = useMemo(() => deriveApplicationSubmitKind(rows), [rows])

  const handleSubmit = () => {
    const refId = customerPortalService.submitApplication(submitKind, {
      applicationId: state.gltsApplicationId,
      batchId: state.gltsBatchId,
    })
    onSubmitted()
    showToast({
      title: 'Application submitted',
      description:
        submitKind === 'single'
          ? 'Your application is in the tracking lifecycle. View it from Application Management.'
          : `${refId} is ready for GLTS review.`,
      variant: 'success',
    })
    navigate(submitKind === 'single' ? `${base}/applications` : `${base}/applications/${refId}`)
  }

  const handleDraft = () => {
    showToast({
      title: 'Draft saved',
      description: 'Resume from Application Management → Draft applications.',
      variant: 'info',
    })
    navigate(`${base}/applications`)
  }

  const handleReuploadDocument = (_item: CustomerChecklistItem) => {
    showToast({
      title: 'Upload required',
      description: 'Please return to the upload step to replace the marked invalid document.',
      variant: 'info',
    })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Review & submit
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        Select a traveler from the listing to review their summary and document checklist before submission.
      </Typography>

      <ApplicationReviewPanels
        rows={rows}
        applicationId={state.gltsApplicationId || state.gltsBatchId || undefined}
        overview={{
          countryName: state.countryName,
          countryFlag: state.countryFlag,
          visaTypeLabel: state.visaTypeLabel,
          purposeLabel: state.purposeLabel,
          travelDate: state.travelDate,
          gltsApplicationId: state.gltsApplicationId || undefined,
          gltsBatchId: state.gltsBatchId || undefined,
        }}
        globalDocumentUploads={state.globalDocumentUploads}
        onReuploadDocument={handleReuploadDocument}
      />

      <FormControlLabel
        control={<Checkbox checked={declared} onChange={e => setDeclared(e.target.checked)} size="small" />}
        label={
          <Typography sx={{ fontSize: 13 }}>
            I confirm the information is accurate and understand GLTS will process this application per the agreed
            scope.
          </Typography>
        }
        sx={{ mb: 2, alignItems: 'flex-start' }}
      />

      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        <Button variant="outlined" onClick={handleDraft} sx={mergeButtonSx(getOutlinedButtonSx(), overlayFooterButtonSx)}>
          Save draft
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!declared || readyRows.length === 0}
          sx={mergeButtonSx(getPrimaryButtonSx(colors), overlayFooterButtonSx, { ml: 'auto' })}
        >
          Submit application
        </Button>
      </Stack>
    </Box>
  )
}
