import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  formatSettlementAmountLabel,
  getSettlementAmountColor,
  getSettlementAmountTone,
} from '@/shared/utils/fundSettlementDisplay'
import type { FundTransferType } from '@/shared/types/fundAllocation'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'
import { isClaimSheetBankTransferKpis } from '@/shared/types/groundOpsClaimSheet'

interface ClaimSheetKpiSnapshotProps {
  kpis: FundBankSettlementSummary
  fundTransferType?: FundTransferType | ''
}

function KpiCard({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <BaseCard sx={{ px: 1.5, py: 1.1, height: '100%' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography
        color={valueColor}
        sx={{ mt: 0.5, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}
      >
        {value}
      </Typography>
    </BaseCard>
  )
}

export function ClaimSheetKpiSnapshot({ kpis, fundTransferType }: ClaimSheetKpiSnapshotProps) {
  const showBankKpis = isClaimSheetBankTransferKpis(fundTransferType)
  const settlementTone = getSettlementAmountTone(kpis.settlementAmount)

  return (
    <Grid container spacing={1.25}>
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="Allocated amount" value={formatInr(kpis.allocatedAmount)} />
      </Grid>
      {showBankKpis ? (
        <>
          <Grid size={{ xs: 6, sm: 4 }}>
            <KpiCard label="Total withdrawn" value={formatInr(kpis.totalWithdrawn)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <KpiCard label="Available in bank" value={formatInr(kpis.availableInBank)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <KpiCard label="In hand cash" value={formatInr(kpis.inHandCash)} />
          </Grid>
        </>
      ) : null}
      <Grid size={{ xs: 6, sm: 4 }}>
        <KpiCard label="Expenses incurred" value={formatInr(kpis.expensesIncurred)} />
      </Grid>
      <Grid size={{ xs: showBankKpis ? 12 : 6, sm: 4 }}>
        <KpiCard
          label="Settlement amount"
          value={formatSettlementAmountLabel(kpis.settlementAmount)}
          valueColor={getSettlementAmountColor(settlementTone)}
        />
      </Grid>
    </Grid>
  )
}
