import { FormField, Input, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { CountryMasterFormData } from '@/shared/types/countryMaster'
import {
  PROCESSING_TYPE_OPTIONS,
  VISA_CATEGORY_OPTIONS,
} from '../config/countryProcessingConfig'
import { CountryFormImageField } from './CountryFormImageField'
import { CountryPassportIssueLocationsEditor } from './CountryPassportIssueLocationsEditor'

interface CountryFormBasicFieldsProps {
  data: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  /** Primary = country identity; portal = website/customer card presentation */
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
        <AdminFullPageFormFieldSpan>
          <CountryFormImageField
            label="Hero photo"
            value={data.heroPhotoId}
            onChange={(value) => patch({ heroPhotoId: value })}
            helperText="Cover image for website and customer portal destination cards"
            dropzoneTitle="Upload hero photo for destination cards"
            dropzoneCaption="PNG, JPG, WebP, or SVG — up to 2 MB"
          />
        </AdminFullPageFormFieldSpan>
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
            placeholder="e.g. 5–7 business days"
            fullWidth
          />
        </FormField>
        <FormField label="Price (INR)">
          <Input
            type="number"
            value={String(data.price)}
            onChange={(value) => patch({ price: Number(value) || 0 })}
            placeholder="0"
            fullWidth
          />
        </FormField>
        <FormField label="Rating %">
          <Input
            type="number"
            value={String(data.rating)}
            onChange={(value) => patch({ rating: Number(value) || 0 })}
            placeholder="0"
            fullWidth
          />
        </FormField>
        <FormField label="Validity label">
          <Input
            value={data.validity}
            onChange={(value) => patch({ validity: value })}
            placeholder="e.g. 90 days"
            fullWidth
          />
        </FormField>
        <FormField label="Visa category">
          <Select
            value={data.visaCategory}
            onChange={(value) => patch({ visaCategory: String(value) })}
            placeholder="Select category"
            options={VISA_CATEGORY_OPTIONS.map((v) => ({ value: v, label: v }))}
            fullWidth
          />
        </FormField>
        <FormField label="Fast minutes" optional>
          <Input
            type="number"
            value={data.fastMinutes != null ? String(data.fastMinutes) : ''}
            onChange={(value) =>
              patch({
                fastMinutes: value ? Number(value) : undefined,
              })
            }
            placeholder="Optional"
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
            placeholder="0"
            fullWidth
          />
        </FormField>
      </>
    )
  }

  return (
    <>
      <FormField label="Country name" required>
        <Input
          value={data.name}
          onChange={(value) => patch({ name: value })}
          placeholder="China"
          fullWidth
        />
      </FormField>
      <FormField label="Country code" required>
        <Input
          value={data.code}
          onChange={(value) => patch({ code: value.toUpperCase() })}
          placeholder="CN"
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <CountryFormImageField
          label="Country flag"
          value={data.flag}
          onChange={(value) => patch({ flag: value })}
          helperText="Flag image for listings and destination cards"
          dropzoneTitle="Upload flag image"
          dropzoneCaption="PNG, JPG, WebP, or SVG — up to 2 MB"
        />
      </AdminFullPageFormFieldSpan>
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
          placeholder="Select processing type"
          options={PROCESSING_TYPE_OPTIONS}
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Embassy / consulate notes" optional>
          <Textarea
            value={data.embassyNotes}
            onChange={(value) => patch({ embassyNotes: value })}
            placeholder="Embassy-specific requirements or submission notes"
            minRows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <CountryPassportIssueLocationsEditor
        locations={data.passportIssueLocations}
        onChange={(passportIssueLocations) => patch({ passportIssueLocations })}
      />
      <AdminFullPageFormFieldSpan>
        <FormField label="Internal operational notes" optional>
          <Textarea
            value={data.internalNotes}
            onChange={(value) => patch({ internalNotes: value })}
            placeholder="Internal-only guidance for operations teams"
            minRows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
