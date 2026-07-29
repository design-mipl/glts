import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FormField, Input, Select, Textarea, useToast } from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { createEmptyLogisticsRefundDetails } from '@/shared/types/logisticsDispatch'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { vendorService } from '@/shared/services/vendorService'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { formatInr } from '@/shared/utils/invoiceCalculations'

function SectionHeading({ children }: { children: string }) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
      {children}
    </Typography>
  )
}

interface LogisticsRefundTabProps {
  record: OperationalCase
  onUpdated: () => void
}

export interface LogisticsRefundTabHandle {
  submit: () => void
}

export const LogisticsRefundTab = forwardRef<LogisticsRefundTabHandle, LogisticsRefundTabProps>(
  function LogisticsRefundTab({ record, onUpdated }, ref) {
    const { showToast } = useToast()
    const [vendorId, setVendorId] = useState(record.refundDetails?.vendorId ?? '')
    const [amount, setAmount] = useState(
      record.refundDetails?.amount != null && record.refundDetails.amount > 0
        ? String(record.refundDetails.amount)
        : '',
    )
    const [remarks, setRemarks] = useState(record.refundDetails?.remarks ?? '')

    useEffect(() => {
      const details = record.refundDetails ?? createEmptyLogisticsRefundDetails()
      setVendorId(details.vendorId)
      setAmount(details.amount > 0 ? String(details.amount) : '')
      setRemarks(details.remarks ?? '')
    }, [record.id, record.refundDetails])

    const vendorOptions = useMemo(
      () =>
        vendorService.list({ category: 'visa_processing', status: 'active' }).map(vendor => ({
          value: vendor.id,
          label: vendor.vendorName,
        })),
      [],
    )

    const selectedVendorName =
      vendorOptions.find(option => option.value === vendorId)?.label ??
      record.refundDetails?.vendorName ??
      ''

    const handleSave = () => {
      const parsedAmount = Number(amount)
      if (!vendorId.trim()) {
        showToast({
          title: 'Consulate vendor required',
          description: 'Select a consulate vendor for this refund.',
          variant: 'error',
        })
        return
      }
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        showToast({
          title: 'Invalid amount',
          description: 'Enter a refund amount greater than zero.',
          variant: 'error',
        })
        return
      }

      const vendorName =
        vendorOptions.find(option => option.value === vendorId)?.label ?? selectedVendorName
      if (!vendorName.trim()) {
        showToast({
          title: 'Consulate vendor required',
          description: 'Select a valid consulate vendor.',
          variant: 'error',
        })
        return
      }

      const updated = operationalCaseHandlingService.saveRefundDetails(record.id, {
        vendorId,
        vendorName,
        amount: parsedAmount,
        remarks,
      })

      if (!updated) {
        showToast({
          title: 'Unable to save refund',
          variant: 'error',
        })
        return
      }

      applicationExpenseManagementService.syncApplication(record.applicationId)
      onUpdated()
      showToast({
        title: 'Refund saved',
        description: `${vendorName} · ${formatInr(parsedAmount)} will appear in invoice composition.`,
        variant: 'success',
      })
    }

    useImperativeHandle(
      ref,
      () => ({
        submit: handleSave,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- submit closes over latest form via render
      [vendorId, amount, remarks, record.id, vendorOptions, selectedVendorName],
    )

    return (
      <Stack spacing={1.25}>
        <SectionHeading>Consulate refund</SectionHeading>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          Record the consulate vendor and refund amount. This line is included in invoice composition
          for the passenger.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 1.25 }}>
          <FormField label="Consulate vendor" required>
            <Select
              value={vendorId}
              onChange={value => setVendorId(String(value))}
              options={vendorOptions}
              placeholder="Select consulate vendor"
              size="sm"
              fullWidth
              clearable
            />
          </FormField>

          <FormField label="Refund amount (INR)" required>
            <Input
              type="number"
              size="sm"
              value={amount}
              onChange={setAmount}
              placeholder="Enter amount"
              fullWidth
            />
          </FormField>
        </Box>

        <FormField label="Remarks" optional>
          <Textarea
            rows={3}
            value={remarks}
            onChange={setRemarks}
            placeholder="Optional notes for finance / invoice remark"
          />
        </FormField>

        {record.refundDetails?.recordedAt ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            Last saved
            {record.refundDetails.recordedBy ? ` by ${record.refundDetails.recordedBy}` : ''}
            {selectedVendorName ? ` · ${selectedVendorName}` : ''}
            {record.refundDetails.amount > 0
              ? ` · ${formatInr(record.refundDetails.amount)}`
              : ''}
          </Typography>
        ) : null}
      </Stack>
    )
  },
)
