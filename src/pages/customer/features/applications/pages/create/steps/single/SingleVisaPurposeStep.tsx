import { Box, Typography, Grid, Card, Stack, Chip } from '@mui/material'
import { Clock, IndianRupee, Plane } from 'lucide-react'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  requiresFieldValidation,
  isWebsiteFlowPolicy,
  useApplicationFlowPolicy,
} from '../../../../context/ApplicationFlowPolicyContext'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import { ApplicationFlowContextChips } from '../../../../components/create/ApplicationFlowContextChips'
import {
  getVisaOfferings,
  patchStateFromVisaOffering,
} from '@/shared/services/countryMasterService'
import { resolveApplicationFlowSegment } from '../../../../utils/resolveApplicationFlowSegment'

interface SingleVisaPurposeStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
  continueLabel?: string
}

export function SingleVisaPurposeStep({
  state,
  onUpdate,
  onContinue,
  continueLabel = 'Continue',
}: SingleVisaPurposeStepProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const isWebsite = isWebsiteFlowPolicy(policy)
  const flowSegment = resolveApplicationFlowSegment(policy)
  const options = getVisaOfferings(state.countryId, true, flowSegment)

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 0.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, m: 0 }}>
          Visa type & purpose
        </Typography>
        <ApplicationFlowContextChips
          countryFlag={state.countryFlag}
          countryName={state.countryName}
          showVisa={false}
          showPurpose={false}
        />
      </Stack>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        {isWebsite
          ? 'Select the visa type for this destination. Requirements in the next step depend on this selection.'
          : 'Select the marine visa category for this destination. Requirements in the next step depend on this selection.'}
      </Typography>

      {options.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 2 }}>
          {isWebsite
            ? `No visa types are configured for ${state.countryName} yet. Choose another destination or contact GLTS support.`
            : `No marine visa types are configured for ${state.countryName} yet. Choose another destination or contact GLTS operations to enable marine filing for this country.`}
        </Typography>
      ) : null}

      <Grid container spacing={1.5}>
        {options.map(opt => {
          const selected = state.visaOfferingId === opt.id
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={opt.id}>
              <Card
                onClick={() => onUpdate(patchStateFromVisaOffering(opt))}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  height: '100%',
                  border: `2px solid ${selected ? colors.greenBright : colors.border}`,
                  bgcolor: selected ? colors.greenMuted : colors.white,
                  borderRadius: '12px',
                  '&:hover': { borderColor: colors.greenBright },
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.navy }}>{opt.visaTypeLabel}</Typography>
                <Chip
                  label={opt.purposeLabel}
                  size="small"
                  sx={{ mt: 0.75, mb: 1.25, height: 22, fontWeight: 700, fontSize: 11 }}
                />
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Clock size={14} color={colors.textMuted} />
                    <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>{opt.processingTimeline}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Plane size={14} color={colors.textMuted} />
                    <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>{opt.entryType}</Typography>
                  </Stack>
                  {opt.approxCost != null && opt.approxCost > 0 ? (
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <IndianRupee size={14} color={colors.textMuted} />
                      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
                        Approx. {formatInr(opt.approxCost)}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
                <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 1.25, lineHeight: 1.4 }}>
                  {opt.requirementSummary}
                </Typography>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <FlowStepActions
        onContinue={onContinue}
        continueLabel={continueLabel}
        continueDisabled={strict && !state.visaOfferingId}
      />
    </Box>
  )
}
