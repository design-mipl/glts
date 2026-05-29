import { Box, Grid, Stack, Typography } from '@mui/material'
import { Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, BaseCard, Button, Select } from '@/design-system/UIComponents'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_COLORS,
  COUNTRY_STATUS_LABELS,
  PROCESSING_TYPE_LABELS,
} from '../config/countryProcessingConfig'
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import { formatCountryDate } from '../utils/countryListingUtils'

interface CountryDetailSummaryProps {
  country: CountryMaster
  activeSegment: BusinessSegment
  onSegmentChange: (segment: BusinessSegment) => void
}

export function CountryDetailSummary({
  country,
  activeSegment,
  onSegmentChange,
}: CountryDetailSummaryProps) {
  const navigate = useNavigate()
  const enabled = countryMasterAdminService.getEnabledSegments(country)
  const agg = countryMasterAdminService.getAggregates(country, activeSegment)
  const segmentEnabled = enabled.includes(activeSegment)

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Typography sx={{ fontSize: 40, lineHeight: 1 }}>{country.flag}</Typography>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {country.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {SEGMENT_LABELS[activeSegment]} configuration · Updated{' '}
                  {formatCountryDate(country.updatedAt)}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Select
                label="Segment"
                value={activeSegment}
                onChange={(value) => onSegmentChange(value as BusinessSegment)}
                options={enabled.map((s) => ({ value: s, label: SEGMENT_LABELS[s] }))}
                size="sm"
                sx={{ minWidth: 180 }}
              />
              <Button
                label="Edit"
                variant="contained"
                startIcon={<Pencil size={14} />}
                onClick={() => navigate(`/admin/masters/country/${country.id}/edit`)}
              />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Badge
              label={COUNTRY_STATUS_LABELS[country.status]}
              color={COUNTRY_STATUS_COLORS[country.status]}
            />
            <Badge label={PROCESSING_TYPE_LABELS[country.processingType]} color="info" />
            <Badge label={SEGMENT_LABELS[activeSegment]} color="neutral" />
            {!segmentEnabled ? (
              <Badge label="Segment not enabled" color="warning" />
            ) : null}
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Visa types
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {agg.visaTypeCount}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Checklist items
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {agg.checklistCount}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Country code
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {country.code}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Region
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {country.region || '—'}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </BaseCard>
  )
}
