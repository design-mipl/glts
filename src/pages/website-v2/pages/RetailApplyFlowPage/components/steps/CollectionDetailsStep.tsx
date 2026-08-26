import { Box } from '@mui/material'
import { Input, Select, Textarea } from '@/design-system/UIComponents'
import {
  COLLECTION_DETAIL_FIELDS_BY_METHOD,
  listReceivingOfficeOptions,
  originalCollectionMethodLabel,
} from '@/shared/utils/originalDocumentCollectionUtils'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { StepShell } from '../StepShell'

interface CollectionDetailsStepProps {
  method: OriginalDocumentCollectionMethod
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onBack: () => void
  onContinue: () => void
}

export function CollectionDetailsStep({ method, values, onChange, onBack, onContinue }: CollectionDetailsStepProps) {
  const fields = COLLECTION_DETAIL_FIELDS_BY_METHOD[method]
  const officeOptions = listReceivingOfficeOptions()
  const requiredComplete = fields.filter((field) => field.required).every((field) => (values[field.key] ?? '').trim().length > 0)

  return (
    <StepShell
      title={`Details for: ${originalCollectionMethodLabel(method)}`}
      helperText="We'll use this to coordinate collection of your original documents."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!requiredComplete}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {fields.map((field) => {
          if (field.type === 'textarea') {
            return (
              <Box key={field.key} sx={{ gridColumn: '1 / -1' }}>
                <Textarea
                  label={field.label}
                  fullWidth
                  value={values[field.key] ?? ''}
                  onChange={(value) => onChange(field.key, value)}
                />
              </Box>
            )
          }
          if (field.type === 'select' && field.optionsKey === 'receivingOffice') {
            return (
              <Select
                key={field.key}
                label={field.label}
                fullWidth
                required={field.required}
                value={values[field.key] ?? ''}
                onChange={(value) => onChange(field.key, String(value))}
                options={officeOptions.map((option) => ({ label: option.label, value: option.value }))}
              />
            )
          }
          return (
            <Input
              key={field.key}
              label={field.label}
              fullWidth
              required={field.required}
              type={field.type}
              value={values[field.key] ?? ''}
              onChange={(value) => onChange(field.key, value)}
            />
          )
        })}
      </Box>
    </StepShell>
  )
}
