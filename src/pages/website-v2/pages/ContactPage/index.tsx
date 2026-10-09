import { Box, Link, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { ChevronRight, Clock3, Mail, MapPin, Phone, Smartphone } from 'lucide-react'
import { PublicContainer } from '../../components/PublicContainer'
import { websiteDesignSystem as ds, websiteSectionPadding } from '../../theme/websiteDesignSystem'

// Match the Google Maps iframe format used by the previous Greenlight Contact page.
const mapUrl = 'https://maps.google.com/maps?height=400&hl=en&ie=UTF8&iwloc=B&output=embed&q=Wadala+Udyog+Bhavan%2C+Naigaon+Cross+Road%2C+NMGS+Marg%2C+Mumbai+400031&t=&width=600&z=16'

const contactLinkSx = {
  display: 'inline-block',
  color: ds.color.teal,
  fontWeight: 500,
  textDecoration: 'none',
  borderRadius: '2px',
  '&:hover': { color: ds.color.brandHover, textDecoration: 'underline' },
  '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 },
} as const

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, minWidth: 0 }}>
      <Box
        aria-hidden="true"
        sx={{
          flex: '0 0 44px',
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
          color: ds.color.brandHover,
          bgcolor: ds.color.successSurface,
          borderRadius: '50%',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, pt: 0.25 }}>
        <Typography sx={{ color: ds.color.navy, fontSize: 15, fontWeight: 700, lineHeight: 1.35, mb: 0.25 }}>
          {label}
        </Typography>
        <Box sx={{ color: ds.color.textSecondary, fontSize: 15, lineHeight: 1.5, overflowWrap: 'anywhere' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export function ContactPage() {
  return (
    <Box sx={{ bgcolor: ds.color.canvas }}>
      <Box
        component="section"
        aria-labelledby="contact-hero-title"
        sx={{
          minHeight: { xs: 254, md: 292 },
          display: 'flex',
          alignItems: 'center',
          color: ds.color.white,
          bgcolor: ds.color.navy,
          backgroundImage: `linear-gradient(90deg, rgba(0, 31, 63, 0.84) 0%, rgba(0, 31, 63, 0.62) 42%, rgba(0, 31, 63, 0.16) 100%), url('/images/contact-mumbai-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '73% center', md: 'center 52%' },
        }}
      >
        <PublicContainer sx={{ py: { xs: 5, md: 6 } }}>
          <Box component="nav" aria-label="Breadcrumb" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.75, fontSize: 14 }}>
            <Link href="/" sx={{ color: 'rgba(255,255,255,0.92)', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, '&:focus-visible': { outline: `3px solid ${ds.color.white}`, outlineOffset: 3 } }}>
              Home
            </Link>
            <ChevronRight size={15} aria-hidden="true" />
            <Typography component="span" sx={{ fontSize: 14, color: ds.color.white }}>Contact Us</Typography>
          </Box>
          <Typography
            id="contact-hero-title"
            component="h1"
            sx={{ fontFamily: ds.fonts.display, fontSize: { xs: 38, sm: 44, md: ds.type.h1.size }, fontWeight: ds.type.h1.weight, lineHeight: ds.type.h1.lineHeight, letterSpacing: ds.type.h1.tracking, mb: 1.25 }}
          >
            Contact Us
          </Typography>
          <Typography sx={{ maxWidth: 650, color: 'rgba(255,255,255,0.94)', fontSize: { xs: 15, md: 17 }, lineHeight: 1.6 }}>
            We&apos;re here to help. Reach out to our team for any queries, bookings or support.
          </Typography>
        </PublicContainer>
      </Box>

      <PublicContainer sx={{ py: websiteSectionPadding.regular }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: { xs: 2.5, md: 3 },
            alignItems: 'stretch',
            '@media (min-width: 800px)': { gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' },
          }}
        >
          <Box
            component="section"
            aria-labelledby="contact-details-title"
            sx={{
              minWidth: 0,
              p: { xs: 3, sm: 3.5, md: 4 },
              bgcolor: ds.color.surface,
              border: `1px solid ${ds.color.border}`,
              borderRadius: `${ds.radius.large}px`,
              boxShadow: ds.shadow.subtle,
            }}
          >
            <Typography id="contact-details-title" component="h2" sx={{ color: ds.color.navy, fontSize: { xs: 26, md: 28 }, fontWeight: 700, lineHeight: 1.25, mb: 1 }}>
              Get in Touch
            </Typography>
            <Typography sx={{ color: ds.color.textSecondary, fontSize: 15, lineHeight: 1.6, mb: 3 }}>
              Have a question or need assistance? Our team is always here to help you with your travel and visa needs.
            </Typography>

            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <ContactItem icon={<Mail size={21} strokeWidth={2} />} label="Drop Us a Line">
                <Link href="mailto:visa@gltsonline.in" sx={contactLinkSx}>visa@gltsonline.in</Link>
              </ContactItem>
              <ContactItem icon={<Phone size={21} strokeWidth={2} />} label="Phone">
                <Link href="tel:+912246025915" sx={contactLinkSx}>+91 22 4602 5915</Link>
              </ContactItem>
              <ContactItem icon={<Smartphone size={21} strokeWidth={2} />} label="Mobile">
                <Link href="tel:+919372894568" sx={contactLinkSx}>+91 93728 94568</Link>
                <br />
                <Link href="tel:+919321879181" sx={contactLinkSx}>+91 93218 79181</Link>
              </ContactItem>
              <ContactItem icon={<MapPin size={21} strokeWidth={2} />} label="Office">
                <Box component="address" sx={{ fontStyle: 'normal' }}>
                  B7, Wadala Udyog Bhavan,<br />
                  Naigaon Cross Road,<br />
                  NMGS Marg,<br />
                  Dadar / Wadala,<br />
                  Mumbai 400031
                </Box>
              </ContactItem>
              <ContactItem icon={<Clock3 size={21} strokeWidth={2} />} label="Working Hours">
                Mon - Sat : 10:00 AM - 6:00 PM<br />
                (Sunday Closed)
              </ContactItem>
            </Box>
          </Box>

          <Box
            component="section"
            aria-label="Office location map"
            sx={{
              position: 'relative',
              minWidth: 0,
              minHeight: { xs: 340, sm: 390, md: 520 },
              overflow: 'hidden',
              bgcolor: ds.color.surfaceMuted,
              border: `1px solid ${ds.color.border}`,
              borderRadius: `${ds.radius.large}px`,
              boxShadow: ds.shadow.subtle,
            }}
          >
            <Box
              component="iframe"
              title="Map showing Wadala Udyog Bhavan, Wadala, Mumbai"
              src={mapUrl}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              sx={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', border: 0 }}
            />
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
