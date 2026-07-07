import { useCallback, useMemo } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { BaseCard, Button, Checkbox, RadioGroup } from '@/design-system/UIComponents'
import type { CountryQcChecklistSection, CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import {
  countEnabledQcChecklistItems,
  getExecutableQcChecklistSections,
} from '@/shared/utils/countryQcChecklistUtils'

export interface QcChecklistOutcomeOption {
  value: string
  label: string
}

function getSectionCheckState(section: CountryQcChecklistSection, checked: Record<string, boolean>) {
  if (section.items.length === 0) {
    return { checked: false, indeterminate: false }
  }

  const checkedCount = section.items.filter(item => Boolean(checked[item.id])).length
  return {
    checked: checkedCount === section.items.length,
    indeterminate: checkedCount > 0 && checkedCount < section.items.length,
  }
}

interface QcChecklistExecutePanelProps {
  template: CountryQcChecklistTemplate
  checked: Record<string, boolean>
  onCheckedChange: (itemId: string, value: boolean) => void
  outcome: string
  onOutcomeChange: (value: string) => void
  outcomeLabel: string
  outcomeOptions: QcChecklistOutcomeOption[]
  readOnly?: boolean
  actionLabel?: string
  actionDisabled?: boolean
  actionHint?: string
  onAction?: () => void
}

export function QcChecklistExecutePanel({
  template,
  checked,
  onCheckedChange,
  outcome,
  onOutcomeChange,
  outcomeLabel,
  outcomeOptions,
  readOnly = false,
  actionLabel,
  actionDisabled = false,
  actionHint,
  onAction,
}: QcChecklistExecutePanelProps) {
  const sections = useMemo(() => getExecutableQcChecklistSections(template), [template])
  const totalItems = useMemo(() => countEnabledQcChecklistItems(template), [template])
  const completedCount = useMemo(
    () => Object.entries(checked).filter(([, value]) => value).length,
    [checked],
  )

  const handleSectionCheckedChange = useCallback(
    (section: CountryQcChecklistSection, value: boolean) => {
      for (const item of section.items) {
        onCheckedChange(item.id, value)
      }
    },
    [onCheckedChange],
  )

  return (
    <BaseCard
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        minHeight: '100%',
        borderWidth: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1.5, flexShrink: 0 }}>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            {template.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {completedCount} of {totalItems} confirmed
          </Typography>
        </Stack>
        {template.subtitle ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, mt: 0.5, display: 'block' }}>
            {template.subtitle}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pb: 1 }}>
        <Stack spacing={2} divider={<Divider flexItem />}>
          {sections.map((section) => {
            const sectionState = getSectionCheckState(section, checked)

            return (
            <Stack key={section.id} spacing={0.75}>
              <Checkbox
                size="sm"
                label={section.title}
                checked={sectionState.checked}
                indeterminate={sectionState.indeterminate}
                disabled={readOnly}
                onChange={() => handleSectionCheckedChange(section, !sectionState.checked)}
                sx={{
                  mx: 0,
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-root': { alignItems: 'flex-start', ml: 0 },
                  '& .MuiCheckbox-root': { pt: 0.25, pb: 0.25 },
                  '& .MuiFormControlLabel-label': { fontSize: 13, lineHeight: 1.45, fontWeight: 700 },
                }}
              />
              <Stack spacing={0} sx={{ pl: 3 }}>
                {section.items.map((item) => (
                  <Checkbox
                    key={item.id}
                    size="sm"
                    label={item.label}
                    checked={Boolean(checked[item.id])}
                    disabled={readOnly}
                    onChange={(value) => onCheckedChange(item.id, value)}
                    sx={{
                      mx: 0,
                      alignItems: 'flex-start',
                      '& .MuiFormControlLabel-root': { alignItems: 'flex-start', ml: 0 },
                      '& .MuiCheckbox-root': { pt: 0.25, pb: 0.25 },
                      '& .MuiFormControlLabel-label': { fontSize: 13, lineHeight: 1.45 },
                    }}
                  />
                ))}
              </Stack>
            </Stack>
            )
          })}
        </Stack>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, mb: 1 }}>
          {outcomeLabel}
        </Typography>
        <RadioGroup
          size="sm"
          value={outcome}
          onChange={(value) => onOutcomeChange(String(value))}
          options={outcomeOptions.map((option) => ({
            ...option,
            disabled: readOnly,
          }))}
          sx={{
            '& .MuiFormControlLabel-root': { ml: 0, mr: 0, alignItems: 'flex-start' },
            '& .MuiFormControlLabel-label': { fontSize: 13 },
            '& .MuiRadio-root': { py: 0.25 },
          }}
        />
        {actionLabel && onAction ? (
          <Stack spacing={0.75} sx={{ mt: 1.25 }}>
            <Button
              label={actionLabel}
              onClick={onAction}
              disabled={readOnly || actionDisabled}
              size="sm"
            />
            {actionHint ? (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.4 }}>
                {actionHint}
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </Box>
    </BaseCard>
  )
}
