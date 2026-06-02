import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, EmptyState } from '@/design-system/UIComponents'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'

interface VisaTypesTabProps {
  country: CountryMaster
  segment: BusinessSegment
}

export function VisaTypesTab({ country, segment }: VisaTypesTabProps) {
  const navigate = useNavigate()
  const segConfig = country.segments.find((s) => s.segment === segment)

  if (!segConfig?.enabled) {
    return (
      <EmptyState
        variant="no-data"
        title="Segment not enabled"
        description="Enable this segment in the country configuration to manage visa types."
        action={{
          label: 'Edit country',
          onClick: () => navigate(`/admin/masters/country/${country.id}/edit?step=1`),
        }}
      />
    )
  }

  if (segConfig.visaTypes.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No visa types"
        description="Add visa types for this segment to start processing applications."
        action={{
          label: 'Configure visa types',
          onClick: () => navigate(`/admin/masters/country/${country.id}/edit?step=2`),
        }}
      />
    )
  }

  return (
    <Stack spacing={1.5}>
      {segConfig.visaTypes.map((vt) => (
        <Box
          key={vt.id}
          sx={{
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {vt.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vt.visaCategory}
                {vt.purposeLabel ? ` · ${vt.purposeLabel}` : ''} · {vt.processingTime} · {vt.entryType}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Validity: {vt.validity} · Stay: {vt.stayDuration}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} alignItems="center">
              {vt.prioritySupport ? <Badge label="Priority" color="warning" /> : null}
              <Badge
                label={vt.status === 'active' ? 'Active' : 'Inactive'}
                color={vt.status === 'active' ? 'success' : 'neutral'}
              />
            </Stack>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {(segConfig.commonDocuments?.length ?? 0) + (vt.applicationDocuments?.length ?? 0)}{' '}
            document(s) mapped (common + application-level)
          </Typography>
        </Box>
      ))}
      <Button
        label="Edit visa types"
        variant="outlined"
        onClick={() => navigate(`/admin/masters/country/${country.id}/edit?step=2`)}
        sx={{ alignSelf: 'flex-start' }}
      />
    </Stack>
  )
}
