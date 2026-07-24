import { Grid } from '@mui/material'
import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import type { CollectionDetailFieldDef } from '@/shared/utils/originalDocumentCollectionUtils'

interface CollectionDetailFieldsProps {
  fields: CollectionDetailFieldDef[]
  values: Record<string, string>
  receivingOfficeOptions: { value: string; label: string; description?: string }[]
  onChange: (key: string, value: string) => void
  readOnly?: boolean
}

function inputTypeForField(type: CollectionDetailFieldDef['type']): string {
  if (type === 'date') return 'date'
  if (type === 'time') return 'time'
  if (type === 'tel') return 'tel'
  return 'text'
}

function placeholderForField(field: CollectionDetailFieldDef): string {
  if (field.type === 'select') return 'Select office or partner'
  if (field.type === 'textarea') return `Enter ${field.label.toLowerCase()}`
  if (field.type === 'date') return ''
  if (field.type === 'time') return ''
  return `Enter ${field.label.toLowerCase()}`
}

function fieldGridSize(field: CollectionDetailFieldDef): { xs: number; sm: number } {
  if (field.type === 'textarea') return { xs: 12, sm: 12 }
  return { xs: 12, sm: 6 }
}

export function CollectionDetailFields({
  fields,
  values,
  receivingOfficeOptions,
  onChange,
  readOnly = false,
}: CollectionDetailFieldsProps) {
  return (
    <Grid container spacing={1.25}>
      {fields.map(field => {
        const fieldValue = values[field.key] ?? ''
        const gridSize = fieldGridSize(field)

        return (
          <Grid key={field.key} size={gridSize}>
            <FormField label={field.label} required={field.required}>
              {field.type === 'select' ? (
                <Select
                  fullWidth
                  size="sm"
                  value={fieldValue}
                  disabled={readOnly}
                  placeholder={placeholderForField(field)}
                  options={receivingOfficeOptions}
                  onChange={value => onChange(field.key, String(value))}
                />
              ) : field.type === 'textarea' ? (
                <Textarea
                  fullWidth
                  value={fieldValue}
                  disabled={readOnly}
                  placeholder={placeholderForField(field)}
                  onChange={value => onChange(field.key, value)}
                  minRows={2}
                />
              ) : (
                <Input
                  fullWidth
                  size="sm"
                  type={inputTypeForField(field.type)}
                  value={fieldValue}
                  disabled={readOnly}
                  placeholder={placeholderForField(field)}
                  onChange={value => onChange(field.key, value)}
                />
              )}
            </FormField>
          </Grid>
        )
      })}
    </Grid>
  )
}
