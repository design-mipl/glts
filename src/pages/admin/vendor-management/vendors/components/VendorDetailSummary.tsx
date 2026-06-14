import { Box, Stack, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { Vendor } from '@/shared/types/vendor'
import { vendorCategoryColor, vendorCategoryLabel } from '../config/vendorCategoryConfig'
import { vendorStatusColor, vendorStatusLabel, vendorTypeLabel } from '../config/vendorStatusConfig'

interface VendorDetailSummaryProps {
  vendor: Vendor
  onEdit?: () => void
  onActivate?: () => void
  onDeactivate?: () => void
}

export function VendorDetailSummary({ vendor, onEdit, onActivate, onDeactivate }: VendorDetailSummaryProps) {
  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {vendor.vendorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vendor.vendorId} · {vendorTypeLabel[vendor.vendorType]} · {vendor.city || '—'}
                {vendor.country ? `, ${vendor.country}` : ''}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              {onEdit ? (
                <Button label="Edit vendor" size="sm" variant="neutral" startIcon={<PencilLine size={14} />} onClick={onEdit} />
              ) : null}
              {vendor.status === 'inactive' && onActivate ? (
                <Button label="Activate vendor" size="sm" startIcon={<Power size={14} />} onClick={onActivate} />
              ) : null}
              {vendor.status === 'active' && onDeactivate ? (
                <Button
                  label="Deactivate"
                  size="sm"
                  variant="outlined"
                  color="error"
                  startIcon={<PowerOff size={14} />}
                  onClick={onDeactivate}
                />
              ) : null}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Badge label={vendorStatusLabel[vendor.status]} color={vendorStatusColor[vendor.status]} />
            <Badge label={vendorCategoryLabel[vendor.vendorCategory]} color={vendorCategoryColor[vendor.vendorCategory]} size="sm" />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
