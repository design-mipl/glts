import { useEffect, useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { FormField, Input, Modal, Select, Toggle, Button } from '@/design-system/UIComponents'
import type { VendorServiceMapping } from '@/shared/types/vendor'
import { getVendorServiceMasterOptions } from '../utils/vendorServiceMasterOptions'

export interface VendorServiceMappingDraft {
  id?: string
  serviceMasterId: string
  vendorRate: number
  clientBillingRate: number
  gstApplicable: boolean
  status: 'active' | 'inactive'
}

const EMPTY_DRAFT: VendorServiceMappingDraft = {
  serviceMasterId: '',
  vendorRate: 0,
  clientBillingRate: 0,
  gstApplicable: true,
  status: 'active',
}

interface VendorServiceMappingModalProps {
  open: boolean
  mapping?: VendorServiceMapping | null
  usedServiceIds: string[]
  onClose: () => void
  onSave: (mapping: VendorServiceMapping) => void
}

export function VendorServiceMappingModal({
  open,
  mapping,
  usedServiceIds,
  onClose,
  onSave,
}: VendorServiceMappingModalProps) {
  const [draft, setDraft] = useState<VendorServiceMappingDraft>(EMPTY_DRAFT)

  useEffect(() => {
    if (!open) return
    if (mapping) {
      setDraft({
        id: mapping.id,
        serviceMasterId: mapping.serviceMasterId,
        vendorRate: mapping.vendorRate,
        clientBillingRate: mapping.clientBillingRate,
        gstApplicable: mapping.gstApplicable,
        status: mapping.status,
      })
    } else {
      setDraft(EMPTY_DRAFT)
    }
  }, [open, mapping])

  const serviceOptions = useMemo(() => {
    const all = getVendorServiceMasterOptions()
    return all.filter((opt) => opt.value === mapping?.serviceMasterId || !usedServiceIds.includes(opt.value))
  }, [mapping?.serviceMasterId, usedServiceIds])

  const clientBillingRate = mapping?.clientBillingRate ?? draft.clientBillingRate
  const margin = clientBillingRate - draft.vendorRate

  const handleSave = () => {
    if (!draft.serviceMasterId) return
    onSave({
      id: draft.id ?? `vsm-${Date.now()}`,
      serviceMasterId: draft.serviceMasterId,
      vendorRate: draft.vendorRate,
      clientBillingRate,
      margin,
      gstApplicable: draft.gstApplicable,
      status: draft.status,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mapping ? 'Edit service mapping' : 'Add service mapping'}
      size="md"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Save mapping" onClick={handleSave} disabled={!draft.serviceMasterId} />
        </Stack>
      }
    >
      <FormField label="Service" required>
        <Select
          value={draft.serviceMasterId}
          onChange={(v) => setDraft((d) => ({ ...d, serviceMasterId: String(v) }))}
          options={serviceOptions}
          placeholder="Select service from Service Master"
          fullWidth
          disabled={Boolean(mapping)}
        />
      </FormField>
      <FormField label="Vendor rate" required>
        <Input
          type="number"
          value={String(draft.vendorRate)}
          onChange={(v) => setDraft((d) => ({ ...d, vendorRate: Number(v) || 0 }))}
          placeholder="Vendor rate"
          fullWidth
        />
      </FormField>
      <FormField label="GST applicable">
        <Toggle
          checked={draft.gstApplicable}
          onChange={(checked) => setDraft((d) => ({ ...d, gstApplicable: checked }))}
          label={draft.gstApplicable ? 'Yes' : 'No'}
        />
      </FormField>
      <FormField label="Status">
        <Select
          value={draft.status}
          onChange={(v) => setDraft((d) => ({ ...d, status: v as 'active' | 'inactive' }))}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          fullWidth
        />
      </FormField>
    </Modal>
  )
}
