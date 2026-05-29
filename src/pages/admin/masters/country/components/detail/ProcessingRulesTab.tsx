import { Box, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState } from '@/design-system/UIComponents'
import type { BusinessSegment, CountryMaster, CountryProcessingRules } from '@/shared/types/countryMaster'

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

const SUBMISSION_LABELS: Record<CountryProcessingRules['submissionMode'], string> = {
  embassy_direct: 'Embassy direct',
  vfs: 'VFS',
  e_visa_portal: 'E-visa portal',
  agent_channel: 'Agent channel',
}

const FUNDS_LABELS: Record<CountryProcessingRules['fundsHandlingMode'], string> = {
  customer_pays: 'Customer pays',
  glts_float: 'GLTS float account',
  embassy_direct: 'Embassy direct',
}

function RulesGrid({ rules }: { rules: CountryProcessingRules }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Submission mode" value={SUBMISSION_LABELS[rules.submissionMode]} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Workflow profile" value={rules.workflowProfile} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Normal processing" value={rules.normalProcessingDays} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Express processing" value={rules.expressProcessingDays ?? '—'} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField
          label="Appointment required"
          value={rules.appointmentRequired ? 'Yes' : 'No'}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Appointment provider" value={rules.appointmentProvider ?? '—'} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Funds handling" value={FUNDS_LABELS[rules.fundsHandlingMode]} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="OCR policy" value={rules.ocrPolicyEnabled ? 'Enabled' : 'Disabled'} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ReadOnlyField label="SLA target (days)" value={String(rules.slaTargetDays ?? '—')} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ReadOnlyField label="Biometric required" value={rules.biometricRequired ? 'Yes' : 'No'} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ReadOnlyField
          label="Physical passport required"
          value={rules.physicalPassportRequired ? 'Yes' : 'No'}
        />
      </Grid>
      {rules.agentChannelNotes ? (
        <Grid size={{ xs: 12 }}>
          <ReadOnlyField label="Agent channel notes" value={rules.agentChannelNotes} />
        </Grid>
      ) : null}
    </Grid>
  )
}

interface ProcessingRulesTabProps {
  country: CountryMaster
  segment: BusinessSegment
}

export function ProcessingRulesTab({ country, segment }: ProcessingRulesTabProps) {
  const navigate = useNavigate()
  const segConfig = country.segments.find((s) => s.segment === segment)

  if (!segConfig?.enabled) {
    return (
      <EmptyState
        variant="no-data"
        title="Segment not enabled"
        description="Enable this segment to view processing rules."
      />
    )
  }

  const overrides = segConfig.visaTypes.filter((vt) => vt.processingRulesOverride)

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        Segment defaults
      </Typography>
      <Box sx={{ mt: 1.5 }}>
        <RulesGrid rules={segConfig.processingRules} />
      </Box>

      {overrides.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" color="text.secondary">
            Visa-type overrides
          </Typography>
          {overrides.map((vt) => (
            <Box key={vt.id} sx={{ mt: 1.5, p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                {vt.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Custom rules applied — edit in country form.
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}

      <Button
        label="Edit processing rules"
        variant="outlined"
        onClick={() => navigate(`/admin/masters/country/${country.id}/edit?step=0`)}
        sx={{ mt: 2 }}
      />
    </Box>
  )
}
