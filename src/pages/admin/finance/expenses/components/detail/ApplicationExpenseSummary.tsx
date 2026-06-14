import { Box, Grid, Stack, Typography } from '@mui/material'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { ApplicationExpenseDetailView } from '@/shared/types/applicationExpenseManagement'
import {
  deriveRollupPaymentStatus,
  rollupPaymentStatusLabel,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { expenseRollupPaymentColor } from '../../config/expenseStatusConfig'

interface ApplicationExpenseSummaryProps {
  detail: ApplicationExpenseDetailView
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 12 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, mt: 0.25 }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

export function ApplicationExpenseSummary({ detail }: ApplicationExpenseSummaryProps) {
  const rollupPayment = deriveRollupPaymentStatus(detail.expenses)

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {detail.applicationId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detail.companyName} · {detail.vesselName}
              </Typography>
            </Box>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Badge label={detail.applicationStatus} color="info" size="sm" />
            <Badge
              label={rollupPaymentStatusLabel(rollupPayment)}
              color={expenseRollupPaymentColor[rollupPayment]}
              size="sm"
            />
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Company Name" value={detail.companyName} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Vessel Name" value={detail.vesselName} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Crew Count" value={String(detail.crewCount)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Visa Country" value={detail.visaCountry} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Visa Type" value={detail.visaType} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Jurisdiction" value={detail.jurisdiction} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Submission Date" value={detail.submissionDate} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Travel / Joining Date" value={detail.travelDate} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Application Status" value={detail.applicationStatus} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Assigned Team" value={detail.assignedTeam ?? '—'} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Assigned User" value={detail.assignedUser ?? '—'} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ReadField label="Priority" value={detail.priority ?? 'Standard'} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </BaseCard>
  )
}
