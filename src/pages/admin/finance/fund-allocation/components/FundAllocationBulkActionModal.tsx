import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, FormField, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import { listCardSelectOptions } from '@/shared/utils/cardMasterOptions'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { VfsPickerService } from '@/shared/utils/vfsServicePickerUtils'
import {
  vfsServicePickerEmptyStateSx,
  vfsServicePickerLayout,
  vfsServicePickerListSx,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'
import {
  buildBulkVfsServiceCatalog,
  computeBulkAllocationSummary,
  formatBulkServiceAmountLabel,
} from '../utils/fundAllocationBulkUtils'

export interface FundAllocationBulkConfirmPayload {
  selectedServiceKeys: string[]
  cardId: string
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
  const [search, setSearch] = useState('')
  const [selectedServiceKeys, setSelectedServiceKeys] = useState<string[]>([])
  const [cardId, setCardId] = useState('')
  const [notes, setNotes] = useState('')

  const cardOptions = useMemo(() => listCardSelectOptions(), [])
  const primaryRecord = records[0] ?? null

  const catalogServices = useMemo(() => buildBulkVfsServiceCatalog(records), [records])

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return catalogServices
    return catalogServices.filter(service => service.serviceName.toLowerCase().includes(query))
  }, [catalogServices, search])

  const allocationSummary = useMemo(
    () => computeBulkAllocationSummary(records, selectedServiceKeys),
    [records, selectedServiceKeys],
  )

  useEffect(() => {
    if (!open) return
    setSearch('')
    setSelectedServiceKeys([])
    setCardId('')
    setNotes('')
  }, [open, records])

  if (!primaryRecord || records.length === 0) return null

  const canSubmit =
    selectedServiceKeys.length > 0 &&
    cardId.trim().length > 0 &&
    allocationSummary.perPassenger.every(entry => entry.totalAmount > 0)

  const handleClose = () => {
    setSearch('')
    setSelectedServiceKeys([])
    setCardId('')
    setNotes('')
    onClose()
  }

  const toggleService = (serviceKey: string, checked: boolean) => {
    setSelectedServiceKeys(current =>
      checked ? [...new Set([...current, serviceKey])] : current.filter(key => key !== serviceKey),
    )
  }

  const handleConfirm = () => {
    if (!canSubmit) return
    onConfirm(records, {
      selectedServiceKeys,
      cardId,
      notes,
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Allocate funds (bulk)"
      subtitle={`${records.length} passengers · ${primaryRecord.country}`}
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
              Selected services: {selectedServiceKeys.length}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
              Combined total: {allocationSummary.grandTotal > 0 ? formatInr(allocationSummary.grandTotal) : '—'}
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
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 0.75 }}>
            Passenger totals
          </Typography>
          <Stack spacing={0.75} divider={<Divider flexItem />}>
            {allocationSummary.perPassenger.map(entry => (
              <Stack
                key={entry.record.id}
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                spacing={1}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                    {entry.record.passengerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }} noWrap>
                    {entry.record.visaType} · {entry.record.jurisdiction || '—'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                  {entry.totalAmount > 0 ? formatInr(entry.totalAmount) : '—'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

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
                  ? 'No VFS services are configured for the selected passengers in country master.'
                  : 'No services match your search.'}
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {filteredServices.map((service: VfsPickerService) => {
                const amountLabel = formatBulkServiceAmountLabel(service.id, records)
                const formattedAmount =
                  amountLabel === '—'
                    ? '—'
                    : amountLabel.includes('-')
                      ? amountLabel
                          .split('-')
                          .map(part => formatInr(Number(part)))
                          .join(' – ')
                      : formatInr(Number(amountLabel))

                return (
                  <Stack
                    key={service.id}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={vfsServicePickerServiceRowSx}
                  >
                    <Checkbox
                      checked={selectedServiceKeys.includes(service.id)}
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
                      {formattedAmount}
                    </Typography>
                  </Stack>
                )
              })}
            </Stack>
          )}
        </Box>

        <Divider />

        <Stack spacing={1.5}>
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
