import { Box, Typography, Grid, Card, Stack, Chip } from '@mui/material'
import { Clock, IndianRupee, Plane } from 'lucide-react'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  requiresFieldValidation,
  useApplicationFlowPolicy,
} from '../../../../context/ApplicationFlowPolicyContext'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import {
  getVisaOfferings,
  patchStateFromVisaOffering,
} from '@/shared/services/countryMasterService'

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
  const options = getVisaOfferings(state.countryId)

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy }}>
          Visa type & purpose
        </Typography>
        <Chip label={`${state.countryFlag} ${state.countryName}`} size="small" sx={{ fontWeight: 600, fontSize: 11 }} />
      </Stack>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        Select the visa category and purpose of visit. Requirements in the next step depend on this selection.
      </Typography>

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
