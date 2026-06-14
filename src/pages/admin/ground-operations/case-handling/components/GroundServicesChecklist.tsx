import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { ChevronDown, Upload } from 'lucide-react'
import { Button, Checkbox, FormField, Input, Textarea } from '@/design-system/UIComponents'
import { formControlHeight } from '@/design-system/formControl'
import type { GroundServiceLine } from '@/shared/types/operationalCaseHandling'

const pairedFieldLabelSx: SxProps<Theme> = {
  '& > .MuiBox-root:first-of-type': {
    minHeight: 20,
    mb: 0.75,
  },
}

const controlHeight = formControlHeight('sm')

interface GroundServicesChecklistProps {
  services: GroundServiceLine[]
  readOnly?: boolean
  onServiceChange?: (serviceId: string, patch: Partial<GroundServiceLine>) => void
}

export function GroundServicesChecklist({
  services,
  readOnly = false,
  onServiceChange,
}: GroundServicesChecklistProps) {
  return (
    <Stack spacing={0.75}>
      {services.map(service => (
        <ServiceRow
          key={service.id}
          service={service}
          readOnly={readOnly}
          onChange={patch => onServiceChange?.(service.id, patch)}
        />
      ))}
    </Stack>
  )
}

function ServiceRow({
  service,
  readOnly,
  onChange,
}: {
  service: GroundServiceLine
  readOnly?: boolean
  onChange?: (patch: Partial<GroundServiceLine>) => void
}) {
  const [expanded, setExpanded] = useState(service.selected)

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ px: 1.25, py: 0.75, cursor: service.selected ? 'pointer' : 'default' }}
        onClick={() => service.selected && setExpanded(v => !v)}
      >
        <Box onClick={e => e.stopPropagation()}>
          <Checkbox
            checked={service.selected}
            disabled={readOnly}
            onChange={checked => {
              onChange?.({
                selected: checked,
                ...(checked && service.actualAmount <= 0 && service.prefilledAmount > 0
                  ? { actualAmount: service.prefilledAmount }
                  : {}),
              })
              setExpanded(checked)
            }}
          />
        </Box>
        <Typography variant="body2" fontWeight={600} sx={{ flex: 1, fontSize: 12 }}>
          {service.serviceName}
        </Typography>
        {service.selected ? (
          <ChevronDown
            size={16}
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
          />
        ) : null}
      </Stack>

      <Collapse in={service.selected && expanded}>
        <Stack spacing={1} sx={{ px: 1.25, pb: 1.25, pt: 0.25 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1,
              alignItems: 'end',
            }}
          >
            <FormField label="Amount" required sx={pairedFieldLabelSx}>
              <Input
                size="sm"
                type="number"
                value={String(service.actualAmount || service.prefilledAmount || '')}
                disabled={readOnly}
                placeholder="Enter amount"
                onChange={value => {
                  const amount = Number(value) || 0
                  onChange?.({ actualAmount: amount })
                }}
              />
            </FormField>
            <FormField label="Receipt upload" optional sx={pairedFieldLabelSx}>
              <Button
                label={service.receiptFileName ?? 'Upload receipt'}
                variant="outlined"
                size="sm"
                fullWidth
                startIcon={<Upload size={14} />}
                disabled={readOnly}
                sx={{
                  minHeight: controlHeight,
                  height: controlHeight,
                  whiteSpace: 'nowrap',
                }}
                onClick={e => {
                  e.stopPropagation()
                  onChange?.({ receiptFileName: `receipt-${Date.now()}.jpg` })
                }}
              />
            </FormField>
          </Box>
          <FormField label="Remarks" optional>
            <Textarea
              rows={2}
              value={service.remarks ?? ''}
              disabled={readOnly}
              onChange={value => onChange?.({ remarks: value })}
            />
          </FormField>
        </Stack>
      </Collapse>
    </Box>
  )
}
