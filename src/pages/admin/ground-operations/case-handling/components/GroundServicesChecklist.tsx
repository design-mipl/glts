import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, Upload } from 'lucide-react'
import { Button, Checkbox, FormField, Input, Textarea } from '@/design-system/UIComponents'
import type { GroundServiceLine } from '@/shared/types/operationalCaseHandling'

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
              onChange?.({ selected: checked })
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <FormField label="Amount">
              <Input
                size="sm"
                type="number"
                value={String(service.prefilledAmount)}
                disabled={readOnly}
                onChange={value => onChange?.({ prefilledAmount: Number(value) || 0 })}
              />
            </FormField>
            <FormField label="Actual amount">
              <Input
                size="sm"
                type="number"
                value={String(service.actualAmount)}
                disabled={readOnly}
                onChange={value => onChange?.({ actualAmount: Number(value) || 0 })}
              />
            </FormField>
          </Box>
          <FormField label="Receipt upload" optional>
            <Button
              label={service.receiptFileName ?? 'Upload receipt'}
              variant="outlined"
              size="sm"
              startIcon={<Upload size={14} />}
              disabled={readOnly}
              onClick={() => onChange?.({ receiptFileName: `receipt-${Date.now()}.jpg` })}
            />
          </FormField>
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
