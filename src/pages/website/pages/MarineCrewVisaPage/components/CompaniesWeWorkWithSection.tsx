import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Grid, keyframes, useMediaQuery } from '@mui/material'
import { SolutionPageSection } from '../../../components/solutionPage/SolutionPageSection'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { marineCompanyTypes, type MarineCompanyType } from '../marinePageData'

const slideFromTop = keyframes`
  from { opacity: 0; transform: translateY(-18px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideFromBottom = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`

const ENTRANCE_ANIMATION = {
  'from-top': slideFromTop,
  'from-bottom': slideFromBottom,
} as const

const STAGGER_S = 0.14
const DURATION_S = 0.72

function CompanyTypeItem({
  item,
  isVisible,
  index,
}: {
  item: MarineCompanyType
  isVisible: boolean
  index: number
}) {
  const colors = usePublicBrandColors()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [imgSrc, setImgSrc] = useState(item.image.src)
  const animation = ENTRANCE_ANIMATION[item.entrance]

  const shouldAnimate = isVisible && !prefersReducedMotion

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 1.5,
        opacity: isVisible || prefersReducedMotion ? 1 : 0,
        animation: shouldAnimate ? `${animation} ${DURATION_S}s ease-out both` : undefined,
        animationDelay: shouldAnimate ? `${index * STAGGER_S}s` : undefined,
      }}
    >
      <Box
        sx={{
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: '12px',
          overflow: 'hidden',
          bgcolor: colors.surfaceAlt,
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt={item.image.alt}
          loading="lazy"
          onError={() => setImgSrc(item.image.fallback)}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: { xs: '15px', md: '18px' },
          fontWeight: 700,
          color: colors.navy,
          lineHeight: 1.3,
          textAlign: 'center',
          width: '100%',
        }}
      >
        {item.title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '14px', md: '15px' },
          color: colors.textSecondary,
          lineHeight: 1.6,
          maxWidth: 320,
          width: '100%',
          textAlign: 'center',
          mx: 'auto',
        }}
      >
        {item.description}
      </Typography>
    </Box>
  )
}

export function CompaniesWeWorkWithSection() {
  const colors = usePublicBrandColors()
  const contentRef = useRef<HTMLDivElement>(null)
  const hasPlayedRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setIsVisible(true)
      return
    }

    const el = contentRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayedRef.current) return
        hasPlayedRef.current = true
        setIsVisible(true)
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <SolutionPageSection
      id="companies-we-work-with"
      title="Companies We Work With"
      subtitle="GreenLight supports marine travel operations across the following organization types."
    >
      <Box ref={contentRef}>
        <Grid container alignItems="stretch">
          {marineCompanyTypes.map((item, index) => (
            <Grid
              key={item.title}
              size={{ xs: 12, md: 4 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: { xs: index === 0 ? 0 : 2.5, md: 0 },
                pb: { xs: index < marineCompanyTypes.length - 1 ? 2.5 : 0, md: 0 },
                px: { md: index === 0 ? 0 : 3, lg: index === 0 ? 0 : 4 },
                pr: { md: index < marineCompanyTypes.length - 1 ? 3 : 0, lg: index < marineCompanyTypes.length - 1 ? 4 : 0 },
                borderRight: {
                  md:
                    index < marineCompanyTypes.length - 1
                      ? `1px solid ${colors.borderSoft}`
                      : 'none',
                },
                borderBottom: {
                  xs:
                    index < marineCompanyTypes.length - 1
                      ? `1px solid ${colors.borderSoft}`
                      : 'none',
                  md: 'none',
                },
              }}
            >
              <CompanyTypeItem item={item} isVisible={isVisible} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </SolutionPageSection>
  )
}
