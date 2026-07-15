import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, FormField, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type { FundAllocationActionInput, FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import { listCardSelectOptions } from '@/shared/utils/cardMasterOptions'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  mapVfsPickerServicesToChargeLines,
  sumVfsPickerServiceAmounts,
  type VfsPickerService,
} from '@/shared/utils/vfsServicePickerUtils'
import {
  vfsServicePickerEmptyStateSx,
  vfsServicePickerLayout,
  vfsServicePickerListSx,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'

export type FundAllocationActionPayload = FundAllocationActionInput

interface FundAllocationActionModalProps {
  open: boolean
  record: FundAllocationPassengerRow | null
  onClose: () => void
  onConfirm: (payload: FundAllocationActionPayload) => void
}

function ContextLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="baseline">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: vfsServicePickerLayout.bodyFontSize, minWidth: vfsServicePickerLayout.contextLabelMinWidth }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize, fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function FundAllocationActionModal({
  open,
  record,
  onClose,
  onConfirm,
}: FundAllocationActionModalProps) {
  const [search, setSearch] = useState('')
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [allocatedAmount, setAllocatedAmount] = useState('')
  const [allocatedAmountTouched, setAllocatedAmountTouched] = useState(false)
  const [cardId, setCardId] = useState('')
  const [notes, setNotes] = useState('')

  const cardOptions = useMemo(() => listCardSelectOptions(), [])

  const catalogServices = useMemo(() => {
    if (!record) return []
    return fundAllocationService.listVfsServicesForPassenger(record)
  }, [record])

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return catalogServices
    return catalogServices.filter(service => service.serviceName.toLowerCase().includes(query))
  }, [catalogServices, search])

  const selectedServices = useMemo(
    () => catalogServices.filter(service => selectedServiceIds.includes(service.id)),
    [catalogServices, selectedServiceIds],
  )

  const totalAmount = useMemo(
    () => sumVfsPickerServiceAmounts(selectedServices),
    [selectedServices],
  )

  useEffect(() => {
    if (!open || !record) return
    setSearch('')
    setSelectedServiceIds([])
    setAllocatedAmount('')
    setAllocatedAmountTouched(false)
    setCardId('')
    setNotes('')
  }, [open, record])

  useEffect(() => {
    if (!open || allocatedAmountTouched) return
    setAllocatedAmount(totalAmount > 0 ? String(totalAmount) : '')
  }, [allocatedAmountTouched, open, totalAmount])

  if (!record) return null

  const parsedAllocatedAmount = Number(allocatedAmount)
  const canSubmit =
    selectedServices.length > 0 &&
    cardId.trim().length > 0 &&
    Number.isFinite(parsedAllocatedAmount) &&
    parsedAllocatedAmount > 0

  const handleClose = () => {
    setSearch('')
    setSelectedServiceIds([])
    setAllocatedAmount('')
    setAllocatedAmountTouched(false)
    setCardId('')
    setNotes('')
    onClose()
  }

  const toggleService = (serviceId: string, checked: boolean) => {
    setSelectedServiceIds(current =>
      checked ? [...new Set([...current, serviceId])] : current.filter(id => id !== serviceId),
    )
  }

  const handleConfirm = () => {
    if (!canSubmit) return
    const chargeLines = mapVfsPickerServicesToChargeLines(selectedServices)
    onConfirm({
      selectedServices: chargeLines,
      totalAmount,
      allocatedAmount: parsedAllocatedAmount,
      cardId,
      notes,
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Allocate funds"
      subtitle={`${record.passengerName} · ${record.gltsApplicationId}`}
      size="md"
      footer={
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ width: '100%' }}
        >
          <Stack spacing={0.25}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
              Selected services: {selectedServices.length}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
              Total value: {totalAmount > 0 ? formatInr(totalAmount) : '—'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={handleClose} />
            <Button label="Allocate funds" onClick={handleConfirm} disabled={!canSubmit} />
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={2} sx={{ pt: 0.5 }}>
        <Stack spacing={0.75}>
          <ContextLine label="Country" value={record.country} />
          <ContextLine label="Visa type" value={record.visaType} />
          <ContextLine label="Jurisdiction" value={record.jurisdiction} />
        </Stack>

        <Divider />

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
            VFS services
          </Typography>
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Search by service name..."
            size="sm"
            fullWidth
            startAdornment={<Search size={16} />}
          />
        </Stack>

        <Box sx={vfsServicePickerListSx}>
          {filteredServices.length === 0 ? (
            <Box sx={vfsServicePickerEmptyStateSx}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
                {catalogServices.length === 0
                  ? 'No VFS services are configured for this country and visa type in country master.'
                  : 'No services match your search.'}
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {filteredServices.map((service: VfsPickerService) => (
                <Stack
                  key={service.id}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={vfsServicePickerServiceRowSx}
                >
                  <Checkbox
                    checked={selectedServiceIds.includes(service.id)}
                    onChange={checked => toggleService(service.id, checked)}
                    size="sm"
                  />
                  <Typography variant="body2" sx={{ flex: 1, fontSize: vfsServicePickerLayout.bodyFontSize }}>
                    {service.serviceName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: vfsServicePickerLayout.bodyFontSize,
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 600,
                    }}
                  >
                    {formatInr(service.amount)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>

        <Divider />

        <Stack spacing={1.5}>
          <FormField label="Total value">
            <Input value={totalAmount > 0 ? formatInr(totalAmount) : '—'} disabled size="sm" />
          </FormField>
          <FormField
            label="Allocated fund value"
            required
            helperText="Defaults to total value. You can enter an approximate amount if needed."
          >
            <Input
              value={allocatedAmount}
              onChange={value => {
                setAllocatedAmountTouched(true)
                setAllocatedAmount(value.replace(/[^\d.]/g, ''))
              }}
              placeholder="Enter allocated fund value"
              size="sm"
            />
          </FormField>
          <FormField label="Payment card" required>
            <Select
              value={cardId}
              onChange={value => setCardId(String(value))}
              options={[{ value: '', label: 'Select card' }, ...cardOptions]}
              placeholder="Select card from card master"
              size="sm"
              fullWidth
            />
          </FormField>
          <FormField label="Notes">
            <Textarea value={notes} onChange={setNotes} placeholder="Optional allocation notes" rows={3} />
          </FormField>
        </Stack>
      </Stack>
    </Modal>
  )
}
