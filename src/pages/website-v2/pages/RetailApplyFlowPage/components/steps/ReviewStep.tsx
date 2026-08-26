import { Box, Stack, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { StepShell } from '../StepShell'
import type { RetailFlowDraft } from '../../types'

interface ReviewStepProps {
  journey: RetailJourney
  draft: RetailFlowDraft
  onBack: () => void
  onContinue: () => void
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const colors = usePublicBrandColors()
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75, borderBottom: `1px solid ${colors.border}` }}>
      <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>{label}</Typography>
      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{value}</Typography>
    </Stack>
  )
}

function extraLabel(selection: RetailFlowDraft['insurance'], services: RetailJourney['insuranceServices']): string {
  if (selection.choice === 'skip') return 'Skipped'
  if (selection.choice === 'self_provided') return 'Self-provided'
  return services.find((service) => service.id === selection.serviceId)?.serviceName ?? 'GLTS arranged'
}

export function ReviewStep({ journey, draft, onBack, onContinue }: ReviewStepProps) {
  const colors = usePublicBrandColors()

  return (
    <StepShell title="Review your application" helperText="Check everything looks right before you pay." onBack={onBack} onContinue={onContinue} continueLabel="Proceed to payment">
      <Stack spacing={2.5}>
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy, mb: 0.5 }}>Trip</Typography>
          <SummaryRow label="Destination" value={journey.country.name} />
          <SummaryRow label="Visa type" value={journey.visaType.name} />
          <SummaryRow label="Traveller" value={draft.traveller.fullName || '—'} />
          <SummaryRow label="Passport number" value={draft.traveller.passportNumber || '—'} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy, mb: 0.5 }}>Documents</Typography>
          <SummaryRow label="Documents uploaded" value={`${Object.keys(draft.documentUploads).length}/${journey.documents.length}`} />
          {journey.allowsPhysicalOriginalDocuments && (
            <SummaryRow label="Original collection" value={draft.collectionMethod ? 'Arranged' : 'Pending'} />
          )}
        </Box>
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy, mb: 0.5 }}>Extras</Typography>
          <SummaryRow label="Travel insurance" value={extraLabel(draft.insurance, journey.insuranceServices)} />
          <SummaryRow label="Flight ticket" value={extraLabel(draft.flightTicket, journey.flightTicketServices)} />
        </Box>
      </Stack>
    </StepShell>
  )
}
