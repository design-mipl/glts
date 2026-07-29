import { Box, Stack, Typography } from '@mui/material'
import { Badge, Button, Modal } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { countryGroupMasterService } from '@/shared/services/countryGroupMasterService'
import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface CountryGroupViewModalProps {
  open: boolean
  record: CountryGroupMaster | null
  onClose: () => void
  onEdit: (record: CountryGroupMaster) => void
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function CountryGroupViewModal({
  open,
  record,
  onClose,
  onEdit,
}: CountryGroupViewModalProps) {
  if (!record) return null

  const countries = countryGroupMasterService.resolveCountries(record.countryIds)
  const countryCount = countries.length

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={record.name}
      subtitle={`${countryCount} countr${countryCount === 1 ? 'y' : 'ies'} in this group`}
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
          <Button label="Close" variant="neutral" onClick={onClose} />
          <Button
            label="Edit"
            onClick={() => {
              onClose()
              onEdit(record)
            }}
          />
        </Box>
      }
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <SummaryField label="Group name" value={record.name} />
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Status
            </Typography>
            <Box>
              <Badge
                label={masterStatusLabel[record.status]}
                color={masterStatusColor[record.status]}
                size="sm"
              />
            </Box>
          </Stack>
          <SummaryField
            label="Created"
            value={`${record.createdBy} · ${formatMasterDate(record.createdAt)}`}
          />
          <SummaryField
            label="Updated"
            value={`${record.updatedBy} · ${formatMasterDate(record.updatedAt)}`}
          />
        </Box>

        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Countries ({countryCount})
          </Typography>
          {countries.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No countries mapped to this group.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.75,
                maxHeight: 280,
                overflowY: 'auto',
                pr: 0.5,
              }}
            >
              {countries.map((country) => (
                <Badge key={country.id} label={country.name} color="neutral" size="sm" />
              ))}
            </Box>
          )}
        </Stack>
      </Stack>
    </Modal>
  )
}
