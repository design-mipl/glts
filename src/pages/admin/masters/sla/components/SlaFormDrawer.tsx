import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { slaMasterService } from '@/shared/services/slaMasterService'
import type { SlaMaster } from '@/shared/types/slaMaster'
import { INITIAL_SLA_FORM, slaToFormData, useSlaForm } from '../hooks/useSlaForm'
import { SlaFormFields } from './SlaFormFields'
import { SlaHoursMatrix } from './SlaHoursMatrix'

interface SlaFormDrawerProps {
  open: boolean
  record?: SlaMaster | null
  onClose: () => void
  onSaved: () => void
}

/** Wide enough for tab rows × single + 3 bulk band columns. */
const DRAWER_WIDTH = 920

export function SlaFormDrawer({ open, record, onClose, onSaved }: SlaFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, setErrors, validate, reset } = useSlaForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? slaToFormData(record) : INITIAL_SLA_FORM)
    }
  }, [open, record?.id, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) {
      showToast({
        title: 'Fix SLA hours',
        description: 'Enter hours for at least one tab in each column (single and bulk bands).',
        variant: 'error',
      })
      return
    }

    setLoading(true)
    const result =
      isEdit && record
        ? slaMasterService.update(record.id, formData)
        : slaMasterService.create(formData)
    setLoading(false)

    if (!result) return

    if ('error' in result) {
      if (result.error === 'duplicate_segment') {
        showToast({
          title: 'Submodule already configured',
          description: 'An SLA already exists for this module and submodule.',
          variant: 'error',
        })
        setErrors((prev) => ({ ...prev, segment: 'SLA already exists for this submodule' }))
        return
      }
      if (result.error === 'invalid_single_sum' || result.error === 'invalid_bulk_sum') {
        showToast({
          title: 'Invalid hours',
          description: 'Check tab hours for each column and try again.',
          variant: 'error',
        })
        validate()
        return
      }
      if (result.error === 'empty_e2e') {
        showToast({
          title: 'Hours required',
          description: 'Enter hours for at least one tab in each column.',
          variant: 'error',
        })
        validate()
        return
      }
      return
    }

    showToast({
      title: isEdit ? 'SLA updated' : 'SLA created',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit SLA' : 'Create SLA'}
      subtitle="Select module and submodule, then set hours per tab for single and bulk bands"
      width={DRAWER_WIDTH}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
          saveLabel="Save SLA"
        />
      }
      sections={[
        {
          id: 'scope',
          title: 'Module & submodule',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <SlaFormFields
              formData={formData}
              onChange={setFormData}
              errors={errors}
              moduleDisabled={isEdit}
              submoduleDisabled={isEdit}
            />
          ),
        },
        {
          id: 'hours-matrix',
          title: 'Listing tab hours',
          columns: 1,
          children: (
            <SlaHoursMatrix formData={formData} errors={errors} onChange={setFormData} />
          ),
        },
      ]}
    />
  )
}
