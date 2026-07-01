import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Input, Modal } from '@/design-system/UIComponents'
import { resolveOfferingVfsServiceRates } from '@/shared/services/countryMasterService'
import { embassyVfsFeeMasterService } from '@/shared/services/embassyVfsFeeMasterService'
import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import {
  addVfsServicesModalContentSx,
  addVfsServicesModalEmptyStateSx,
  addVfsServicesModalLayout,
  addVfsServicesModalListSx,
  addVfsServicesModalServiceRowSx,
} from './addVfsServicesModalLayout'

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

interface PickerService {
  id: string
  serviceName: string
  amount: number
  gstIncluded?: boolean
  embassyFeeServiceId?: string
}

function resolvePickerServices(
  country: string,
  visaType: string,
  countryId?: string,
  visaOfferingId?: string,
  jurisdictionId?: string,
): PickerService[] {
  if (countryId && visaOfferingId) {
    const rates = resolveOfferingVfsServiceRates(countryId, visaOfferingId, jurisdictionId)
    if (rates.length > 0) {
      return rates.map(rate => ({
        id: rate.id,
        serviceName: rate.serviceName,
        amount: rate.amount,
        gstIncluded: rate.gstIncluded,
        embassyFeeServiceId: rate.embassyFeeServiceId,
      }))
    }
  }

  const rateCard = embassyVfsFeeMasterService.resolveRateCardForApplication(country, visaType)
  return rateCard.services.map(service => ({
    id: service.id,
    serviceName: service.serviceName,
    amount: service.amount,
    embassyFeeServiceId: service.id,
  }))
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function ContextLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="baseline">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: addVfsServicesModalLayout.bodyFontSize, minWidth: addVfsServicesModalLayout.contextLabelMinWidth }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: addVfsServicesModalLayout.bodyFontSize, fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

function isServiceAlreadyAdded(
  service: PickerService,
  existingCharges: FormAssistVfsServiceChargeLine[],
): boolean {
  return existingCharges.some(
    line =>
      line.id === service.id ||
      line.embassyFeeServiceId === service.id ||
      (service.embassyFeeServiceId != null && line.embassyFeeServiceId === service.embassyFeeServiceId) ||
      line.serviceName.trim().toLowerCase() === service.serviceName.trim().toLowerCase(),
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
    () => resolvePickerServices(country, visaType, countryId, visaOfferingId, jurisdictionId),
    [country, countryId, jurisdictionId, visaOfferingId, visaType],
  )

  const availableServices = useMemo(
    () => catalogServices.filter(service => !isServiceAlreadyAdded(service, existingCharges)),
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
    () => selectedServices.reduce((sum, service) => sum + service.amount, 0),
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
    const lines: FormAssistVfsServiceChargeLine[] = selectedServices.map((service, index) => ({
      id: `vfs-charge-${service.id}-${Date.now()}-${index}`,
      embassyFeeServiceId: service.embassyFeeServiceId ?? service.id,
      serviceName: service.serviceName,
      amount: service.amount,
      gstIncluded: service.gstIncluded,
    }))
    onAdd(lines)
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
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: addVfsServicesModalLayout.bodyFontSize }}>
              Selected Services: {selectedServices.length}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: addVfsServicesModalLayout.bodyFontSize }}>
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
      <Stack spacing={2} sx={addVfsServicesModalContentSx}>
        <Stack spacing={0.75}>
          <ContextLine label="Country" value={country} />
          <ContextLine label="Visa Type" value={visaType} />
        </Stack>

        <Divider />

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: addVfsServicesModalLayout.bodyFontSize }}>
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

        <Box sx={addVfsServicesModalListSx}>
          {filteredServices.length === 0 ? (
            <Box sx={addVfsServicesModalEmptyStateSx}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: addVfsServicesModalLayout.bodyFontSize }}>
                {availableServices.length === 0
                  ? 'All configured services for this country and visa type are already added.'
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
                  sx={addVfsServicesModalServiceRowSx}
                >
                  <Checkbox
                    checked={selectedIds.includes(service.id)}
                    onChange={checked => toggleService(service.id, checked)}
                    size="sm"
                  />
                  <Typography variant="body2" sx={{ flex: 1, fontSize: addVfsServicesModalLayout.bodyFontSize }}>
                    {service.serviceName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: addVfsServicesModalLayout.bodyFontSize,
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
