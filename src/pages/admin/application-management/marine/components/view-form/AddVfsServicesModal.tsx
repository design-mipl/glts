import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Input, Modal } from '@/design-system/UIComponents'
import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  isVfsPickerServiceSelected,
  mapVfsPickerServicesToChargeLines,
  resolveVfsPickerServices,
  sumVfsPickerServiceAmounts,
  type VfsPickerService,
} from '@/shared/utils/vfsServicePickerUtils'
import {
  vfsServicePickerEmptyStateSx,
  vfsServicePickerLayout,
  vfsServicePickerListSx,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'

interface AddVfsServicesModalProps {
  open: boolean
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  existingCharges: FormAssistVfsServiceChargeLine[]
  onClose: () => void
  onAdd: (lines: FormAssistVfsServiceChargeLine[]) => void
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

export function AddVfsServicesModal({
  open,
  country,
  visaType,
  countryId,
  visaOfferingId,
  jurisdictionId,
  existingCharges,
  onClose,
  onAdd,
}: AddVfsServicesModalProps) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIds([])
    }
  }, [open])

  const catalogServices = useMemo(
    () =>
      resolveVfsPickerServices({
        country,
        visaType,
        countryId,
        visaOfferingId,
        jurisdictionId,
      }),
    [country, countryId, jurisdictionId, visaOfferingId, visaType],
  )

  const availableServices = useMemo(
    () => catalogServices.filter(service => !isVfsPickerServiceSelected(service, existingCharges)),
    [catalogServices, existingCharges],
  )

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return availableServices
    return availableServices.filter(service => service.serviceName.toLowerCase().includes(query))
  }, [availableServices, search])

  const selectedServices = useMemo(
    () => availableServices.filter(service => selectedIds.includes(service.id)),
    [availableServices, selectedIds],
  )

  const selectedTotal = useMemo(
    () => sumVfsPickerServiceAmounts(selectedServices),
    [selectedServices],
  )

  const toggleService = (serviceId: string, checked: boolean) => {
    setSelectedIds(current =>
      checked ? [...new Set([...current, serviceId])] : current.filter(id => id !== serviceId),
    )
  }

  const handleClose = () => {
    setSearch('')
    setSelectedIds([])
    onClose()
  }

  const handleAdd = () => {
    if (selectedServices.length === 0) return
    onAdd(mapVfsPickerServicesToChargeLines(selectedServices))
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add VFS Service"
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
              Selected Services: {selectedServices.length}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
              Total Amount: {formatInr(selectedTotal)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={handleClose} />
            <Button
              label="Add services"
              onClick={handleAdd}
              disabled={selectedServices.length === 0}
            />
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Stack spacing={0.75}>
          <ContextLine label="Country" value={country} />
          <ContextLine label="Visa Type" value={visaType} />
        </Stack>

        <Divider />

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
            Search Service
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

        <Divider />

        <Box sx={vfsServicePickerListSx}>
          {filteredServices.length === 0 ? (
            <Box sx={vfsServicePickerEmptyStateSx}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
                {availableServices.length === 0
                  ? 'All configured services for this country and visa type are already added.'
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
                    checked={selectedIds.includes(service.id)}
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
      </Stack>
    </Modal>
  )
}
