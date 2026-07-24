import { Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/design-system/UIComponents'
import type { FundAllocationPassengerRow, FundTransferDetails } from '@/shared/types/fundAllocation'
import {
  createEmptyFundTransferDetails,
  isFundTransferValid,
} from '@/shared/types/fundAllocation'
import { computeRequestedBulkSummary } from '../utils/fundAllocationBulkUtils'
import { FundAllocationFundTransferSection } from './FundAllocationFundTransferSection'
import {
  AllocateFundsFormFields,
  AllocateFundsModalFooter,
  AllocateFundsTwoPanelLayout,
  RequestedPassengerSummaryCard,
  RequestedServicesSection,
} from './FundAllocationAllocateModalLayout'

export interface FundAllocationBulkConfirmPayload {
  fundTransfer: FundTransferDetails
  /** Cumulative allocated amount across selected passengers; pro-rated by requested totals. */
  allocatedAmount: number
  notes?: string
}

interface FundAllocationBulkActionModalProps {
  open: boolean
  records: FundAllocationPassengerRow[]
  onClose: () => void
  onConfirm: (records: FundAllocationPassengerRow[], payload: FundAllocationBulkConfirmPayload) => void
}

export function FundAllocationBulkActionModal({
  open,
  records,
  onClose,
  onConfirm,
}: FundAllocationBulkActionModalProps) {
  const [allocatedAmount, setAllocatedAmount] = useState('')
  const [allocatedAmountTouched, setAllocatedAmountTouched] = useState(false)
  const [fundTransfer, setFundTransfer] = useState<FundTransferDetails>(createEmptyFundTransferDetails())

  const primaryRecord = records[0] ?? null
  const fundHolderName = primaryRecord?.allocatedTo?.trim() || ''

  const allocationSummary = useMemo(() => computeRequestedBulkSummary(records), [records])

  const totalServiceCount = useMemo(
    () => allocationSummary.perPassenger.reduce((sum, entry) => sum + entry.selectedServices.length, 0),
    [allocationSummary.perPassenger],
  )

  useEffect(() => {
    if (!open) return
    setAllocatedAmountTouched(false)
    setFundTransfer(
      createEmptyFundTransferDetails({
        receivedBy: fundHolderName,
      }),
    )
  }, [open, records, fundHolderName])

  useEffect(() => {
    if (!open || allocatedAmountTouched) return
    setAllocatedAmount(
      allocationSummary.grandTotal > 0 ? String(allocationSummary.grandTotal) : '',
    )
  }, [allocatedAmountTouched, allocationSummary.grandTotal, open])

  if (!primaryRecord || records.length === 0) return null

  const parsedAllocatedAmount = Number(allocatedAmount)
  const canSubmit =
    isFundTransferValid(fundTransfer) &&
    totalServiceCount > 0 &&
    allocationSummary.perPassenger.every(entry => entry.totalAmount > 0) &&
    Number.isFinite(parsedAllocatedAmount) &&
    parsedAllocatedAmount > 0

  const handleClose = () => {
    setAllocatedAmount('')
    setAllocatedAmountTouched(false)
    setFundTransfer(createEmptyFundTransferDetails())
    onClose()
  }

  const handleConfirm = () => {
    if (!canSubmit) return
    onConfirm(records, {
      fundTransfer: {
        ...fundTransfer,
        receivedBy: fundTransfer.receivedBy || fundHolderName,
      },
      allocatedAmount: parsedAllocatedAmount,
      notes: fundTransfer.paymentRemark,
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Allocate funds"
      subtitle={`${records.length} passengers · ${primaryRecord.country}`}
      size="lg"
      footer={
        <AllocateFundsModalFooter
          requestedTotal={allocationSummary.grandTotal}
          allocatedAmount={allocatedAmount}
          onCancel={handleClose}
          onConfirm={handleConfirm}
          canSubmit={canSubmit}
        />
      }
    >
      <AllocateFundsTwoPanelLayout
        contextItems={[
          { label: 'Country', value: primaryRecord.country },
          { label: 'Visa type', value: primaryRecord.visaType },
          { label: 'Jurisdiction', value: primaryRecord.jurisdiction },
          { label: 'Team', value: primaryRecord.assignedTeam || '—' },
          { label: 'User', value: primaryRecord.assignedUser || '—' },
          { label: 'Passengers', value: String(records.length) },
        ]}
        leftPanel={
          <RequestedServicesSection
            serviceCount={totalServiceCount}
            emptyMessage="No fund requests on selected passengers. Request funds from Assignment & Priority first."
          >
            {allocationSummary.perPassenger.map(entry => (
              <RequestedPassengerSummaryCard key={entry.record.id} record={entry.record} />
            ))}
          </RequestedServicesSection>
        }
        rightPanel={
          <Stack spacing={2}>
            <AllocateFundsFormFields
              requestedTotal={allocationSummary.grandTotal}
              allocatedAmount={allocatedAmount}
              onAllocatedAmountChange={value => {
                setAllocatedAmountTouched(true)
                setAllocatedAmount(value)
              }}
            />
            <FundAllocationFundTransferSection
              value={fundTransfer}
              onChange={setFundTransfer}
              fundHolderName={fundHolderName}
            />
          </Stack>
        }
      />
    </Modal>
  )
}
