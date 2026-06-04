import { useMemo } from 'react'
import { FormField, Input, MultiSelect, Select, Textarea } from '@/design-system/UIComponents'
import { sacCodeMasterService } from '@/shared/services/sacCodeMasterService'
import { taxMasterService } from '@/shared/services/taxMasterService'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import type { ServiceMasterFormData } from '@/shared/types/serviceMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import {
  getServiceSubcategoryOptions,
  SERVICE_CATEGORY_OPTIONS,
} from '../config/serviceClassificationConfig'

type ServiceFormSection =
  | 'basic'
  | 'classification'
  | 'pricing'
  | 'tax'
  | 'applicability'
  | 'status'

interface ServiceFormFieldsProps {
  formData: ServiceMasterFormData
  onChange: (data: ServiceMasterFormData) => void
  errors: Record<string, string>
  section: ServiceFormSection
}

export function ServiceFormFields({ formData, onChange, errors, section }: ServiceFormFieldsProps) {
  const patch = (partial: Partial<ServiceMasterFormData>) => onChange({ ...formData, ...partial })

  const subcategoryOptions = useMemo(
    () => getServiceSubcategoryOptions(formData.category),
    [formData.category],
  )

  const sacOptions = [{ value: '', label: 'None' }, ...sacCodeMasterService.listActiveOptions()]
  const gstOptions = [{ value: '', label: 'None' }, ...taxMasterService.listActiveGstOptions()]
  const tdsOptions = [{ value: '', label: 'None' }, ...taxMasterService.listActiveTdsOptions()]

  if (section === 'basic') {
    return (
      <>
        <FormField
          label="Service code"
          required
          error={Boolean(errors.serviceCode)}
          helperText={errors.serviceCode}
        >
          <Input
            value={formData.serviceCode}
            onChange={(value) => patch({ serviceCode: value })}
            placeholder="Enter service code"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="Service name"
          required
          error={Boolean(errors.serviceName)}
          helperText={errors.serviceName}
        >
          <Input
            value={formData.serviceName}
            onChange={(value) => patch({ serviceName: value })}
            placeholder="Enter service name"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            value={formData.description}
            onChange={(value) => patch({ description: value })}
            placeholder="Enter service description"
            rows={3}
            fullWidth
          />
        </FormField>
      </>
    )
  }

  if (section === 'classification') {
    return (
      <>
        <FormField
          label="Category"
          required
          error={Boolean(errors.category)}
          helperText={errors.category}
        >
          <Select
            value={formData.category}
            onChange={(value) =>
              patch({
                category: value as ServiceMasterFormData['category'],
                subcategory: '',
              })
            }
            placeholder="Select category"
            options={SERVICE_CATEGORY_OPTIONS}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="Subcategory"
          required
          error={Boolean(errors.subcategory)}
          helperText={errors.subcategory}
        >
          <Select
            value={formData.subcategory}
            onChange={(value) => patch({ subcategory: String(value) })}
            placeholder="Select subcategory"
            options={subcategoryOptions}
            disabled={!formData.category}
            size="sm"
            fullWidth
          />
        </FormField>
      </>
    )
  }

  if (section === 'pricing') {
    return (
      <>
        <FormField
          label="Default price"
          error={Boolean(errors.defaultPrice)}
          helperText={errors.defaultPrice}
        >
          <Input
            value={formData.defaultPrice}
            onChange={(value) => patch({ defaultPrice: value })}
            placeholder="Enter default service price"
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
        <FormField label="Mapped SAC code">
          <Select
            value={formData.mappedSacCodeId}
            onChange={(value) => patch({ mappedSacCodeId: String(value) })}
            placeholder="Select SAC code"
            options={sacOptions}
            clearable
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="GST rate">
          <Select
            value={formData.gstRateId}
            onChange={(value) => patch({ gstRateId: String(value) })}
            placeholder="Select GST rate"
            options={gstOptions}
            clearable
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="TDS section">
          <Select
            value={formData.tdsSectionId}
            onChange={(value) => patch({ tdsSectionId: String(value) })}
            placeholder="Select TDS section"
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
      <FormField
        label="Applicable for"
        required
        error={Boolean(errors.applicableFor)}
        helperText={errors.applicableFor}
      >
        <MultiSelect
          value={formData.applicableFor}
          onChange={(value) =>
            patch({ applicableFor: value as ServiceMasterFormData['applicableFor'] })
          }
          placeholder="Select applicability"
          options={MASTER_APPLICABILITY_OPTIONS}
          searchable
          size="sm"
          fullWidth
        />
      </FormField>
    )
  }

  return (
    <FormField label="Status" required>
      <Select
        value={formData.status}
        onChange={(value) => patch({ status: value as ServiceMasterFormData['status'] })}
        placeholder="Select status"
        options={(
          Object.entries(masterStatusLabel) as [ServiceMasterFormData['status'], string][]
        ).map(([value, label]) => ({ value, label }))}
        size="sm"
        fullWidth
      />
    </FormField>
  )
}
