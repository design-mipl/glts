import { Box, Grid, Typography, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicColors, publicLayout, publicTypography, publicFonts } from '../../../theme/publicSiteTokens'

export function FAQSection() {
  return (
    <Box sx={{ py: publicLayout.sectionMedium, backgroundColor: '#fff' }}>
      <PublicContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontFamily: publicFonts.heading,
              color: publicColors.navy,
              fontSize: publicTypography.h2,
            }}
          >
            Common questions
          </Typography>
          <Button
            variant="text"
            href="/track"
            endIcon={<ArrowRight size={15} />}
            sx={{ color: '#10B981', fontWeight: 600, fontSize: '13px', textTransform: 'none', p: 0 }}
          >
            Visit Help Center
          </Button>
        </Box>

        <Grid container spacing={3}>
          {[
            { q: 'How fast is fast?', a: 'Median eVisa: 3.4 days. Embassy stamps: 12–18 days. We show you the exact ETA before you pay.' },
            { q: 'What if my application is rejected?', a: 'We refund the service fee and re-file at no extra cost. Our team reviews before submission to reduce this risk.' },
            { q: 'Do you store my passport?', a: 'No. Encrypted at rest, purged 30 days after approval. We comply with GDPR and ISO 27001.' },
            { q: 'Marine crew without a fixed address?', a: "We accept seaman book + employer letter in lieu of utility bills and rental agreements." },
            { q: 'Can I manage multiple travelers at once?', a: 'Yes. Corporate and marine accounts support bulk CSV uploads, team dashboards, and parallel filing.' },
            { q: 'Do you support all nationalities?', a: 'We support 192 destination countries and most major nationalities. Check your eligibility on the country page.' },
          ].map(({ q, a }) => (
            <Grid size={{ xs: 12, md: 6 }} key={q}>
              <Box
                sx={{
                  p: 4,
                  backgroundColor: publicColors.surface,
                  borderRadius: publicLayout.cardRadius,
                  border: `1px solid ${publicColors.border}`,
                  height: '100%',
                }}
              >
                <Typography sx={{ fontWeight: 700, color: publicColors.navy, fontSize: '18px', mb: 1.5 }}>{q}</Typography>
                <Typography sx={{ color: publicColors.textSecondary, fontSize: publicTypography.body, lineHeight: 1.7 }}>{a}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
