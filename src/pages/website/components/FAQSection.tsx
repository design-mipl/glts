import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Collapse, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Plus, Minus } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
} from '../theme/publicSiteTokens'
import {
  landingSectionHeaderMb,
  landingSectionPy,
} from '../pages/LandingPage/landingPageSpacing'
import { faqSupportCardImage } from '../assets/landingPageImages'

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

const DEFAULT_TITLE = "FAQ's"
const HEIGHT_TRANSITION_MS = 300

export function FAQSection({ faqs, title = DEFAULT_TITLE }: FAQSectionProps) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const accordionRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [imgSrc, setImgSrc] = useState(faqSupportCardImage.src)
  const [accordionHeight, setAccordionHeight] = useState<number | null>(null)

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  useEffect(() => {
    const el = accordionRef.current
    if (!el || !isDesktop) {
      setAccordionHeight(null)
      return
    }

    const updateHeight = () => {
      setAccordionHeight(el.getBoundingClientRect().height)
    }

    updateHeight()

    const observer = new ResizeObserver(() => {
      updateHeight()
    })
    observer.observe(el)

    return () => observer.disconnect()
  }, [isDesktop, faqs.length])

  return (
    <Box component="section" sx={{ py: landingSectionPy, backgroundColor: colors.white }}>
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 800,
              color: colors.navy,
              fontSize: { xs: '28px', md: '32px', lg: '36px' },
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: 1.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              lineHeight: 1.65,
              color: colors.textSecondary,
            }}
          >
            Quick answers to common visa questions — or reach our specialists for personalized
            guidance.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1.15fr) minmax(0, 1.2fr)',
            },
            gap: { xs: 3, md: 3.5, lg: 4 },
            alignItems: 'start',
          }}
        >
          {/* Left — premium support image (height tracks accordion) */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: { xs: 360, sm: 400 },
              height: {
                xs: 'auto',
                md: accordionHeight ? `${accordionHeight}px` : 'auto',
              },
              aspectRatio: { xs: '4 / 5', md: 'unset' },
            }}
          >
            <Box
              component="img"
              src={imgSrc}
              alt={faqSupportCardImage.alt}
              loading="lazy"
              onError={() => setImgSrc(faqSupportCardImage.fallback)}
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center center',
                borderRadius: '20px',
              }}
            />
          </Box>

          {/* Right — FAQ accordion list */}
          <Box
            ref={accordionRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1.5, md: 1.75 },
              minWidth: 0,
            }}
          >
            {faqs.map(({ q, a }, index) => {
              const isOpen = expanded.has(index)
              return (
                <Box
                  key={q}
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    bgcolor: colors.white,
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2,
                      py: { xs: 2, md: 2.25 },
                      px: { xs: 2, md: 2.25 },
                      bgcolor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: colors.navy,
                        fontSize: { xs: '15px', md: '16px' },
                        lineHeight: 1.4,
                      }}
                    >
                      {q}
                    </Typography>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isOpen ? colors.greenBright : 'transparent',
                        color: isOpen ? colors.white : colors.navy,
                        transition: 'background-color 0.2s ease, color 0.2s ease',
                      }}
                      aria-hidden
                    >
                      {isOpen ? (
                        <Minus size={18} strokeWidth={2.25} />
                      ) : (
                        <Plus size={18} strokeWidth={2.25} />
                      )}
                    </Box>
                  </Box>

                  <Collapse in={isOpen} timeout={HEIGHT_TRANSITION_MS}>
                    <Typography
                      sx={{
                        px: { xs: 2, md: 2.25 },
                        pb: { xs: 2, md: 2.25 },
                        color: colors.textSecondary,
                        fontSize: { xs: '13px', md: '14px' },
                        lineHeight: 1.65,
                      }}
                    >
                      {a}
                    </Typography>
                  </Collapse>
                </Box>
              )
            })}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
