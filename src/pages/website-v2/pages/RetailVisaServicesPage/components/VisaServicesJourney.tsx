import { useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { ProcessTimelineCopy, ProcessTimelineMarker, ResponsiveProcessTimeline } from '../../../components/workflowTimeline/ProcessTimeline'
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
          <Typography id="visa-journey-heading" component="h2" sx={{ ...websiteHeadingSx.h2, color: ds.color.navy, mb: 0.85 }}>Your Visa Journey, Simplified</Typography>
          <Typography sx={{ fontFamily: ds.fonts.ui, fontSize: { xs: 15, desktop: 16 }, lineHeight: 1.6, color: ds.color.textSecondary }}>From checking requirements to tracking your application, GreenLight combines technology with expert visa review at every important step.</Typography>
        </Box>
        <Box ref={timelineRef} sx={{ position: 'relative' }}>
          <Box aria-hidden="true" sx={{ display: { xs: 'none', xl: 'block' }, position: 'absolute', top: 66, left: '10%', right: '10%', height: 2, bgcolor: '#dbe4ea', zIndex: 0 }}>
            <Box sx={{ width: '100%', height: '100%', bgcolor: ds.color.brand, transformOrigin: 'left center', transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: reducedMotion ? 'none' : 'transform 950ms ease-out' }} />
          </Box>
          <ResponsiveProcessTimeline
            steps={howItWorksSteps}
            ariaLabel="Your visa journey steps"
            variant="visa-journey"
            horizontalAt={ds.breakpoint.tabletLandscape}
            listSx={{ gap: { xs: 0, xl: 2.5 } }}
            getItemSx={(_, index) => ({
              minWidth: 0, display: 'flex', gap: 2, textAlign: { xs: 'left', md: 'center' },
              opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(.96)',
              transition: reducedMotion ? 'none' : `opacity 360ms ease-out ${index * stagger}ms, transform 360ms ease-out ${index * stagger}ms`,
              [`@media (min-width: ${ds.breakpoint.tabletLandscape}px)`]: { display: 'block' },
            })}
            renderStep={(step, index) => (
              <>
                  <Box sx={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, [`@media (min-width: ${ds.breakpoint.tabletLandscape}px)`]: { width: '100%' } }}>
                    <Box aria-hidden="true" sx={{ width: 25, height: 25, borderRadius: '50%', display: 'grid', placeItems: 'center', color: index === 0 ? '#fff' : ds.color.navy, bgcolor: index === 0 ? ds.color.brandHover : '#e5eaf0', fontSize: ds.type.caption.size, fontWeight: 800, mb: 1.1 }}>{index + 1}</Box>
                    <ProcessTimelineMarker icon={step.icon} iconSize={ds.icon.process} containerSize={64} background={index === 0 || visible ? '#e4fbe9' : '#fff'} borderColor={index === 0 || visible ? '#a7e6b0' : '#dce5eb'} color={index === 0 || visible ? ds.color.brandHover : ds.color.navy} strokeWidth={ds.icon.strokeWidth} containerSx={{ transition: reducedMotion ? 'none' : `background-color 400ms ease ${index * stagger}ms, border-color 400ms ease ${index * stagger}ms, color 400ms ease ${index * stagger}ms` }} />
                    {index < howItWorksSteps.length - 1 && <Box aria-hidden="true" sx={{ width: 2, flex: 1, minHeight: 30, bgcolor: '#dbe4ea', [`@media (min-width: ${ds.breakpoint.tabletLandscape}px)`]: { display: 'none' } }}><Box sx={{ width: '100%', height: '100%', bgcolor: ds.color.brand, transformOrigin: 'top', transform: visible ? 'scaleY(1)' : 'scaleY(0)', transition: reducedMotion ? 'none' : `transform 450ms ease ${index * stagger}ms` }} /></Box>}
                  </Box>
                  <Box sx={{ pt: { xs: 3.75, xl: 2.25 }, pb: { xs: 3.5, xl: 0 } }}>
                    <ProcessTimelineCopy title={step.title} description={step.description} titleSx={{ color: index === 0 ? ds.color.brandHover : ds.color.navy, fontSize: { xs: 16, desktop: 17 }, lineHeight: 1.3, mb: 0.9 }} descriptionSx={{ fontFamily: ds.fonts.ui, color: ds.color.textSecondary, fontSize: { xs: 15, desktop: 16 }, lineHeight: 1.6 }} />
                  </Box>
              </>
            )}
          />
        </Box>
      </PublicContainer>
    </Box>
  )
}
