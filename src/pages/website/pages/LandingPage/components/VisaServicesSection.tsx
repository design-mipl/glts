import { useState } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { visaServiceShowcaseImages } from '../../../assets/landingPageImages'
import { destinationCardCarouselGap } from '../../../components/destinationCardGrid'

const visaServices = [
  {
    id: 'tourist',
    title: 'Tourist Visa',
    description: 'Leisure travel with expert document review and embassy-ready filing.',
    image: visaServiceShowcaseImages.tourist,
  },
  {
    id: 'business',
    title: 'Business Visa',
    description: 'Meetings, conferences, and short-term business visits handled with compliance.',
    image: visaServiceShowcaseImages.business,
  },
  {
    id: 'student',
    title: 'Student Visa',
    description: 'Admission-aligned documentation and category guidance for study abroad.',
    image: visaServiceShowcaseImages.student,
  },
  {
    id: 'work',
    title: 'Work Visa',
    description: 'Employment visas with employer documentation and eligibility checks.',
    image: visaServiceShowcaseImages.work,
  },
  {
    id: 'family-visit',
    title: 'Family Visit Visa',
    description: 'Visit relatives abroad with invitation letters and proof requirements covered.',
    image: visaServiceShowcaseImages.familyVisit,
  },
  {
    id: 'refusal-support',
    title: 'Visa Refusal Support',
    description: 'Refusal review, gap analysis, and reapplication strategy from specialists.',
    image: visaServiceShowcaseImages.refusalSupport,
  },
]

type VisaServiceCardProps = (typeof visaServices)[number] & {
  minHeight: { xs: number; md: number }
  objectPosition?: string
}

function VisaServiceImageCard({
  title,
  description,
  image,
  minHeight,
  objectPosition = 'center',
}: VisaServiceCardProps) {
  const [imageSrc, setImageSrc] = useState<string>(image.src)

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight,
        height: '100%',
        borderRadius: '22px',
        overflow: 'hidden',
        boxShadow: '0 10px 26px rgba(2, 20, 39, 0.16)',
        isolation: 'isolate',
        '& img': {
          transition: 'transform 0.5s ease',
        },
        '&:hover': {
          boxShadow: '0 14px 34px rgba(2, 20, 39, 0.22)',
        },
        '&:hover img': {
          transform: 'scale(1.04)',
        },
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={image.alt}
        loading="lazy"
        onError={() => setImageSrc(image.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0, 22, 46, 0.12) 20%, rgba(0, 22, 46, 0.72) 72%, rgba(0, 22, 46, 0.9) 100%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          p: { xs: 2.25, md: 2.75 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: { xs: '21px', md: '23px' },
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.15,
            mb: 0.8,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '14px', md: '14.5px' },
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.5,
            maxWidth: 360,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

export function VisaServicesSection() {
  const colors = usePublicBrandColors()
  const tourist = visaServices[0]
  const business = visaServices[1]
  const student = visaServices[2]
  const work = visaServices[3]
  const familyVisit = visaServices[4]
  const refusalSupport = visaServices[5]

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1.5,
            }}
          >
            Visa Services
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '26px', md: '32px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 1.25,
            }}
          >
            Every visa category, expertly managed.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            From tourist trips to work permits — each service includes pre-submission review and
            live application tracking.
          </Typography>
        </Box>

        <Grid container spacing={destinationCardCarouselGap}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <VisaServiceImageCard
              {...tourist}
              minHeight={{ xs: 300, md: 520 }}
              objectPosition="center center"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: destinationCardCarouselGap, height: '100%' }}>
              <VisaServiceImageCard
                {...business}
                minHeight={{ xs: 240, md: 248 }}
                objectPosition="center 35%"
              />
              <VisaServiceImageCard
                {...student}
                minHeight={{ xs: 240, md: 248 }}
                objectPosition="center 32%"
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <VisaServiceImageCard
              {...work}
              minHeight={{ xs: 300, md: 520 }}
              objectPosition="center center"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: destinationCardCarouselGap, height: '100%' }}>
              <VisaServiceImageCard
                {...familyVisit}
                minHeight={{ xs: 240, md: 248 }}
                objectPosition="center 30%"
              />
              <VisaServiceImageCard
                {...refusalSupport}
                minHeight={{ xs: 240, md: 248 }}
                objectPosition="center 45%"
              />
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
