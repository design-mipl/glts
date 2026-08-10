import { Box, Typography, Chip, Stack, Divider } from '@mui/material'
import {
  FileText,
  Camera,
  CreditCard,
  Shield,
  Plane,
  Building2,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import type { Country } from '@/shared/types/visa'
import {
  publicLightColors,
  publicShadows,
  publicTypography,
  publicFonts,
  usePublicBrandColors,
} from '@/shared/theme/publicBrand'

type ReqType = 'document' | 'photo' | 'financial' | 'insurance' | 'travel' | 'accommodation'

interface RequirementItem {
  id: string
  name: string
  type: ReqType
  mandatory: boolean
  description: string
}

const mockRequirements: RequirementItem[] = [
  {
    id: '1',
    name: 'Valid Passport',
    type: 'document',
    mandatory: true,
    description: 'Valid for at least 6 months beyond travel dates. Must have 2 blank pages.',
  },
  {
    id: '2',
    name: 'Passport Photos',
    type: 'photo',
    mandatory: true,
    description: '2 recent passport-size photos (35mm × 45mm), white background.',
  },
  {
    id: '3',
    name: 'Bank Statements',
    type: 'financial',
    mandatory: true,
    description: 'Last 3 months. Minimum balance ₹1,50,000 per applicant.',
  },
  {
    id: '4',
    name: 'Travel Insurance',
    type: 'insurance',
    mandatory: true,
    description: 'Minimum €30,000 coverage. Valid for entire Schengen stay.',
  },
  {
    id: '5',
    name: 'Flight Itinerary',
    type: 'travel',
    mandatory: true,
    description: 'Confirmed return ticket or travel itinerary.',
  },
  {
    id: '6',
    name: 'Hotel Bookings',
    type: 'accommodation',
    mandatory: false,
    description: 'Confirmed accommodation for all nights.',
  },
]

const iconConfig: Record<
  ReqType,
  { Icon: React.ElementType; bg: string; color: string }
> = {
  document: { Icon: FileText, bg: publicLightColors.greenMuted, color: publicLightColors.greenBright },
  photo: { Icon: Camera, bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' },
  financial: { Icon: CreditCard, bg: 'rgba(245, 158, 11, 0.12)', color: '#D97706' },
  insurance: { Icon: Shield, bg: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9' },
  travel: { Icon: Plane, bg: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' },
  accommodation: { Icon: Building2, bg: 'rgba(115, 192, 100, 0.15)', color: publicLightColors.greenDark },
}

interface RequirementsSectionProps {
  country: Country
}

function RequirementRow({ req }: { req: RequirementItem }) {
  const colors = usePublicBrandColors()
  const { Icon, bg, color } = iconConfig[req.type]

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        py: 2.25,
        px: { xs: 2, sm: 2.5 },
        transition: 'background-color 0.2s',
        '&:hover': { bgcolor: colors.surfaceAlt },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          bgcolor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} strokeWidth={2} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              color: colors.navy,
              lineHeight: 1.3,
            }}
          >
            {req.name}
          </Typography>
          {req.mandatory ? (
            <Chip
              icon={<CheckCircle2 size={12} />}
              label="Required"
              size="small"
              sx={{
                height: 24,
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 700,
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
                border: `1px solid rgba(115, 192, 100, 0.25)`,
                '& .MuiChip-icon': { color: colors.greenBright, ml: 0.5 },
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ) : (
            <Chip
              label="Optional"
              size="small"
              sx={{
                height: 24,
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 600,
                bgcolor: colors.surfaceAlt,
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Box>
        <Typography
          sx={{
            color: colors.textSecondary,
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {req.description}
        </Typography>
      </Box>
    </Box>
  )
}

export function RequirementsSection({ country }: RequirementsSectionProps) {
  const colors = usePublicBrandColors()
  const required = mockRequirements.filter(r => r.mandatory)
  const optional = mockRequirements.filter(r => !r.mandatory)

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 800,
              fontSize: publicTypography.h3,
              color: colors.navy,
              mb: 0.75,
            }}
          >
            Required documents
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              color: colors.textSecondary,
              maxWidth: 480,
              lineHeight: 1.55,
            }}
          >
            Prepare these before you apply for your {country.name} visa.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={`${required.length} required`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '12px',
              bgcolor: colors.greenMuted,
              color: colors.greenDark,
            }}
          />
          {optional.length > 0 && (
            <Chip
              label={`${optional.length} optional`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '12px',
                bgcolor: colors.surfaceAlt,
                color: colors.textSecondary,
              }}
            />
          )}
        </Stack>
      </Stack>

      {country.documentsNeeded.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '14px',
            bgcolor: colors.surfaceAlt,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              mb: 1.25,
            }}
          >
            Quick checklist
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
            {country.documentsNeeded.map(doc => (
              <Chip
                key={doc}
                icon={<Circle size={6} fill={colors.greenBright} color={colors.greenBright} />}
                label={doc}
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 600,
                  fontSize: '13px',
                  bgcolor: colors.white,
                  color: colors.navy,
                  border: `1px solid ${colors.border}`,
                  '& .MuiChip-icon': { ml: 0.75 },
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          borderRadius: '18px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.white,
          boxShadow: publicShadows.card,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.75,
            bgcolor: colors.surface,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CheckCircle2 size={18} color={colors.greenBright} />
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: colors.navy }}>
            Must have ({required.length})
          </Typography>
        </Box>
        {required.map((req, i) => (
          <Box key={req.id}>
            {i > 0 && <Divider />}
            <RequirementRow req={req} />
          </Box>
        ))}

        {optional.length > 0 && (
          <>
            <Divider />
            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1.75,
                bgcolor: colors.surface,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: colors.textSecondary }}>
                Optional ({optional.length})
              </Typography>
            </Box>
            {optional.map((req, i) => (
              <Box key={req.id}>
                {i > 0 && <Divider />}
                <RequirementRow req={req} />
              </Box>
            ))}
          </>
        )}
      </Box>

      <Typography
        sx={{
          mt: 2,
          fontSize: '13px',
          color: colors.textMuted,
          lineHeight: 1.5,
        }}
      >
        Document rules can vary by embassy. We verify your upload before submission.
      </Typography>
    </Box>
  )
}
