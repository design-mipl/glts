import { FormField, Tabs } from '@/design-system/UIComponents'
import type { DocumentHandlingMode } from '@/shared/utils/applicantDocumentWorkflowUtils'

interface HandlingModeOption {
  value: DocumentHandlingMode
  label: string
}

interface HandlingModeSegmentedToggleProps {
  label: string
  value: DocumentHandlingMode | undefined
  options: readonly HandlingModeOption[]
  onChange: (mode: DocumentHandlingMode) => void
  disabled?: boolean
}

export function HandlingModeSegmentedToggle({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: HandlingModeSegmentedToggleProps) {
  const tabValue = value ?? ''

  return (
    <FormField label={label}>
      <Tabs
        variant="pill"
        size="sm"
        fullWidth
        value={tabValue}
        onChange={v => onChange(v as DocumentHandlingMode)}
        items={options.map(opt => ({
          value: opt.value,
          label: opt.label,
          disabled,
        }))}
        sx={{ width: '100%' }}
      />
    </FormField>
  )
}
