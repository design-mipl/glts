import { Box, Typography, Grid, Card, Chip, Stack } from '@mui/material'
import { FileText, Camera, CreditCard, Globe, Clock } from 'lucide-react'
import type { Country } from '../../../../../shared/types/visa'
import {
  publicColors,
  publicShadows,
  publicTypography,
  publicFonts,
} from '../../../../../shared/theme/publicBrand'

const mockRequirements = [
  { id: '1', name: 'Valid Passport', type: 'document', mandatory: true, description: 'Valid for at least 6 months beyond travel dates. Must have 2 blank pages.' },
  { id: '2', name: 'Passport Photos', type: 'photo', mandatory: true, description: '2 recent passport-size photos (35mm × 45mm), white background.' },
  { id: '3', name: 'Bank Statements', type: 'financial', mandatory: true, description: 'Last 3 months. Minimum balance ₹1,50,000 per applicant.' },
  { id: '4', name: 'Travel Insurance', type: 'insurance', mandatory: true, description: 'Minimum €30,000 coverage. Valid for entire Schengen stay.' },
  { id: '5', name: 'Flight Itinerary', type: 'travel', mandatory: true, description: 'Confirmed return ticket or travel itinerary.' },
  { id: '6', name: 'Hotel Bookings', type: 'accommodation', mandatory: false, description: 'Confirmed accommodation for all nights.' },
]

const iconMap: Record<string, React.ElementType> = {
  document: FileText,
  photo: Camera,
  financial: CreditCard,
  insurance: Globe,
  travel: Globe,
  accommodation: Clock,
}

interface RequirementsSectionProps {
  country: Country
}

export function RequirementsSection({ country: _country }: RequirementsSectionProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 700,
          fontSize: publicTypography.h3,
          color: publicColors.navy,
          mb: 4,
        }}
      >
        Required documents
      </Typography>

      <Grid container spacing={3}>
        {mockRequirements.map(req => {
          const Icon = iconMap[req.type] ?? FileText
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={req.id}>
              <Card
                sx={{
                  p: 3.5,
                  border: `1px solid ${publicColors.border}`,
                  borderRadius: '18px',
                  boxShadow: publicShadows.card,
                  borderLeft: req.mandatory
                    ? `4px solid ${publicColors.greenBright}`
                    : `4px solid ${publicColors.border}`,
                  transition: 'all 0.25s',
                  '&:hover': { boxShadow: publicShadows.cardHover },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: publicColors.greenMuted,
                      borderRadius: '12px',
                      display: 'flex',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} color={publicColors.greenBright} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '17px', color: publicColors.navy }}>
                        {req.name}
                      </Typography>
                      {req.mandatory && (
                        <Chip
                          label="Required"
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#D1FAE5',
                            color: '#065F46',
                          }}
                        />
                      )}
                    </Stack>
                    <Typography sx={{ color: publicColors.textSecondary, fontSize: '15px', lineHeight: 1.65 }}>
                      {req.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
