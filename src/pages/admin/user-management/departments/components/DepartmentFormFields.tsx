import { FormField, Select, Textarea } from '@/design-system/UIComponents'
import { Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { MASTER_STATUS_FILTER_OPTIONS } from '@/pages/admin/masters/config/masterStatusConfig'
import type { DepartmentMasterFormData } from '@/shared/types/departmentMaster'

interface DepartmentFormFieldsProps {
  formData: DepartmentMasterFormData
  onChange: (next: DepartmentMasterFormData) => void
  errors: Record<string, string>
}

export function DepartmentFormFields({ formData, onChange, errors }: DepartmentFormFieldsProps) {
  const update = (patch: Partial<DepartmentMasterFormData>) => onChange({ ...formData, ...patch })

  const statusOptions = MASTER_STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'all').map(
    (o) => ({ value: o.value, label: o.label }),
  )

  return (
    <>
      <AdminFullPageFormFieldSpan>
        <FormField
          label="Department name"
          required
          error={Boolean(errors.name)}
          helperText={errors.name}
        >
          <Input
            value={formData.name}
            onChange={(v) => update({ name: v })}
            placeholder="e.g. Operations, Finance & Accounts"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <AdminFullPageFormFieldSpan>
        <FormField label="Description" optional>
          <Textarea
            value={formData.description}
            onChange={(v) => update({ description: v })}
            placeholder="Brief description of department responsibilities"
            rows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <AdminFullPageFormFieldSpan>
        <FormField label="Status" required error={Boolean(errors.status)} helperText={errors.status}>
          <Select
            value={formData.status}
            onChange={(v) =>
              update({ status: String(v) as DepartmentMasterFormData['status'] })
            }
            options={statusOptions}
            placeholder="Select status"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
