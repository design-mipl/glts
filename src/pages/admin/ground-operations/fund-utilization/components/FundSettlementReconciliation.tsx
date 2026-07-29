import { Box, Divider, Stack, Typography } from '@mui/material'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  formatSettlementAmountLabel,
  formatSettlementDayLabel,
  getSettlementAmountColor,
  getSettlementAmountHint,
  getSettlementAmountTone,
  type SettlementConvention,
} from '@/shared/utils/fundSettlementDisplay'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'

const containerSx = {
  px: 1.5,
  py: 1.25,
  borderRadius: '10px',
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const

function SectionHeading({ children }: { children: string }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1.2,
      }}
    >
      {children}
    </Typography>
  )
}

export function ReconciliationLine({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1.5}>
      <Typography
        variant="body2"
        color={emphasize ? 'text.primary' : 'text.secondary'}
        sx={{ fontSize: 12, fontWeight: emphasize ? 600 : 400, lineHeight: 1.35 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          fontSize: emphasize ? 13 : 12,
          fontWeight: emphasize ? 700 : 600,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function SettlementStatusRow({
  amount,
  convention = 'closing_cash',
}: {
  amount: number
  convention?: SettlementConvention
}) {
  const tone = getSettlementAmountTone(amount, convention)
  const color = getSettlementAmountColor(tone)

  return (
    <Stack spacing={0.25}>
      <SectionHeading>Settlement status</SectionHeading>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1.5}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: 11, fontWeight: 500, lineHeight: 1.3 }}
        >
          {getSettlementAmountHint(amount, convention)}
        </Typography>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color,
            lineHeight: 1.3,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {formatSettlementAmountLabel(amount, convention)}
        </Typography>
      </Stack>
    </Stack>
  )
}

/** @deprecated Prefer inline settlement row inside the shared container. */
export function SettlementStatusBanner({
  amount,
  convention = 'closing_cash',
}: {
  amount: number
  convention?: SettlementConvention
}) {
  return (
    <Box sx={containerSx}>
      <SettlementStatusRow amount={amount} convention={convention} />
    </Box>
  )
}

/** Full bank + cash day reconciliation (bank-transfer float). */
export function FundBankCashReconciliation({ summary }: { summary: FundBankSettlementSummary }) {
  const priorLabel = summary.priorBankDate
    ? formatSettlementDayLabel(summary.priorBankDate)
    : 'Previous day'
  const dayLabel = summary.settlementDate
    ? formatSettlementDayLabel(summary.settlementDate)
    : 'Selected day'

  return (
    <Box sx={containerSx}>
      <Stack spacing={1.25}>
        <Stack spacing={0.75}>
          <SectionHeading>Bank reconciliation</SectionHeading>
          <ReconciliationLine
            label={`Closing Bank Balance (${priorLabel})`}
            value={formatInr(summary.closingBankBalancePrior)}
          />
          <ReconciliationLine
            label={`Funds Transferred to Bank (${dayLabel})`}
            value={formatInr(summary.fundsTransferred)}
          />
          <Divider sx={{ my: 0.25 }} />
          <ReconciliationLine
            label="Available Bank Balance"
            value={formatInr(summary.availableBankBalance)}
            emphasize
          />
          <ReconciliationLine
            label={`Cash Withdrawn (${dayLabel})`}
            value={formatInr(summary.cashWithdrawn)}
          />
          <Divider sx={{ my: 0.25 }} />
          <ReconciliationLine
            label="Closing Bank Balance"
            value={formatInr(summary.closingBankBalance)}
            emphasize
          />
        </Stack>

        <Divider />

        <Stack spacing={0.75}>
          <SectionHeading>Cash reconciliation</SectionHeading>
          <ReconciliationLine
            label={`Opening Cash Balance (${dayLabel})`}
            value={formatInr(summary.openingCashBalance)}
          />
          <ReconciliationLine
            label="Cash Withdrawn from Bank"
            value={formatInr(summary.cashWithdrawn)}
          />
          <Divider sx={{ my: 0.25 }} />
          <ReconciliationLine
            label="Total Cash Available"
            value={formatInr(summary.totalCashAvailable)}
            emphasize
          />
          <ReconciliationLine
            label="Expenses Incurred"
            value={formatInr(summary.expensesIncurred)}
          />
          <Divider sx={{ my: 0.25 }} />
          <ReconciliationLine
            label="Closing Cash Balance"
            value={formatInr(summary.closingCashBalance)}
            emphasize
          />
        </Stack>

        <Divider />

        <SettlementStatusRow amount={summary.settlementAmount} convention="closing_cash" />
      </Stack>
    </Box>
  )
}

/**
 * Non-bank (card / other) settlement in the same single-container format:
 * allocated → expenses → settlement status.
 */
export function FundExpenseSettlementReconciliation({
  allocatedAmount,
  expensesIncurred,
  settlementAmount,
}: {
  allocatedAmount: number
  expensesIncurred: number
  settlementAmount: number
}) {
  return (
    <Box sx={containerSx}>
      <Stack spacing={1.25}>
        <Stack spacing={0.75}>
          <SectionHeading>Settlement reconciliation</SectionHeading>
          <ReconciliationLine label="Allocated Amount" value={formatInr(allocatedAmount)} />
          <ReconciliationLine label="Expenses Incurred" value={formatInr(expensesIncurred)} />
          <Divider sx={{ my: 0.25 }} />
          <ReconciliationLine
            label="Net (Expenses − Allocated)"
            value={formatInr(settlementAmount)}
            emphasize
          />
        </Stack>

        <Divider />

        <SettlementStatusRow amount={settlementAmount} convention="expense_vs_allocated" />
      </Stack>
    </Box>
  )
}
