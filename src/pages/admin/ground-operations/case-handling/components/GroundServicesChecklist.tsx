import { Box, Divider, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Checkbox, Input } from '@/design-system/UIComponents'
import type { GroundServiceLine } from '@/shared/types/operationalCaseHandling'
import {
  vfsServicePickerLayout,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'

const checklistListSx: SxProps<Theme> = {
  border: 1,
  borderColor: 'divider',
  borderRadius: vfsServicePickerLayout.listBorderRadius,
  overflow: 'hidden',
}

interface GroundServicesChecklistProps {
  services: GroundServiceLine[]
  /** Service ids that are already paid (checked + disabled). */
  lockedServiceIds?: ReadonlySet<string>
  readOnly?: boolean
  onServiceChange?: (serviceId: string, patch: Partial<GroundServiceLine>) => void
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function GroundServicesChecklist({
  services,
  lockedServiceIds,
  readOnly = false,
  onServiceChange,
}: GroundServicesChecklistProps) {
  return (
    <Box sx={checklistListSx}>
      <Stack divider={<Divider />}>
        {services.map(service => (
          <ServiceRow
            key={service.id}
            service={service}
            locked={lockedServiceIds?.has(service.id) ?? false}
            readOnly={readOnly}
            onChange={patch => onServiceChange?.(service.id, patch)}
          />
        ))}
      </Stack>
    </Box>
  )
}

function ServiceRow({
  service,
  locked,
  readOnly,
  onChange,
}: {
  service: GroundServiceLine
  locked: boolean
  readOnly?: boolean
  onChange?: (patch: Partial<GroundServiceLine>) => void
}) {
  const displayAmount = service.actualAmount || service.prefilledAmount
  const isLocked = locked || readOnly
  const checked = locked ? true : service.selected
  const canEditAmount = checked && !isLocked

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        ...vfsServicePickerServiceRowSx,
        ...(locked ? { opacity: 0.85 } : null),
      }}
    >
      <Checkbox
        checked={checked}
        disabled={isLocked}
        size="sm"
        onChange={checkedNext => {
          if (isLocked) return
          onChange?.({
            selected: checkedNext,
            ...(checkedNext && service.actualAmount <= 0 && service.prefilledAmount > 0
              ? { actualAmount: service.prefilledAmount }
              : {}),
          })
        }}
      />
      <Typography
        variant="body2"
        sx={{ flex: 1, fontSize: vfsServicePickerLayout.bodyFontSize }}
      >
        {service.serviceName}
        {locked ? (
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{ ml: 0.75, fontSize: 11 }}
          >
            (paid)
          </Typography>
        ) : null}
      </Typography>
      {canEditAmount ? (
        <Box sx={{ width: 120 }}>
          <Input
            size="sm"
            type="number"
            value={String(displayAmount || '')}
            placeholder="Amount"
            onChange={value => {
              onChange?.({ actualAmount: Number(value) || 0 })
            }}
          />
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontSize: vfsServicePickerLayout.bodyFontSize,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
            color: checked ? 'text.primary' : 'text.secondary',
          }}
        >
          {formatInr(displayAmount)}
        </Typography>
      )}
    </Stack>
  )
}
