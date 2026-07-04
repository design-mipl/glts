import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { FormField, FormSection, Input, Modal, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import type { CountryVfsServiceRate } from '@/shared/types/countryMaster'

export interface VfsServiceRateFormValues {
  serviceName: string
  amount: number
  gstIncluded: boolean
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

  const isEdit = Boolean(editRate)

  useEffect(() => {
    if (!open) return
    if (editRate) {
      setForm({
        serviceName: editRate.serviceName,
        amount: editRate.amount,
        gstIncluded: editRate.gstIncluded,
      })
      setAmountInput(String(editRate.amount))
    } else {
      setForm(EMPTY_FORM)
      setAmountInput('')
    }
    setServiceNameError(undefined)
    setAmountError(undefined)
  }, [editRate, open])

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setAmountInput('')
    setServiceNameError(undefined)
    setAmountError(undefined)
    onClose()
  }

  const handleSave = () => {
    const serviceName = form.serviceName.trim()
    const parsedAmount = Number(amountInput)

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

    if (!valid) return

    onSubmit({
      serviceName,
      amount: parsedAmount,
      gstIncluded: form.gstIncluded,
    })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title={isEdit ? 'Edit VFS service' : 'Add VFS service'}
      subtitle="Configure a service charge for this visa type or jurisdiction."
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
            onChange={(value) => setForm((prev) => ({ ...prev, serviceName: value }))}
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
        <FormField label="GST included">
          <Toggle
            checked={form.gstIncluded}
            onChange={(gstIncluded) => setForm((prev) => ({ ...prev, gstIncluded }))}
            label={form.gstIncluded ? 'Rate includes GST' : 'Rate excludes GST'}
            size="sm"
          />
        </FormField>
      </FormSection>
    </Modal>
  )
}
