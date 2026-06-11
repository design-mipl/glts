import { FormField, Input, MultiSelect, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { sacCodeMasterService } from '@/shared/services/sacCodeMasterService'
import { taxMasterService } from '@/shared/services/taxMasterService'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import type { ServiceMasterFormData } from '@/shared/types/serviceMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import { SERVICE_TYPE_OPTIONS } from '../config/serviceTypeConfig'

type ServiceFormSection = 'basic' | 'pricingTax' | 'applicability' | 'status'

interface ServiceFormFieldsProps {
  formData: ServiceMasterFormData
  onChange: (data: ServiceMasterFormData) => void
  errors: Record<string, string>
  section: ServiceFormSection
}

export function ServiceFormFields({ formData, onChange, errors, section }: ServiceFormFieldsProps) {
  const patch = (partial: Partial<ServiceMasterFormData>) => onChange({ ...formData, ...partial })

  const sacOptions = [{ value: '', label: 'None' }, ...sacCodeMasterService.listActiveOptions()]
  const gstOptions = [{ value: '', label: 'None' }, ...taxMasterService.listActiveGstOptions()]
  const tdsOptions = [{ value: '', label: 'None' }, ...taxMasterService.listActiveTdsOptions()]

  if (section === 'basic') {
    return (
      <>
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
        <FormField
          label="Service type"
          required
          error={Boolean(errors.serviceType)}
          helperText={errors.serviceType}
        >
          <Select
            value={formData.serviceType}
            onChange={(value) => patch({ serviceType: value as ServiceMasterFormData['serviceType'] })}
            placeholder="Select service type"
            options={SERVICE_TYPE_OPTIONS}
            size="sm"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(value) => patch({ description: value })}
              placeholder="Enter service description"
              rows={3}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </>
    )
  }

  if (section === 'pricingTax') {
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
