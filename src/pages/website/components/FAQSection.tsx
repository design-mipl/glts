import { useState } from 'react'
import { Box, Typography, Button, Collapse } from '@mui/material'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicTypography, publicFonts, usePublicBrandColors } from '../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../pages/LandingPage/landingPageSpacing'

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

const DEFAULT_TITLE = "FAQ's"

export function FAQSection({ faqs, title = DEFAULT_TITLE }: FAQSectionProps) {
  const colors = usePublicBrandColors()
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <Box component="section" sx={{ py: landingSectionPy, backgroundColor: colors.white }}>
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: landingSectionHeaderMb,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontFamily: publicFonts.heading,
              color: colors.navy,
              fontSize: publicTypography.h2,
            }}
          >
            {title}
          </Typography>
          <Button
            variant="text"
            href="/track"
            endIcon={<ArrowRight size={15} />}
            sx={{
              color: colors.greenBright,
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              p: 0,
            }}
          >
            Visit Help Center
          </Button>
        </Box>

        <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
          {faqs.map(({ q, a }, index) => {
            const isOpen = expanded.has(index)
            return (
              <Box
                key={q}
                sx={{
                  borderBottom: `1px solid ${colors.border}`,
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 3,
                    py: { xs: 2.5, md: 3 },
                    px: 0,
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
                      fontSize: { xs: '16px', md: '17px' },
                      lineHeight: 1.4,
                    }}
                  >
                    {q}
                  </Typography>
                  <ChevronDown
                    size={20}
                    color={colors.navy}
                    strokeWidth={2}
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </Box>

                <Collapse in={isOpen} timeout={200}>
                  <Typography
                    sx={{
                      pb: { xs: 2.5, md: 3 },
                      pr: { xs: 0, md: 4 },
                      color: colors.textSecondary,
                      fontSize: publicTypography.body,
                      lineHeight: 1.7,
                      maxWidth: 720,
                    }}
                  >
                    {a}
                  </Typography>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </PublicContainer>
    </Box>
  )
}
