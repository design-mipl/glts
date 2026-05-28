import type { ReactNode } from 'react'
import { Box, Typography, Card, Grid, TextField } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'

interface ApplicantInformationStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
  onSaveDraft: () => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const colors = usePublicBrandColors()
  return (
    <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 13, color: colors.navy, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {title}
      </Typography>
      {children}
    </Card>
  )
}

export function ApplicantInformationStep({
  state,
  onUpdate,
  onContinue,
  onSaveDraft,
}: ApplicantInformationStepProps) {
  const colors = usePublicBrandColors()
  const isMarine = state.visaType === 'crew' || state.purpose === 'crew_joining'

  const canContinue =
    Boolean(state.applicantName.trim()) &&
    Boolean(state.passportNumber.trim()) &&
    Boolean(state.travelDate)

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Applicant information
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        Verify and complete details for {state.countryName} · {state.visaTypeLabel}.
      </Typography>

      <Section title="Personal information">
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Full name"
              size="small"
              fullWidth
              value={state.applicantName}
              onChange={e => onUpdate({ applicantName: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Date of birth"
              size="small"
              fullWidth
              value={state.dateOfBirth}
              onChange={e => onUpdate({ dateOfBirth: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Gender"
              size="small"
              fullWidth
              value={state.gender}
              onChange={e => onUpdate({ gender: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Nationality"
              size="small"
              fullWidth
              value={state.nationality}
              onChange={e => onUpdate({ nationality: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Passport number"
              size="small"
              fullWidth
              value={state.passportNumber}
              onChange={e => onUpdate({ passportNumber: e.target.value })}
            />
          </Grid>
        </Grid>
      </Section>

      <Section title="Travel information">
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Travel date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={state.travelDate}
              onChange={e => onUpdate({ travelDate: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Entry type"
              size="small"
              fullWidth
              value={state.entryType}
              onChange={e => onUpdate({ entryType: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Duration"
              size="small"
              fullWidth
              value={state.duration}
              onChange={e => onUpdate({ duration: e.target.value })}
            />
          </Grid>
        </Grid>
      </Section>

      {isMarine && (
        <Section title="Operational information">
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Vessel name"
                size="small"
                fullWidth
                value={state.vesselName}
                onChange={e => onUpdate({ vesselName: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Rank"
                size="small"
                fullWidth
                value={state.rank}
                onChange={e => onUpdate({ rank: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Joining port"
                size="small"
                fullWidth
                value={state.joiningPort}
                onChange={e => onUpdate({ joiningPort: e.target.value })}
              />
            </Grid>
          </Grid>
        </Section>
      )}

      <FlowStepActions
        onContinue={onContinue}
        continueDisabled={!canContinue}
        secondaryLabel="Save draft"
        onSecondary={onSaveDraft}
      />
    </Box>
  )
}
