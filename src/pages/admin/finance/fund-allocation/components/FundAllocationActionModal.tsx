import { Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/design-system/UIComponents'
import type { FundAllocationActionInput, FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import {
  createEmptyFundTransferDetails,
  isFundTransferValid,
  type FundTransferDetails,
} from '@/shared/types/fundAllocation'
import { FundAllocationFundTransferSection } from './FundAllocationFundTransferSection'
import {
  AllocateFundsFormFields,
  AllocateFundsModalFooter,
  AllocateFundsTwoPanelLayout,
  RequestedPassengerSummaryCard,
  RequestedServicesSection,
} from './FundAllocationAllocateModalLayout'

export type FundAllocationActionPayload = FundAllocationActionInput

interface FundAllocationActionModalProps {
  open: boolean
  record: FundAllocationPassengerRow | null
  onClose: () => void
  onConfirm: (payload: FundAllocationActionPayload) => void
}

export function FundAllocationActionModal({
  open,
  record,
  onClose,
  onConfirm,
}: FundAllocationActionModalProps) {
  const [allocatedAmount, setAllocatedAmount] = useState('')
  const [allocatedAmountTouched, setAllocatedAmountTouched] = useState(false)
  const [fundTransfer, setFundTransfer] = useState<FundTransferDetails>(createEmptyFundTransferDetails())

  const requestedServices = useMemo(
    () => record?.selectedServices ?? [],
    [record?.selectedServices],
  )

  const totalAmount = record?.totalAmount ?? 0
  const fundHolderName = record?.allocatedTo?.trim() || ''

  useEffect(() => {
    if (!open || !record) return
    setAllocatedAmountTouched(false)
    setFundTransfer(
      createEmptyFundTransferDetails({
        ...(record.fundTransfer ?? {}),
        paymentRemark: record.fundTransfer?.paymentRemark || record.allocationNotes || '',
        receivedBy: record.fundTransfer?.receivedBy || record.allocatedTo || record.assignedUser || '',
      }),
    )
    setAllocatedAmount(
      record.allocatedAmount > 0
        ? String(record.allocatedAmount)
        : record.totalAmount > 0
          ? String(record.totalAmount)
          : '',
    )
    if (record.allocatedAmount > 0 && record.allocatedAmount !== record.totalAmount) {
      setAllocatedAmountTouched(true)
    }
  }, [open, record])

  useEffect(() => {
    if (!open || allocatedAmountTouched) return
    setAllocatedAmount(totalAmount > 0 ? String(totalAmount) : '')
  }, [allocatedAmountTouched, open, totalAmount])

  if (!record) return null

  const parsedAllocatedAmount = Number(allocatedAmount)
  const canSubmit =
    requestedServices.length > 0 &&
    totalAmount > 0 &&
    isFundTransferValid(fundTransfer) &&
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
    onConfirm({
      selectedServices: requestedServices.map(line => ({ ...line })),
      totalAmount,
      allocatedAmount: parsedAllocatedAmount,
      fundTransfer: {
        ...fundTransfer,
        receivedBy: fundTransfer.receivedBy || fundHolderName,
      },
      notes: fundTransfer.paymentRemark,
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Allocate funds"
      subtitle={`${record.passengerName} · ${record.gltsApplicationId}`}
      size="lg"
      footer={
        <AllocateFundsModalFooter
          requestedTotal={totalAmount}
          allocatedAmount={allocatedAmount}
          onCancel={handleClose}
          onConfirm={handleConfirm}
          canSubmit={canSubmit}
        />
      }
    >
      <AllocateFundsTwoPanelLayout
        contextItems={[
          { label: 'Country', value: record.country },
          { label: 'Visa type', value: record.visaType },
          { label: 'Jurisdiction', value: record.jurisdiction },
          { label: 'Team', value: record.assignedTeam || '—' },
          { label: 'User', value: record.assignedUser || '—' },
        ]}
        leftPanel={
          <RequestedServicesSection
            serviceCount={requestedServices.length}
            emptyMessage="No fund request on this passenger. Request funds from Assignment & Priority first."
          >
            <RequestedPassengerSummaryCard record={record} />
          </RequestedServicesSection>
        }
        rightPanel={
          <Stack spacing={2}>
            <AllocateFundsFormFields
              requestedTotal={totalAmount}
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
