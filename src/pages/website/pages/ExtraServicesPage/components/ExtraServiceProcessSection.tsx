import { Box, Stack, Typography } from '@mui/material'
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteRadius } from '@/pages/website/theme/siteTheme'
import { applyFlow } from '@/pages/website/theme/applyFlowTheme'

/**
 * What happens to the enquiry after Submit.
 *
 * The form on this page does not take a payment or open a case on its own — it creates an
 * order enquiry that the operations desk reviews and converts into a tracked order. Saying
 * so here is the difference between a lead form and an instrument: the visitor knows what
 * they just started, what comes back, and when a price is fixed.
 *
 * Numbered because the content genuinely is a sequence — each step waits on the one before.
 */

const steps = [
  {
    title: 'You submit the enquiry',
    body: 'Pick the service, tell us who to contact, and send it. The request lands with the GreenLight operations desk against its own reference.',
  },
  {
    title: 'A specialist scopes it',
    body: 'We confirm the documents required, the turnaround, and the price for your specific case, and come back to you on the contact details you gave.',
  },
  {
    title: 'It becomes a tracked order',
    body: 'Once you approve the scope, the enquiry converts into an order you can follow from collection through attestation, notarisation, or issue, to return.',
  },
] as const

export function ExtraServiceProcessSection() {
  return (
    <SiteSection id="extra-service-process" tone="canvas">
      <SiteSectionHeading
        eyebrow="After you submit"
        title="An enquiry, not an invoice."
        lead="Nothing is charged when you send the form. Here is what happens between your request and the finished document."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
          gap: '1px',
          backgroundColor: site.hairline,
          border: `1px solid ${site.hairline}`,
          borderRadius: siteRadius.card,
          overflow: 'hidden',
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={step.title}
            sx={{ backgroundColor: site.surface, p: { xs: 3.5, md: 4 } }}
          >
            <Stack direction="row" alignItems="center" spacing={1.75} sx={{ mb: 2.5 }}>
              <Typography
                aria-hidden
                sx={{
                  fontFamily: siteFont.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  fontVariantNumeric: 'tabular-nums',
                  color: applyFlow.accentInk,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <Box
                aria-hidden
                sx={{ flex: 1, height: '1px', backgroundColor: site.hairline }}
              />
            </Stack>

            <Typography
              component="h3"
              sx={{
                fontFamily: siteFont.display,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: site.ink,
                lineHeight: 1.25,
                mb: 1.25,
              }}
            >
              {step.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: siteFont.body,
                fontSize: 13,
                color: site.inkMuted,
                lineHeight: 1.6,
              }}
            >
              {step.body}
            </Typography>
          </Box>
        ))}
      </Box>
    </SiteSection>
  )
}
