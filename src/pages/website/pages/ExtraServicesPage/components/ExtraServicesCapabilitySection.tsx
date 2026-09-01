import { Box, ButtonBase, Typography } from '@mui/material'
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteMotion, siteRadius } from '@/pages/website/theme/siteTheme'
import { extraServices } from '../extraServicesPageData'

interface ExtraServicesCapabilitySectionProps {
  activeServiceId: string
  onSelectService: (index: number) => void
}

export function ExtraServicesCapabilitySection({
  activeServiceId,
  onSelectService,
}: ExtraServicesCapabilitySectionProps) {
  return (
    <SiteSection id="extra-services-overview" tone="canvas">
      <SiteSectionHeading
        eyebrow="Additional services"
        title="More than visa processing."
        lead="Document attestation, notary support, and travel insurance — handled with the same precision as your visa file."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          gap: '1px',
          backgroundColor: site.hairline,
          border: `1px solid ${site.hairline}`,
          borderRadius: siteRadius.card,
          overflow: 'hidden',
        }}
      >
        {extraServices.map((service, index) => {
          const Icon = service.capability.icon
          const active = service.id === activeServiceId

          return (
            <ButtonBase
              key={service.id}
              component="div"
              onClick={() => onSelectService(index)}
              disableRipple
              sx={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                backgroundColor: active ? site.canvas : site.surface,
                p: { xs: 3.5, md: 4 },
                transition: `background-color 200ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { backgroundColor: site.canvas },
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: siteRadius.chip,
                  border: `1px solid ${site.hairline}`,
                  backgroundColor: site.canvas,
                  color: site.inkMuted,
                  mb: 2.25,
                }}
              >
                <Icon size={15} strokeWidth={1.9} />
              </Box>

              <Typography
                sx={{
                  fontFamily: siteFont.display,
                  fontSize: 15.5,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: site.ink,
                  lineHeight: 1.25,
                  mb: 1.25,
                }}
              >
                {service.capability.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: siteFont.body,
                  fontSize: 13,
                  color: site.inkMuted,
                  lineHeight: 1.55,
                }}
              >
                {service.capability.description}
              </Typography>
            </ButtonBase>
          )
        })}
      </Box>
    </SiteSection>
  )
}
