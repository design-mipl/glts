import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Button,
  Drawer,
  FormField,
  Input,
  Select,
  Tabs,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import {
  computeOverallFundBankSettlementSummary,
  fundUtilizationService,
} from '@/shared/services/fundUtilizationService'
import { getCurrentUser } from '@/shared/services/authService'
import type { FundBankWithdrawalEntry, FundSettlementUserOption } from '@/shared/types/fundUtilization'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { isFundUtilizationBankBatch, resolveOverallSettlementBankAccountLabel } from '../utils/fundUtilizationSettlementUtils'
import { FundSettlementKpiRow } from './FundSettlementKpiRow'
import { FundWithdrawalHistoryTab } from './FundWithdrawalHistoryTab'

const SETTLEMENT_DRAWER_WIDTH = 560

type SettlementTab = 'bank_settlement' | 'withdrawal_history'

const SETTLEMENT_TABS = [
  { label: 'Bank settlement', value: 'bank_settlement' },
  { label: 'Withdrawal history', value: 'withdrawal_history' },
] as const

interface FundSettlementDrawerProps {
  open: boolean
  userOptions: FundSettlementUserOption[]
  refreshKey?: number
  onClose: () => void
  onWithdrawn?: () => void
}

function buildDefaultWithdrawnBy(userOptions: FundSettlementUserOption[]): string {
  const currentUser = getCurrentUser()?.name?.trim()
  if (currentUser && userOptions.some(option => option.value === currentUser)) {
    return currentUser
  }
  return userOptions[0]?.value ?? ''
}

export function FundSettlementDrawer({
  open,
  userOptions,
  refreshKey = 0,
  onClose,
  onWithdrawn,
}: FundSettlementDrawerProps) {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<SettlementTab>('bank_settlement')
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawnBy, setWithdrawnBy] = useState('')
  const [remarks, setRemarks] = useState('')
  const [history, setHistory] = useState<FundBankWithdrawalEntry[]>([])
  const [submitting, setSubmitting] = useState(false)

  const bankBatches = useMemo(() => {
    void refreshKey
    return fundAllocationService
      .listAllocatedBatches()
      .filter(batch => isFundUtilizationBankBatch(batch))
  }, [refreshKey])

  const reloadHistory = useCallback(() => {
    setHistory(fundUtilizationService.listAllBankWithdrawals())
  }, [])

  useEffect(() => {
    if (!open) return
    setActiveTab('bank_settlement')
    setWithdrawalAmount('')
    setRemarks('')
    setWithdrawnBy(buildDefaultWithdrawnBy(userOptions))
    reloadHistory()
  }, [open, userOptions, reloadHistory])

  const summary = useMemo(() => {
    void refreshKey
    void history
    return computeOverallFundBankSettlementSummary()
  }, [refreshKey, history])

  const bankAccountLabel = useMemo(
    () => resolveOverallSettlementBankAccountLabel(bankBatches),
    [bankBatches],
  )

  const parsedAmount = Number.parseFloat(withdrawalAmount.replace(/,/g, ''))
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0
  const amountWithinBalance = amountValid && parsedAmount <= summary.availableInBank
  const canSubmit =
    summary.bankAllocationCount > 0 &&
    amountWithinBalance &&
    withdrawnBy.trim().length > 0 &&
    !submitting

  const handleWithdraw = () => {
    if (!canSubmit) return

    setSubmitting(true)
    try {
      const currentUser = getCurrentUser()
      fundUtilizationService.recordBankWithdrawal({
        amount: parsedAmount,
        withdrawnBy: withdrawnBy.trim(),
        remarks,
        recordedBy: currentUser?.name?.trim() || withdrawnBy.trim(),
      })
      reloadHistory()
      setWithdrawalAmount('')
      setRemarks('')
      onWithdrawn?.()
      showToast({
        title: 'Withdrawal recorded',
        description: `${formatInr(parsedAmount)} withdrawn by ${withdrawnBy.trim()}.`,
        variant: 'success',
      })
      setActiveTab('withdrawal_history')
    } catch (error) {
      showToast({
        title: 'Could not record withdrawal',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const footer =
    activeTab === 'bank_settlement' ? (
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button label="Cancel" variant="neutral" onClick={onClose} disabled={submitting} />
        <Button
          label="Withdraw"
          variant="contained"
          onClick={handleWithdraw}
          disabled={!canSubmit}
          loading={submitting}
        />
      </Stack>
    ) : (
      <Stack direction="row" justifyContent="flex-end">
        <Button label="Close" variant="neutral" onClick={onClose} />
      </Stack>
    )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Fund settlement"
      subtitle="Team bank float · all bank transfer allocations"
      width={SETTLEMENT_DRAWER_WIDTH}
      footer={footer}
      bodyVariant="default"
    >
      <Stack spacing={2}>
        <Tabs
          value={activeTab}
          onChange={value => setActiveTab(value as SettlementTab)}
          variant="underline"
          size="sm"
          items={[...SETTLEMENT_TABS]}
        />

        {summary.bankAllocationCount === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No bank transfer allocations are available yet. Fund settlement applies to the combined
            team bank balance once Finance releases funds via bank transfer.
          </Typography>
        ) : null}

        {activeTab === 'bank_settlement' ? (
          <Stack spacing={2}>
            <FundSettlementKpiRow summary={summary} />

            <AdminOverlayFormSection title="Withdraw funds" importance="primary">
              <Stack spacing={1.5}>
                <FormField label="Bank account">
                  <Input value={bankAccountLabel} disabled size="sm" fullWidth />
                </FormField>

                <FormField label="Available in bank">
                  <Input value={formatInr(summary.availableInBank)} disabled size="sm" fullWidth />
                </FormField>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                  }}
                >
                  <FormField
                    label="Withdrawal amount"
                    required
                    error={Boolean(withdrawalAmount.trim() && !amountWithinBalance)}
                    helperText={
                      withdrawalAmount.trim() && !amountWithinBalance
                        ? parsedAmount > summary.availableInBank
                          ? 'Exceeds available team bank balance'
                          : 'Enter a valid amount'
                        : undefined
                    }
                  >
                    <Input
                      value={withdrawalAmount}
                      onChange={setWithdrawalAmount}
                      placeholder="0"
                      size="sm"
                      fullWidth
                      disabled={summary.bankAllocationCount === 0}
                    />
                  </FormField>

                  <FormField label="User" required>
                    <Select
                      value={withdrawnBy}
                      onChange={value => setWithdrawnBy(String(value))}
                      options={
                        userOptions.length > 0
                          ? userOptions
                          : withdrawnBy
                            ? [{ value: withdrawnBy, label: withdrawnBy }]
                            : []
                      }
                      placeholder="Select user"
                      size="sm"
                      fullWidth
                      disabled={summary.bankAllocationCount === 0}
                    />
                  </FormField>
                </Box>

                <FormField label="Remarks">
                  <Textarea
                    value={remarks}
                    onChange={setRemarks}
                    placeholder="Optional note for this withdrawal"
                    rows={2}
                    disabled={summary.bankAllocationCount === 0}
                  />
                </FormField>
              </Stack>
            </AdminOverlayFormSection>
          </Stack>
        ) : (
          <FundWithdrawalHistoryTab entries={history} />
        )}
      </Stack>
    </Drawer>
  )
}
