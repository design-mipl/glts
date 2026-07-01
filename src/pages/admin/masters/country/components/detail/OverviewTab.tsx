import { Box, Grid, Typography } from '@mui/material'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_LABELS,
  PROCESSING_TYPE_LABELS,
} from '../../config/countryProcessingConfig'
import { SEGMENT_LABELS } from '../../config/countrySegmentConfig'

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'pre-wrap' }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

interface OverviewTabProps {
  country: CountryMaster
  segment: BusinessSegment
}

export function OverviewTab({ country, segment }: OverviewTabProps) {
  const segConfig = country.segments.find((s) => s.segment === segment)

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Country name" value={country.name} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Country code" value={country.code} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Processing type" value={PROCESSING_TYPE_LABELS[country.processingType]} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Status" value={COUNTRY_STATUS_LABELS[country.status]} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField label="Application Tracking URL" value={country.applicationTrackingUrl ?? ''} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField label="Embassy / consulate notes" value={country.embassyNotes ?? ''} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField label="Internal operational notes" value={country.internalNotes ?? ''} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField
          label="Passport issue locations"
          value={
            country.passportIssueLocations?.length
              ? country.passportIssueLocations
                  .map((loc) => `${loc.label} → ${loc.jurisdiction}`)
                  .join('\n')
              : ''
          }
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="overline" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {SEGMENT_LABELS[segment]} segment
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {segConfig?.enabled
            ? `${segConfig.visaTypes.length} visa type(s) configured`
            : 'This segment is not enabled for this country.'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Portal cities" value={country.cities} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ReadOnlyField label="Display processing time" value={country.processingTime} />
      </Grid>
    </Grid>
  )
}
