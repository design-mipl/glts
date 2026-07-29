import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { departmentService } from '@/shared/services/departmentService'
import type { DepartmentMaster } from '@/shared/types/departmentMaster'
import {
  INITIAL_DEPARTMENT_FORM,
  departmentToFormData,
  useDepartmentForm,
} from '../hooks/useDepartmentForm'
import { DepartmentFormFields } from './DepartmentFormFields'

interface DepartmentFormDrawerProps {
  open: boolean
  record?: DepartmentMaster | null
  onClose: () => void
  onSaved: () => void
}

export function DepartmentFormDrawer({
  open,
  record,
  onClose,
  onSaved,
}: DepartmentFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useDepartmentForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? departmentToFormData(record) : INITIAL_DEPARTMENT_FORM)
    }
  }, [open, record, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    const result =
      isEdit && record
        ? departmentService.update(record.id, formData)
        : departmentService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate department name',
        description: 'A department with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Department updated' : 'Department added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit department' : 'Add department'}
      subtitle="Organize users by organizational department"
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
        />
      }
      sections={[
        {
          id: 'department-details',
          title: 'Department details',
          description: 'Name, description, and status',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <DepartmentFormFields formData={formData} onChange={setFormData} errors={errors} />
          ),
        },
      ]}
    />
  )
}
