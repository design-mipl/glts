import { FormField, Input, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { CountryMasterFormData } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_OPTIONS,
  PROCESSING_TYPE_OPTIONS,
  VISA_CATEGORY_OPTIONS,
} from '../config/countryProcessingConfig'

interface CountryFormBasicFieldsProps {
  data: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  variant?: 'primary' | 'portal'
}

export function CountryFormBasicFields({
  data,
  onChange,
  variant = 'primary',
}: CountryFormBasicFieldsProps) {
  const patch = (partial: Partial<CountryMasterFormData>) => onChange({ ...data, ...partial })

  if (variant === 'portal') {
    return (
      <>
        <FormField label="Hero photo ID">
          <Input
            value={data.heroPhotoId}
            onChange={(value) => patch({ heroPhotoId: value })}
            placeholder="e.g. china-hero"
            fullWidth
          />
        </FormField>
        <FormField label="Cities">
          <Input
            value={data.cities}
            onChange={(value) => patch({ cities: value })}
            placeholder="Mumbai, Delhi"
            fullWidth
          />
        </FormField>
        <FormField label="Display processing time">
          <Input
            value={data.processingTime}
            onChange={(value) => patch({ processingTime: value })}
            fullWidth
          />
        </FormField>
        <FormField label="Price (INR)">
          <Input
            type="number"
            value={String(data.price)}
            onChange={(value) => patch({ price: Number(value) || 0 })}
            fullWidth
          />
        </FormField>
        <FormField label="Rating %">
          <Input
            type="number"
            value={String(data.rating)}
            onChange={(value) => patch({ rating: Number(value) || 0 })}
            fullWidth
          />
        </FormField>
        <FormField label="Validity label">
          <Input value={data.validity} onChange={(value) => patch({ validity: value })} fullWidth />
        </FormField>
        <FormField label="Visa category">
          <Select
            value={data.visaCategory}
            onChange={(value) => patch({ visaCategory: String(value) })}
            options={VISA_CATEGORY_OPTIONS.map((v) => ({ value: v, label: v }))}
            fullWidth
          />
        </FormField>
        <FormField label="Fast minutes (optional)">
          <Input
            type="number"
            value={data.fastMinutes != null ? String(data.fastMinutes) : ''}
            onChange={(value) =>
              patch({
                fastMinutes: value ? Number(value) : undefined,
              })
            }
            fullWidth
          />
        </FormField>
        <FormField label="Trending on website">
          <Toggle
            checked={data.trending}
            onChange={(checked) => patch({ trending: checked })}
            label={data.trending ? 'Trending' : 'Not trending'}
          />
        </FormField>
        <FormField label="Trending %">
          <Input
            type="number"
            value={String(data.trendingPercent)}
            onChange={(value) => patch({ trendingPercent: Number(value) || 0 })}
            fullWidth
          />
        </FormField>
      </>
    )
  }

  return (
    <>
      <FormField label="Country name">
        <Input
          value={data.name}
          onChange={(value) => patch({ name: value })}
          placeholder="China"
          fullWidth
        />
      </FormField>
      <FormField label="Country code">
        <Input
          value={data.code}
          onChange={(value) => patch({ code: value.toUpperCase() })}
          placeholder="CN"
          fullWidth
        />
      </FormField>
      <FormField label="Country flag" helperText="Emoji or image URL">
        <Input
          value={data.flag}
          onChange={(value) => patch({ flag: value })}
          placeholder="🇨🇳"
          fullWidth
        />
      </FormField>
      <FormField label="Region">
        <Input
          value={data.region}
          onChange={(value) => patch({ region: value })}
          placeholder="Asia"
          fullWidth
        />
      </FormField>
      <FormField label="Processing type">
        <Select
          value={data.processingType}
          onChange={(value) =>
            patch({ processingType: value as CountryMasterFormData['processingType'] })
          }
          options={PROCESSING_TYPE_OPTIONS}
          fullWidth
        />
      </FormField>
      <FormField label="Status">
        <Select
          value={data.status}
          onChange={(value) =>
            patch({ status: value as CountryMasterFormData['status'] })
          }
          options={COUNTRY_STATUS_OPTIONS}
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Embassy / consulate notes">
          <Textarea
            value={data.embassyNotes}
            onChange={(value) => patch({ embassyNotes: value })}
            minRows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <AdminFullPageFormFieldSpan>
        <FormField label="Internal operational notes">
          <Textarea
            value={data.internalNotes}
            onChange={(value) => patch({ internalNotes: value })}
            minRows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
