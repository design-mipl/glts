import { useMemo, useState } from 'react'
import { Box, Typography, Stack, Button, Checkbox, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx, getOutlinedButtonSx, mergeButtonSx } from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import {
  isAdminFlowPolicy,
  isWebsiteFlowPolicy,
  requiresFieldValidation,
  useApplicationFlowPolicy,
} from '../../../context/ApplicationFlowPolicyContext'
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
  const { policy, listingPath } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const isAdmin = isAdminFlowPolicy(policy)
  const isWebsite = isWebsiteFlowPolicy(policy)
  const [declared, setDeclared] = useState(false)

  const rows = state.uploadQueueRows
  const readyRows = useMemo(() => rows.filter(r => r.status !== 'processing'), [rows])
  const submitKind = useMemo(() => deriveApplicationSubmitKind(rows), [rows])

  const cancelListingPath = listingPath || (isWebsite ? '/countries' : `${base}/applications`)
  const postSubmitBase = isWebsite ? '/retail' : base

  const handleSubmit = () => {
    if (isAdmin) {
      const { id, kind } = marineApplicationAdminService.createAndSubmitFromFlow(state)
      onSubmitted()
      showToast({
        title: 'Application created',
        description:
          kind === 'single'
            ? `${id} is now in the marine applications listing.`
            : `${id} batch is now in the marine applications listing.`,
        variant: 'success',
      })
      navigate(cancelListingPath)
      return
    }

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
    navigate(submitKind === 'single' ? `${postSubmitBase}/applications` : `${postSubmitBase}/applications/${refId}`)
  }

  const handleDraft = () => {
    showToast({
      title: 'Draft saved',
      description: isAdmin
        ? 'Resume from Marine applications when draft persistence is enabled.'
        : isWebsite
          ? 'Resume from the Apply flow when you return.'
          : 'Resume from Application Management → Draft applications.',
      variant: 'info',
    })
    navigate(cancelListingPath)
  }

  const handleReuploadDocument = (_item: CustomerChecklistItem) => {
    showToast({
      title: 'Upload required',
      description: 'Please return to the upload step to replace the marked invalid document.',
      variant: 'info',
    })
  }

  const submitDisabled =
    (strict && (!declared || readyRows.length === 0)) ||
    (isAdmin && !state.corporateAccountId)

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Review & submit
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        {isAdmin
          ? 'Review the application summary. Fields may be incomplete; submit when ready to add the record to marine operations.'
          : isWebsite
            ? 'Review each traveler summary and document checklist before submitting your application.'
            : 'Select a traveler from the listing to review their summary and document checklist before submission.'}
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
          issuedPassportLocationLabel:
            state.issuedPassportState || state.issuedPassportLocationId || undefined,
          placeOfResidenceLabel: state.placeOfResidence || undefined,
          jurisdiction: state.jurisdiction,
          companyName: state.companyName || undefined,
          gltsApplicationId: state.gltsApplicationId || undefined,
          gltsBatchId: state.gltsBatchId || undefined,
        }}
        globalDocumentUploads={state.globalDocumentUploads}
        onReuploadDocument={handleReuploadDocument}
      />

      {strict ? (
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
      ) : null}

      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        {!isAdmin ? (
          <Button
            variant="outlined"
            onClick={handleDraft}
            sx={mergeButtonSx(getOutlinedButtonSx(), overlayFooterButtonSx)}
          >
            Save draft
          </Button>
        ) : null}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitDisabled}
          sx={mergeButtonSx(getPrimaryButtonSx(colors), overlayFooterButtonSx, { ml: 'auto' })}
        >
          {isAdmin ? 'Create application' : 'Submit application'}
        </Button>
      </Stack>
    </Box>
  )
}
