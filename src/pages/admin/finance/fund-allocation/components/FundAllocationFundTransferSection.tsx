import { Box, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { DatePicker, FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import {
  FUND_TRANSFER_DEFAULT_SOURCE,
  FUND_TRANSFER_TYPE_OPTIONS,
  type FundTransferDetails,
  type FundTransferType,
} from '@/shared/types/fundAllocation'
import { listBankSelectOptions } from '@/shared/utils/bankMasterOptions'
import { listCardSelectOptions } from '@/shared/utils/cardMasterOptions'
import { vfsServicePickerLayout } from '@/shared/utils/vfsServicePickerLayout'

function parseDateString(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.toDate() : null
}

function formatDateForStorage(date: Date | null): string {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

function showsReceivedBy(type: FundTransferType | ''): boolean {
  return type === 'cash' || type === 'upi' || type === 'card_cash'
}

function showsDestinationAccount(type: FundTransferType | ''): boolean {
  return type === 'bank_transfer'
}

function showsAssignedCard(type: FundTransferType | ''): boolean {
  return type === 'card'
}

interface FundAllocationFundTransferSectionProps {
  value: FundTransferDetails
  onChange: (value: FundTransferDetails) => void
  /** Auto-filled for Cash / UPI / Card + cash. */
  fundHolderName: string
}

export function FundAllocationFundTransferSection({
  value,
  onChange,
  fundHolderName,
}: FundAllocationFundTransferSectionProps) {
  const cardOptions = useMemo(() => listCardSelectOptions(), [])
  const bankOptions = useMemo(() => listBankSelectOptions(), [])
  const patch = (partial: Partial<FundTransferDetails>) => onChange({ ...value, ...partial })

  const handleTransferTypeChange = (nextType: FundTransferType | '') => {
    onChange({
      ...value,
      transferType: nextType,
      fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
      receivedBy: showsReceivedBy(nextType) ? fundHolderName : '',
      destinationBankAccount: showsDestinationAccount(nextType) ? value.destinationBankAccount : '',
      assignedCardId: showsAssignedCard(nextType) ? value.assignedCardId : '',
    })
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
        Fund Transfer
      </Typography>

      <FormField label="Fund source">
        <Input value={FUND_TRANSFER_DEFAULT_SOURCE} disabled size="sm" fullWidth />
      </FormField>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 1.5,
          alignItems: 'start',
          '& > *': { minWidth: 0, width: '100%' },
        }}
      >
        <FormField label="Transfer type" required>
          <Select
            value={value.transferType}
            onChange={next => handleTransferTypeChange(String(next) as FundTransferType | '')}
            options={FUND_TRANSFER_TYPE_OPTIONS}
            placeholder="Select transfer type"
            size="sm"
            fullWidth
          />
        </FormField>

        <FormField label="Transfer date" required>
          <DatePicker
            value={parseDateString(value.transferDate)}
            onChange={date => patch({ transferDate: formatDateForStorage(date) })}
            placeholder="Select transfer date"
            size="sm"
            fullWidth
            disableFuture
          />
        </FormField>
      </Box>

      {showsReceivedBy(value.transferType) ? (
        <FormField label="Received by">
          <Input value={value.receivedBy || fundHolderName || '—'} disabled size="sm" fullWidth />
        </FormField>
      ) : null}

      {showsDestinationAccount(value.transferType) ? (
        <FormField label="Destination bank account" required>
          <Select
            value={value.destinationBankAccount}
            onChange={next => patch({ destinationBankAccount: String(next) })}
            options={bankOptions}
            placeholder="Select bank from bank master"
            size="sm"
            fullWidth
          />
        </FormField>
      ) : null}

      {showsAssignedCard(value.transferType) ? (
        <FormField label="Assigned Card" required>
          <Select
            value={value.assignedCardId}
            onChange={next => patch({ assignedCardId: String(next) })}
            options={cardOptions}
            placeholder="Select card from card master"
            size="sm"
            fullWidth
          />
        </FormField>
      ) : null}

      <FormField label="Payment reference">
        <Input
          value={value.paymentReference}
          onChange={paymentReference => patch({ paymentReference })}
          placeholder="Enter payment reference"
          size="sm"
          fullWidth
        />
      </FormField>

      <FormField label="Payment remark">
        <Textarea
          value={value.paymentRemark}
          onChange={paymentRemark => patch({ paymentRemark })}
          placeholder="Optional payment remark"
          rows={2}
        />
      </FormField>
    </Stack>
  )
}
