import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Input, Modal } from '@/design-system/UIComponents'
import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import { formatVfsGstLabel } from '@/shared/utils/countryVfsServiceRateUtils'
import {
  vfsServicePickerEmptyStateSx,
  vfsServicePickerLayout,
  vfsServicePickerListSx,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'
import { formatPaymentAmountInr } from '../../utils/pendingPaymentUtils'

interface SelectPaymentServicesModalProps {
  open: boolean
  availableServices: FormAssistVfsServiceChargeLine[]
  onClose: () => void
  onAdd: (serviceIds: string[]) => void
}

export function SelectPaymentServicesModal({
  open,
  availableServices,
  onClose,
  onAdd,
}: SelectPaymentServicesModalProps) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIds([])
    }
  }, [open])

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
    () => selectedServices.reduce((sum, service) => sum + (Number(service.amount) || 0), 0),
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
    onAdd(selectedServices.map(service => service.id))
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add services to payment"
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
              Total amount: {formatPaymentAmountInr(selectedTotal)}
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
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
            Search service
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
                  ? 'All unpaid services are already added to this payment.'
                  : 'No services match your search.'}
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {filteredServices.map(service => (
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
                  <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
                      {service.serviceName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      GST: {formatVfsGstLabel(service.gstIncluded ?? false)}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: vfsServicePickerLayout.bodyFontSize,
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 600,
                    }}
                  >
                    {formatPaymentAmountInr(service.amount)}
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
