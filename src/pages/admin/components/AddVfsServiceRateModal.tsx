import { useEffect, useMemo, useState } from 'react'
import { FormField, FormSection, Input, Modal, Select, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { vendorService } from '@/shared/services/vendorService'
import type { CountryVfsServiceRate } from '@/shared/types/countryMaster'

export interface VfsServiceRateFormValues {
  serviceName: string
  amount: number
  gstIncluded: boolean
  vendorId: string
  vendorName: string
}

interface AddVfsServiceRateModalProps {
  open: boolean
  editRate?: CountryVfsServiceRate
  onClose: () => void
  onSubmit: (values: VfsServiceRateFormValues) => void
}

const EMPTY_FORM: VfsServiceRateFormValues = {
  serviceName: '',
  amount: 0,
  gstIncluded: false,
  vendorId: '',
  vendorName: '',
}

export function AddVfsServiceRateModal({
  open,
  editRate,
  onClose,
  onSubmit,
}: AddVfsServiceRateModalProps) {
  const [form, setForm] = useState<VfsServiceRateFormValues>(EMPTY_FORM)
  const [amountInput, setAmountInput] = useState('')
  const [serviceNameError, setServiceNameError] = useState<string | undefined>()
  const [amountError, setAmountError] = useState<string | undefined>()
  const [vendorError, setVendorError] = useState<string | undefined>()

  const isEdit = Boolean(editRate)

  const vendorOptions = useMemo(
    () =>
      vendorService.list({ category: 'visa_processing', status: 'active' }).map(vendor => ({
        value: vendor.id,
        label: vendor.vendorName,
      })),
    [],
  )

  useEffect(() => {
    if (!open) return
    if (editRate) {
      setForm({
        serviceName: editRate.serviceName,
        amount: editRate.amount,
        gstIncluded: editRate.gstIncluded,
        vendorId: editRate.vendorId ?? '',
        vendorName: editRate.vendorName ?? '',
      })
      setAmountInput(String(editRate.amount))
    } else {
      setForm(EMPTY_FORM)
      setAmountInput('')
    }
    setServiceNameError(undefined)
    setAmountError(undefined)
    setVendorError(undefined)
  }, [editRate, open])

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setAmountInput('')
    setServiceNameError(undefined)
    setAmountError(undefined)
    setVendorError(undefined)
    onClose()
  }

  const handleSave = () => {
    const serviceName = form.serviceName.trim()
    const parsedAmount = Number(amountInput)
    const vendorId = form.vendorId.trim()
    const vendorName =
      vendorOptions.find(option => option.value === vendorId)?.label ?? form.vendorName.trim()

    let valid = true
    if (!serviceName) {
      setServiceNameError('Service name is required')
      valid = false
    } else {
      setServiceNameError(undefined)
    }

    if (!amountInput.trim() || Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setAmountError('Enter a valid rate')
      valid = false
    } else {
      setAmountError(undefined)
    }

    if (!vendorId || !vendorName) {
      setVendorError('Select a visa-processing vendor')
      valid = false
    } else {
      setVendorError(undefined)
    }

    if (!valid) return

    onSubmit({
      serviceName,
      amount: parsedAmount,
      gstIncluded: form.gstIncluded,
      vendorId,
      vendorName,
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title={isEdit ? 'Edit consulate service' : 'Add consulate service'}
      subtitle="Configure a service charge and map it to a visa-processing vendor."
      footer={
        <AdminFullPageFormFooter
          onCancel={handleClose}
          onSave={handleSave}
          saveLabel={isEdit ? 'Save service' : 'Add service'}
        />
      }
    >
      <FormSection columns={1}>
        <FormField
          label="Service name"
          required
          error={Boolean(serviceNameError)}
          helperText={serviceNameError}
        >
          <Input
            fullWidth
            value={form.serviceName}
            placeholder="e.g. Premium Lounge"
            onChange={value => setForm(prev => ({ ...prev, serviceName: value }))}
            error={Boolean(serviceNameError)}
          />
        </FormField>
        <FormField
          label="Rate (INR)"
          required
          error={Boolean(amountError)}
          helperText={amountError}
        >
          <Input
            fullWidth
            value={amountInput}
            placeholder="e.g. 1800"
            onChange={setAmountInput}
            error={Boolean(amountError)}
          />
        </FormField>
        <FormField
          label="Vendor"
          required
          error={Boolean(vendorError)}
          helperText={vendorError ?? 'Only vendors in the Visa Processing category are listed.'}
        >
          <Select
            fullWidth
            value={form.vendorId}
            onChange={value => {
              const vendorId = String(value)
              const vendorName = vendorOptions.find(option => option.value === vendorId)?.label ?? ''
              setForm(prev => ({ ...prev, vendorId, vendorName }))
            }}
            options={vendorOptions}
            placeholder="Select visa-processing vendor"
            error={Boolean(vendorError)}
          />
        </FormField>
        <FormField label="GST included">
          <Toggle
            checked={form.gstIncluded}
            onChange={gstIncluded => setForm(prev => ({ ...prev, gstIncluded }))}
            label={form.gstIncluded ? 'Rate includes GST' : 'Rate excludes GST'}
            size="sm"
          />
        </FormField>
      </FormSection>
    </Modal>
  )
}
