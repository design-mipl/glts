import { useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { BaseCard, Checkbox, RadioGroup } from '@/design-system/UIComponents'
import {
  QC_CHECK_CHECKLIST_ITEM_COUNT,
  QC_CHECK_CHECKLIST_SECTIONS,
  QC_CHECK_OUTCOME_OPTIONS,
  type QcCheckOutcome,
} from '../../config/qcCheckChecklistConfig'

export function QcCheckChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [outcome, setOutcome] = useState<QcCheckOutcome | ''>('')

  const completedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
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
            Documentation Team – QC Checklist
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {completedCount} of {QC_CHECK_CHECKLIST_ITEM_COUNT} confirmed
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, mt: 0.5, display: 'block' }}>
          Quality check before external portal submission.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pb: 1 }}>
        <Stack spacing={2} divider={<Divider flexItem />}>
          {QC_CHECK_CHECKLIST_SECTIONS.map(section => (
            <Stack key={section.id} spacing={0.75}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {section.title}
              </Typography>
              <Stack spacing={0}>
                {section.items.map(item => (
                  <Checkbox
                    key={item.id}
                    size="sm"
                    label={item.label}
                    checked={Boolean(checked[item.id])}
                    onChange={value => setChecked(prev => ({ ...prev, [item.id]: value }))}
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
          ))}
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
          QC outcome
        </Typography>
        <RadioGroup
          size="sm"
          value={outcome}
          onChange={value => setOutcome(value as QcCheckOutcome)}
          options={QC_CHECK_OUTCOME_OPTIONS}
          sx={{
            '& .MuiFormControlLabel-root': { ml: 0, mr: 0, alignItems: 'flex-start' },
            '& .MuiFormControlLabel-label': { fontSize: 13 },
            '& .MuiRadio-root': { py: 0.25 },
          }}
        />
      </Box>
    </BaseCard>
  )
}
