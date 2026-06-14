import { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Chip,
} from '@mui/material'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { CustomerDocumentChecklist } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { defaultChecklist } from '../../../data/applicationFlowData'
import { getTravelDateFeasibilityForOffering } from '@/shared/services/countryMasterService'
import { getRequirementPreviewCards } from '../../../data/singleApplicationFlowData'
import { TravelDateFeasibilityCard } from '../../../components/create/TravelDateFeasibilityCard'
import { UploadQueueTable } from '../../../components/UploadQueueTable'

interface BulkApplicationReviewStepProps {
  state: ApplicationFlowState
  onBack: () => void
  onSubmitted: () => void
}

function queueReadyRows(rows: ApplicationFlowState['uploadQueueRows']) {
  return rows.filter(r => r.status !== 'processing')
}

export function BulkApplicationReviewStep({ state, onBack, onSubmitted }: BulkApplicationReviewStepProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()
  const [declared, setDeclared] = useState(false)

  const rows = state.uploadQueueRows
  const readyRows = useMemo(() => queueReadyRows(rows), [rows])
  const isSingleListing = readyRows.length === 1

  const checklist = defaultChecklist(state.countryName)
  const missingCount = checklist.filter(i => i.status === 'missing').length
  const requirementCards = useMemo(
    () => getRequirementPreviewCards(state.countryId, state.visaOfferingId, state.jurisdictionId),
    [state.countryId, state.visaOfferingId, state.jurisdictionId],
  )
  const totalDocs = requirementCards.reduce((n, c) => n + (c.documents?.length ?? 0), 0)
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

  const docsComplete = readyRows.reduce((n, r) => n + r.documentsComplete, 0)
  const docsTotal = readyRows.reduce((n, r) => n + r.documentsTotal, 0)

  const submitMode = isSingleListing ? 'single' : 'bulk'

  const handleSubmit = () => {
    const refId = customerPortalService.submitApplication(submitMode, {
      applicationId: state.gltsApplicationId,
      batchId: state.gltsBatchId,
    })
    onSubmitted()
    showToast({
      title: isSingleListing ? 'Application submitted' : 'Batch submitted',
      description: isSingleListing
        ? 'Your application is in the tracking lifecycle. View it from Application Management.'
        : `${refId} is ready for GLTS review.`,
      variant: 'success',
    })
    navigate(isSingleListing ? `${base}/applications` : `${base}/applications/${refId}`)
  }

  const handleDraft = () => {
    showToast({
      title: 'Draft saved',
      description: 'Resume from Application Management → Draft applications.',
      variant: 'info',
    })
    navigate(`${base}/applications`)
  }

  const passportStateLabel = state.issuedPassportState || state.issuedPassportLocationId || '—'

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ mb: 2, textTransform: 'none', fontSize: 13 }}>
        Back
      </Button>

      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        {isSingleListing ? 'Review & submit' : 'Review & submit batch'}
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        {isSingleListing
          ? 'Confirm applicant details, requirements, and declarations before submission.'
          : `Confirm ${readyRows.length} traveler${readyRows.length === 1 ? '' : 's'}, batch requirements, and declarations before submission.`}
      </Typography>

      {!isSingleListing && (
        <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>Batch summary</Typography>
          <Grid container spacing={1}>
            {[
              ['Country', `${state.countryFlag} ${state.countryName}`],
              ['Visa', `${state.visaTypeLabel} · ${state.purposeLabel}`],
              ['Travel', state.travelDate || '—'],
              ['Passport state', passportStateLabel],
              ['Jurisdiction', state.jurisdiction || '—'],
              ['Applicants', String(readyRows.length)],
              ['Documents progress', docsTotal > 0 ? `${docsComplete}/${docsTotal} across travelers` : '—'],
            ].map(([k, v]) => (
              <Grid size={{ xs: 6, md: 4 }} key={k}>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{k}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{v}</Typography>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {rows.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <UploadQueueTable
            rows={rows}
            selectedId={null}
            onSelect={() => {}}
            readOnly
            singleListing={isSingleListing}
            gltsApplicationId={state.gltsApplicationId || undefined}
          />
        </Box>
      )}

      {travelDateFeasibility ? (
        <Box sx={{ mb: 2 }}>
          <TravelDateFeasibilityCard result={travelDateFeasibility} />
        </Box>
      ) : null}

      <Box sx={{ mb: 2 }}>
        <CustomerDocumentChecklist country={state.countryName} items={checklist} />
      </Box>

      <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>Requirement checklist summary</Typography>
        <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
          {totalDocs} documents across requirement groups · {missingCount} items still pending after passport
          {!isSingleListing && readyRows.length > 0 && (
            <>
              {' '}
              ·{' '}
              <Chip
                label={`${readyRows.length} listing${readyRows.length === 1 ? '' : 's'}`}
                size="small"
                sx={{ height: 20, fontSize: 11, fontWeight: 700, verticalAlign: 'middle', ml: 0.5 }}
              />
            </>
          )}
        </Typography>
      </Card>

      <FormControlLabel
        control={<Checkbox checked={declared} onChange={e => setDeclared(e.target.checked)} size="small" />}
        label={
          <Typography sx={{ fontSize: 13 }}>
            I confirm the information is accurate and understand GLTS will process{' '}
            {isSingleListing ? 'this application' : 'this batch'} per the agreed scope.
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
          disabled={!declared || readyRows.length === 0}
          sx={{ ...getPrimaryButtonSx(colors), fontSize: 13, ml: 'auto' }}
        >
          {isSingleListing ? 'Submit application' : 'Submit batch'}
        </Button>
      </Stack>
    </Box>
  )
}
