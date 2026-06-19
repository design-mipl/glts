import { useMemo, useState } from 'react'
import { Box, Typography, Card, Stack, Button, Grid, Checkbox, FormControlLabel } from '@mui/material'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { CustomerDocumentChecklist } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { defaultChecklist } from '../../../../data/applicationFlowData'
import { getTravelDateFeasibilityForOffering, offeringRequiresJurisdictionSelection } from '@/shared/services/countryMasterService'
import {
  getDocumentWorkspaceItems,
  getRequirementPreviewCards,
} from '../../../../data/singleApplicationFlowData'
import { TravelDateFeasibilityCard } from '../../../../components/create/TravelDateFeasibilityCard'
interface SingleApplicationReviewStepProps {
  state: ApplicationFlowState
  onBack: () => void
  onSubmitted: () => void
}

export function SingleApplicationReviewStep({ state, onBack, onSubmitted }: SingleApplicationReviewStepProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()
  const [declared, setDeclared] = useState(false)

  const requiresJurisdiction = useMemo(
    () => offeringRequiresJurisdictionSelection(state.countryId, state.visaOfferingId),
    [state.countryId, state.visaOfferingId],
  )

  const applicantSummaryRows = useMemo(
    () =>
      [
        ['Name', state.applicantName],
        ['Passport', state.passportNumber],
        ['Country', `${state.countryFlag} ${state.countryName}`],
        ['Visa', `${state.visaTypeLabel} · ${state.purposeLabel}`],
        ['Travel', state.travelDate || '—'],
        ['Return (optional)', state.expectedReturnDate || '—'],
        ...(requiresJurisdiction
          ? ([
              ['Passport state', state.issuedPassportState || state.issuedPassportLocationId || '—'],
              ['Jurisdiction', state.jurisdiction || '—'],
            ] as const)
          : []),
        ['Entry', state.entryType || '—'],
      ] as const,
    [requiresJurisdiction, state],
  )

  const checklist = defaultChecklist(state.countryName)
  const missingCount = checklist.filter(i => i.status === 'missing').length
  const requirementCards = useMemo(
    () => getRequirementPreviewCards(state.countryId, state.visaOfferingId, state.jurisdictionId),
    [state.countryId, state.visaOfferingId, state.jurisdictionId],
  )
  const totalDocs = requirementCards.reduce((n, c) => n + (c.documents?.length ?? 0), 0)
  const uploadedDocs = getDocumentWorkspaceItems(
    state.countryId,
    state.visaOfferingId,
    'normal',
    state.jurisdictionId || undefined,
  )
  const travelDateFeasibility = useMemo(
    () =>
      state.travelDate && state.countryId && state.visaOfferingId
        ? getTravelDateFeasibilityForOffering(
            state.countryId,
            state.visaOfferingId,
            state.travelDate,
            state.jurisdictionId || undefined,
          )
        : null,
    [state.countryId, state.jurisdictionId, state.travelDate, state.visaOfferingId],
  )

  const handleSubmit = () => {
    customerPortalService.submitApplication('single', { applicationId: state.gltsApplicationId })
    onSubmitted()
    showToast({
      title: 'Application submitted',
      description: 'Your application is in the tracking lifecycle. View it from Application Management.',
      variant: 'success',
    })
    navigate(`${base}/applications`)
  }

  const handleDraft = () => {
    showToast({ title: 'Draft saved', description: 'Resume from Application Management → Draft applications.', variant: 'info' })
    navigate(`${base}/applications`)
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ mb: 2, textTransform: 'none', fontSize: 13 }}>
        Back
      </Button>

      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Review & submit
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        Confirm applicant details, requirements, and declarations before submission.
      </Typography>

      <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>Applicant summary</Typography>
        <Grid container spacing={1}>
          {applicantSummaryRows.map(([k, v]) => (
            <Grid size={{ xs: 6 }} key={k}>
              <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{k}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{v}</Typography>
            </Grid>
          ))}
        </Grid>
        {travelDateFeasibility ? (
          <Box sx={{ mt: 1.5 }}>
            <TravelDateFeasibilityCard result={travelDateFeasibility} />
          </Box>
        ) : null}
      </Card>

      <Box sx={{ mb: 2 }}>
        <CustomerDocumentChecklist country={state.countryName} items={checklist} />
      </Box>

      <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>Uploaded documents</Typography>
        <Stack spacing={0.75}>
          {uploadedDocs.map(doc => (
            <Stack key={doc.id} direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 12, color: colors.navy }}>{doc.name}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>{doc.status}</Typography>
            </Stack>
          ))}
        </Stack>
      </Card>

      <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>Requirement checklist summary</Typography>
        <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
          {totalDocs} documents across requirement groups · {missingCount} items still pending upload after passport
        </Typography>
      </Card>

      <FormControlLabel
        control={<Checkbox checked={declared} onChange={e => setDeclared(e.target.checked)} size="small" />}
        label={
          <Typography sx={{ fontSize: 13 }}>
            I confirm the information is accurate and understand GLTS will process this application per the agreed scope.
          </Typography>
        }
        sx={{ mb: 2, alignItems: 'flex-start' }}
      />

      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        <Button variant="outlined" onClick={handleDraft} sx={{ textTransform: 'none', fontSize: 13 }}>
          Save draft
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={() => showToast({ title: 'Download started', variant: 'success' })}
          sx={{ textTransform: 'none', fontSize: 13 }}
        >
          Download summary
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!declared}
          sx={{ ...getPrimaryButtonSx(colors), fontSize: 13, ml: 'auto' }}
        >
          Submit application
        </Button>
      </Stack>
    </Box>
  )
}
