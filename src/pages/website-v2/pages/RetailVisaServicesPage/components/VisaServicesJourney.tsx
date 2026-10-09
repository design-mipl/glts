import { useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { howItWorksSteps } from '../../LandingPage/landingWorkflowContent'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'

const stagger = 170

export function VisaServicesJourney() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(() => typeof IntersectionObserver === 'undefined')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const visible = entered || reducedMotion

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || reducedMotion || entered || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect() }
    }, { threshold: 0.15 })
    observer.observe(timeline)
    return () => observer.disconnect()
  }, [entered, reducedMotion])

  return (
    <Box component="section" id="how-it-works" aria-labelledby="visa-journey-heading"
      sx={{ bgcolor: '#fff', py: landingSectionPy, scrollMarginTop: 88 }}>
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 820, mb: { xs: 4, md: 5 } }}>
          <Typography sx={{ color: ds.color.brandHover, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', mb: 0.75 }}>Your journey</Typography>
          <Typography id="visa-journey-heading" component="h2" sx={{ fontFamily: ds.fonts.display, fontSize: { xs: 31, md: 36, desktop: 40 }, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-.025em', color: ds.color.navy, mb: 0.85 }}>Your Visa Journey, Simplified</Typography>
          <Typography sx={{ fontFamily: ds.fonts.ui, fontSize: { xs: 15, desktop: 16 }, lineHeight: 1.6, color: ds.color.textSecondary }}>From checking requirements to tracking your application, GreenLight combines technology with expert visa review at every important step.</Typography>
        </Box>
        <Box ref={timelineRef} sx={{ position: 'relative' }}>
          <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 66, left: '10%', right: '10%', height: 2, bgcolor: '#dbe4ea', zIndex: 0 }}>
            <Box sx={{ width: '100%', height: '100%', bgcolor: ds.color.brand, transformOrigin: 'left center', transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: reducedMotion ? 'none' : 'transform 950ms ease-out' }} />
          </Box>
          <Box component="ol" aria-label="Your visa journey steps" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, minmax(0, 1fr))' }, gap: { xs: 0, md: 2.5 }, listStyle: 'none', p: 0, m: 0 }}>
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Box component="li" key={step.id} sx={{
                  minWidth: 0, display: 'flex', gap: 2, textAlign: { xs: 'left', md: 'center' },
                  opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(.96)',
                  transition: reducedMotion ? 'none' : `opacity 360ms ease-out ${index * stagger}ms, transform 360ms ease-out ${index * stagger}ms`,
                  '@media (min-width: 900px)': { display: 'block' },
                }}>
                  <Box sx={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, '@media (min-width: 900px)': { width: '100%' } }}>
                    <Box aria-hidden="true" sx={{ width: 25, height: 25, borderRadius: '50%', display: 'grid', placeItems: 'center', color: index === 0 ? '#fff' : ds.color.navy, bgcolor: index === 0 ? ds.color.brandHover : '#e5eaf0', fontSize: 12, fontWeight: 800, mb: 1.1 }}>{index + 1}</Box>
                    <Box sx={{ width: 64, height: 64, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: index === 0 ? '#e4fbe9' : '#fff', border: `2px solid ${index === 0 ? '#8be69b' : '#dce5eb'}`, color: index === 0 ? ds.color.brandHover : ds.color.navy, boxShadow: '0 4px 12px rgba(20,50,70,.04)', transition: reducedMotion ? 'none' : `background-color 400ms ease ${index * stagger}ms, border-color 400ms ease ${index * stagger}ms, color 400ms ease ${index * stagger}ms`, ...(index > 0 ? { ...(visible ? { bgcolor: '#eefbef', borderColor: '#a7e6b0', color: ds.color.brandHover } : {}) } : {}) }}>
                      <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
                    </Box>
                    {index < howItWorksSteps.length - 1 && <Box aria-hidden="true" sx={{ width: 2, flex: 1, minHeight: 30, bgcolor: '#dbe4ea', '@media (min-width: 900px)': { display: 'none' } }}><Box sx={{ width: '100%', height: '100%', bgcolor: ds.color.brand, transformOrigin: 'top', transform: visible ? 'scaleY(1)' : 'scaleY(0)', transition: reducedMotion ? 'none' : `transform 450ms ease ${index * stagger}ms` }} /></Box>}
                  </Box>
                  <Box sx={{ pt: { xs: 3.75, md: 2.25 }, pb: { xs: 3.5, md: 0 } }}>
                    <Typography component="h3" sx={{ fontFamily: ds.fonts.ui, color: index === 0 ? ds.color.brandHover : ds.color.navy, fontSize: { xs: 17, desktop: 18 }, fontWeight: 800, lineHeight: 1.3, mb: 0.9 }}>{step.title}</Typography>
                    <Typography sx={{ fontFamily: ds.fonts.ui, color: ds.color.textSecondary, fontSize: { xs: 14, desktop: 14.5 }, lineHeight: 1.55 }}>{step.description}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
