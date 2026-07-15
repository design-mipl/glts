import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { ApplicationExpenseDetailView } from '@/shared/types/applicationExpenseManagement'
import {
  deriveRollupPaymentStatus,
  rollupPaymentStatusLabel,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { expenseRollupPaymentColor } from '../../config/expenseStatusConfig'

interface ApplicationExpenseSummaryProps {
  detail: ApplicationExpenseDetailView
}

const SEGMENT_LABEL: Record<ApplicationCustomerSegment, string> = {
  marine: 'Marine',
  b2bAgents: 'B2B',
  corporate: 'Corporate',
  retail: 'Retail',
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ fontSize: 11, letterSpacing: 0.2 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.35,
          wordBreak: 'break-word',
        }}
      >
        {value?.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

export function ApplicationExpenseSummary({ detail }: ApplicationExpenseSummaryProps) {
  const rollupPayment = deriveRollupPaymentStatus(detail.expenses)
  const countryVisa = [detail.visaCountry, detail.visaType].filter(Boolean).join(' · ')
  const hasExpenses = detail.expenses.length > 0

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-start' }}
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                {detail.applicationId}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
                {detail.companyName}
                {detail.vesselName ? ` · ${detail.vesselName}` : ''}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              sx={{ flexWrap: 'wrap', alignItems: 'center' }}
            >
              <Badge
                label={SEGMENT_LABEL[detail.customerSegment] ?? detail.customerSegment}
                color="neutral"
                size="sm"
              />
              <Badge
                label={detail.recordType === 'bulk' ? 'Bulk' : 'Single'}
                color="neutral"
                size="sm"
              />
              <Badge label={detail.applicationStatus} color="info" size="sm" />
              {hasExpenses ? (
                <Badge
                  label={rollupPaymentStatusLabel(rollupPayment)}
                  color={expenseRollupPaymentColor[rollupPayment]}
                  size="sm"
                />
              ) : (
                <Badge label="No Expenses" color="neutral" size="sm" />
              )}
            </Stack>
          </Stack>

          <Divider />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Company" value={detail.companyName} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Vessel" value={detail.vesselName} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Crew count" value={String(detail.crewCount)} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Country / visa" value={countryVisa} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Jurisdiction" value={detail.jurisdiction} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Travel / joining" value={detail.travelDate} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Team" value={detail.assignedTeam ?? ''} />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MetaItem label="Assigned to" value={detail.assignedUser ?? ''} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </BaseCard>
  )
}
