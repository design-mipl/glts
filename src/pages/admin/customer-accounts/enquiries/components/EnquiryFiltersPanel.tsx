import { DatePicker, FormField, FormSection, Input, Select } from '@/design-system/UIComponents'
import {
  enquiryCustomerTypeOptions,
  enquiryPriorityOptions,
  enquirySourceOptions,
  enquiryStatusOptions,
} from '../config/enquiryFilterConfig'

export interface EnquiryQuickFilters {
  dateFrom?: string
  dateTo?: string
  customerType?: string
  countryRequirement?: string
  visaType?: string
  priority?: string
  assignedTeam?: string
  assignedUser?: string
  status?: string
  marineRequirement?: string
  source?: string
}

interface EnquiryFiltersPanelProps {
  value: EnquiryQuickFilters
  onChange: (next: EnquiryQuickFilters) => void
}

export function EnquiryFiltersPanel({ value, onChange }: EnquiryFiltersPanelProps) {
  const patch = (next: Partial<EnquiryQuickFilters>) => onChange({ ...value, ...next })

  return (
    <FormSection title="Advanced filters" columns={3}>
      <FormField label="Date from">
        <DatePicker
          value={value.dateFrom ? new Date(value.dateFrom) : null}
          onChange={(date) => patch({ dateFrom: date?.toISOString() })}
          fullWidth
        />
      </FormField>
      <FormField label="Date to">
        <DatePicker
          value={value.dateTo ? new Date(value.dateTo) : null}
          onChange={(date) => patch({ dateTo: date?.toISOString() })}
          fullWidth
        />
      </FormField>
      <FormField label="Customer type">
        <Select
          value={value.customerType ?? ''}
          onChange={(next) => patch({ customerType: String(next) })}
          options={enquiryCustomerTypeOptions}
          fullWidth
        />
      </FormField>
      <FormField label="Country requirement">
        <Input value={value.countryRequirement ?? ''} onChange={(next) => patch({ countryRequirement: next })} fullWidth />
      </FormField>
      <FormField label="Visa type">
        <Input value={value.visaType ?? ''} onChange={(next) => patch({ visaType: next })} fullWidth />
      </FormField>
      <FormField label="Priority">
        <Select
          value={value.priority ?? ''}
          onChange={(next) => patch({ priority: String(next) })}
          options={enquiryPriorityOptions}
          fullWidth
        />
      </FormField>
      <FormField label="Assigned team">
        <Input value={value.assignedTeam ?? ''} onChange={(next) => patch({ assignedTeam: next })} fullWidth />
      </FormField>
      <FormField label="Assigned user">
        <Input value={value.assignedUser ?? ''} onChange={(next) => patch({ assignedUser: next })} fullWidth />
      </FormField>
      <FormField label="Enquiry status">
        <Select
          value={value.status ?? ''}
          onChange={(next) => patch({ status: String(next) })}
          options={enquiryStatusOptions}
          fullWidth
        />
      </FormField>
      <FormField label="Marine requirement">
        <Select
          value={value.marineRequirement ?? ''}
          onChange={(next) => patch({ marineRequirement: String(next) })}
          options={[
            { label: 'All', value: '' },
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
          fullWidth
        />
      </FormField>
      <FormField label="Inquiry source">
        <Select
          value={value.source ?? ''}
          onChange={(next) => patch({ source: String(next) })}
          options={enquirySourceOptions}
          fullWidth
        />
      </FormField>
    </FormSection>
  )
}
