import { FormField, Input, MultiSelect, Select, Textarea } from '@/design-system/UIComponents'
import { taxMasterService } from '@/shared/services/taxMasterService'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import type { SacCodeMasterFormData } from '@/shared/types/sacCodeMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import { SAC_CATEGORY_OPTIONS } from '../config/sacCategoryOptions'

type SacFormSection = 'basic' | 'tax' | 'applicability' | 'status'

interface SacCodeFormFieldsProps {
  formData: SacCodeMasterFormData
  onChange: (data: SacCodeMasterFormData) => void
  errors: Record<string, string>
  section: SacFormSection
}

export function SacCodeFormFields({ formData, onChange, errors, section }: SacCodeFormFieldsProps) {
  const patch = (partial: Partial<SacCodeMasterFormData>) => onChange({ ...formData, ...partial })
  const gstOptions = taxMasterService.listActiveGstOptions()
  const tdsOptions = [{ value: '', label: 'None' }, ...taxMasterService.listActiveTdsOptions()]

  if (section === 'basic') {
    return (
      <>
      <FormField
        label="SAC code"
        required
        error={Boolean(errors.sacCode)}
        helperText={errors.sacCode}
      >
        <Input
          value={formData.sacCode}
          onChange={(value) => patch({ sacCode: value })}
          placeholder="Enter SAC code"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField
        label="SAC title"
        required
        error={Boolean(errors.sacTitle)}
        helperText={errors.sacTitle}
      >
        <Input
          value={formData.sacTitle}
          onChange={(value) => patch({ sacTitle: value })}
          placeholder="Enter SAC title"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Description">
        <Textarea
          value={formData.description}
          onChange={(value) => patch({ description: value })}
          placeholder="Enter SAC description"
          rows={3}
          fullWidth
        />
      </FormField>
      <FormField
        label="Category"
        required
        error={Boolean(errors.category)}
        helperText={errors.category}
      >
        <Select
          value={formData.category}
          onChange={(value) => patch({ category: value as SacCodeMasterFormData['category'] })}
          placeholder="Select category"
          options={SAC_CATEGORY_OPTIONS}
          size="sm"
          fullWidth
        />
      </FormField>
      </>
    )
  }

  if (section === 'tax') {
    return (
      <>
      <FormField
        label="Default GST rate"
        required
        error={Boolean(errors.defaultGstRateId)}
        helperText={errors.defaultGstRateId}
      >
        <Select
          value={formData.defaultGstRateId}
          onChange={(value) => patch({ defaultGstRateId: String(value) })}
          placeholder="Select default GST rate"
          options={gstOptions}
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Default TDS section">
        <Select
          value={formData.defaultTdsSectionId}
          onChange={(value) => patch({ defaultTdsSectionId: String(value) })}
          placeholder="Select default TDS section"
          options={tdsOptions}
          clearable
          size="sm"
          fullWidth
        />
      </FormField>
      </>
    )
  }

  if (section === 'applicability') {
    return (
      <>
      <FormField
        label="Applicable for"
        required
        error={Boolean(errors.applicableFor)}
        helperText={errors.applicableFor}
      >
        <MultiSelect
          value={formData.applicableFor}
          onChange={(value) =>
            patch({ applicableFor: value as SacCodeMasterFormData['applicableFor'] })
          }
          placeholder="Select applicability"
          options={MASTER_APPLICABILITY_OPTIONS}
          searchable
          size="sm"
          fullWidth
        />
      </FormField>
      </>
    )
  }

  return (
    <FormField label="Status" required>
        <Select
          value={formData.status}
          onChange={(value) => patch({ status: value as SacCodeMasterFormData['status'] })}
          placeholder="Select status"
          options={(
            Object.entries(masterStatusLabel) as [SacCodeMasterFormData['status'], string][]
          ).map(([value, label]) => ({ value, label }))}
          size="sm"
          fullWidth
        />
      </FormField>
  )
}
