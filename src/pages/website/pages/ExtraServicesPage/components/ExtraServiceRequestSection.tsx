import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Check, ShieldCheck } from 'lucide-react'
import { useToast } from '@/design-system/UIComponents'
import { orderEnquiryService } from '@/shared/services/orderEnquiryService'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  ApplySelect,
  ApplyTextField,
  ApplyTextarea,
  FieldLabel,
} from '@/pages/website/theme/applyFormControls'
import {
  applyFlow,
  applyFont,
  applyRadius,
  getAccentButtonSx,
} from '@/pages/website/theme/applyFlowTheme'
import {
  clippedCorner,
  mrzSx,
  site,
  siteFont,
  siteMotion,
  siteRadius,
  siteType,
} from '@/pages/website/theme/siteTheme'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'
import { ExtraServiceSelector } from './ExtraServiceSelector'
import {
  extraServiceSelectOptions,
  extraServiceTabId,
  extraServices,
  type ExtraServiceDefinition,
  type ExtraServiceId,
} from '../extraServicesPageData'

const PANEL_ID = 'extra-service-detail-panel'

type RequestFormState = {
  companyName: string
  contactPerson: string
  mobile: string
  email: string
  companyAddress: string
}

const EMPTY_FORM: RequestFormState = {
  companyName: '',
  contactPerson: '',
  mobile: '',
  email: '',
  companyAddress: '',
}

interface ExtraServiceRequestSectionProps {
  activeServiceId: ExtraServiceId
  onSelectService: (service: ExtraServiceId) => void
}

function ServiceImage({ image }: { image: ExtraServiceDefinition['image'] }) {
  const [imgSrc, setImgSrc] = useState(image.src)
  const [loaded, setLoaded] = useState(false)

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setImgSrc(image.fallback)
        setLoaded(true)
      }}
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: image.objectPosition ?? 'center',
        opacity: loaded ? 1 : 0,
        transition: `opacity 260ms ${siteMotion.easeOut}`,
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    />
  )
}

/**
 * Detail for the selected service.
 *
 * The photograph leads rather than trailing the copy. In the previous pass it sat at the
 * bottom of the panel under a white-to-transparent wash, which read as filler and blew out
 * the top third of every image. Here it is the panel's masthead, cut at the top-right with
 * the site's clipped travel-document corner, with the service name in the MRZ device over a
 * bottom scrim — so the label stays legible on a bright frame and on a dark one.
 *
 * The only motion is the image fading in once decoded. Swapping a cached photo for a
 * not-yet-loaded one is the jarring change worth spending an animation on; the copy beneath
 * it changes instantly, because the visitor clicked to read it.
 */
function ServiceDetailPanel({ service }: { service: ExtraServiceDefinition }) {
  return (
    <Box
      role="tabpanel"
      id={PANEL_ID}
      aria-labelledby={extraServiceTabId(service.id)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: siteRadius.card,
        border: `1px solid ${site.hairline}`,
        backgroundColor: site.surface,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          backgroundColor: site.canvas,
          clipPath: clippedCorner(22),
          overflow: 'hidden',
        }}
      >
        {/* Keyed so a service change remounts the image with its own load state — the
            fade then plays for the new photograph instead of being stuck at opacity 1. */}
        <ServiceImage key={service.id} image={service.image} />

        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            insetInline: 0,
            bottom: 0,
            height: '46%',
            background:
              'linear-gradient(180deg, rgba(8, 24, 43, 0) 0%, rgba(8, 24, 43, 0.70) 100%)',
          }}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ position: 'absolute', left: { xs: 16, md: 20 }, bottom: { xs: 14, md: 16 } }}
        >
          <Box
            aria-hidden
            sx={{ width: 18, height: '1px', backgroundColor: site.accent, flex: '0 0 auto' }}
          />
          <Typography sx={{ ...mrzSx, color: 'rgba(255, 255, 255, 0.92)' }}>
            {service.tabLabel}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 2.75, md: 3.5 } }}>
        <Typography
          component="h2"
          sx={{ ...siteType.section, fontSize: { xs: 22, sm: 24, md: 26 }, mb: 1.5 }}
        >
          {service.headline}
        </Typography>
        <Typography
          sx={{ ...siteType.body, fontSize: { xs: 14, md: 14.5 }, lineHeight: 1.6, mb: 2.75 }}
        >
          {service.lead}
        </Typography>

        <Stack
          component="ul"
          spacing={1.25}
          sx={{
            m: 0,
            p: 0,
            pt: 2.75,
            listStyle: 'none',
            borderTop: `1px solid ${site.hairline}`,
          }}
        >
          {service.highlights.map((highlight) => (
            <Stack
              key={highlight}
              component="li"
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
            >
              <Box
                aria-hidden
                sx={{
                  width: 18,
                  height: 18,
                  mt: 0.125,
                  borderRadius: applyRadius.full,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: applyFlow.accentSoft,
                  color: applyFlow.accentInk,
                  flex: '0 0 auto',
                }}
              >
                <Check size={10} strokeWidth={2.5} />
              </Box>
              <Typography
                sx={{
                  fontFamily: siteFont.body,
                  fontSize: 13,
                  color: site.inkMuted,
                  lineHeight: 1.5,
                }}
              >
                {highlight}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export function ExtraServiceRequestSection({
  activeServiceId,
  onSelectService,
}: ExtraServiceRequestSectionProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState<RequestFormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [sentToEmail, setSentToEmail] = useState<string | null>(null)

  const activeService =
    extraServices.find((service) => service.id === activeServiceId) ?? extraServices[0]

  const setField = useCallback(
    <K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }))
      setSentToEmail(null)
    },
    [],
  )

  const isValid = useMemo(() => {
    return (
      form.companyName.trim().length > 0 &&
      form.contactPerson.trim().length > 0 &&
      form.mobile.trim().length >= 8 &&
      form.email.trim().includes('@') &&
      form.companyAddress.trim().length > 0
    )
  }, [form])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isValid || submitting) return

      const email = form.email.trim()
      setSubmitting(true)
      void orderEnquiryService
        .createFromWebsite({
          companyName: form.companyName,
          contactPerson: form.contactPerson,
          mobile: form.mobile,
          email,
          companyAddress: form.companyAddress,
          service: activeService.id,
        })
        .then(() => {
          setForm(EMPTY_FORM)
          setSentToEmail(email)
          showToast({
            title: 'Request received',
            description: 'A GreenLight specialist will contact you shortly.',
            variant: 'success',
          })
        })
        .finally(() => setSubmitting(false))
    },
    [activeService.id, form, isValid, showToast, submitting],
  )

  return (
    <Box
      component="section"
      id="extra-service-request"
      sx={{
        pt: { xs: 6, md: 9 },
        pb: landingSectionPy,
        backgroundColor: site.surface,
        scrollMarginTop: { xs: 72, md: 88 },
      }}
    >
      <PublicContainer variant="hero">
        <ExtraServiceSelector
          activeServiceId={activeServiceId}
          onSelectService={onSelectService}
          panelId={PANEL_ID}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.05fr 1fr' },
            gap: { xs: 4, xl: 6 },
            alignItems: 'start',
          }}
        >
          <ServiceDetailPanel service={activeService} />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: applyRadius.card,
              border: `1px solid ${applyFlow.hairline}`,
              backgroundColor: site.surface,
              boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Typography sx={{ ...mrzSx, mb: 1.5 }}>Enquiry</Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: siteFont.display,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: site.ink,
                mb: 1.25,
              }}
            >
              Request {activeService.capability.title.toLowerCase()}
            </Typography>
            <Typography
              sx={{
                fontFamily: siteFont.body,
                fontSize: 13.5,
                color: site.inkMuted,
                lineHeight: 1.55,
                mb: 3,
              }}
            >
              Nothing is charged here. A specialist confirms the documents, turnaround, and
              price for your case before any work starts.
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <FieldLabel htmlFor="extra-company-name" required>
                  Customer / Company Name
                </FieldLabel>
                <ApplyTextField
                  id="extra-company-name"
                  value={form.companyName}
                  onChange={(value) => setField('companyName', value)}
                  placeholder="e.g. Acme Travels Pvt Ltd"
                />
              </Box>

              <Box>
                <FieldLabel htmlFor="extra-contact-person" required>
                  Contact Person Name
                </FieldLabel>
                <ApplyTextField
                  id="extra-contact-person"
                  value={form.contactPerson}
                  onChange={(value) => setField('contactPerson', value)}
                  placeholder="e.g. Priya Sharma"
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                <Box>
                  <FieldLabel htmlFor="extra-mobile" required>
                    Mobile Number
                  </FieldLabel>
                  <ApplyTextField
                    id="extra-mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(value) => setField('mobile', value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </Box>
                <Box>
                  <FieldLabel htmlFor="extra-email" required>
                    Email Address
                  </FieldLabel>
                  <ApplyTextField
                    id="extra-email"
                    type="email"
                    value={form.email}
                    onChange={(value) => setField('email', value)}
                    placeholder="e.g. priya@acmetravels.com"
                  />
                </Box>
              </Box>

              <Box>
                <FieldLabel htmlFor="extra-company-address" required>
                  Company Address
                </FieldLabel>
                <ApplyTextarea
                  id="extra-company-address"
                  value={form.companyAddress}
                  onChange={(value) => setField('companyAddress', value)}
                  placeholder="Building, street, city, state, PIN"
                  rows={3}
                />
              </Box>

              <Box>
                <FieldLabel htmlFor="extra-service" required>
                  Service
                </FieldLabel>
                <ApplySelect
                  id="extra-service"
                  value={activeServiceId}
                  options={extraServiceSelectOptions}
                  onChange={(value) => onSelectService(value as ExtraServiceId)}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={!isValid || submitting}
                sx={{ ...getAccentButtonSx(), mt: 1, px: 3.5, py: 1.75, fontSize: 14 }}
              >
                {submitting ? 'Submitting…' : 'Submit request'}
              </Button>

              <Box aria-live="polite">
                {sentToEmail ? (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      p: 1.75,
                      borderRadius: applyRadius.control,
                      border: `1px solid ${applyFlow.successBorder}`,
                      backgroundColor: applyFlow.successSoft,
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{ color: applyFlow.success, mt: '1px', flex: '0 0 auto' }}
                    >
                      <ShieldCheck size={15} strokeWidth={2} />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: applyFont.body,
                        fontSize: 12.5,
                        color: site.ink,
                        lineHeight: 1.5,
                      }}
                    >
                      Request logged. A specialist will reply to {sentToEmail} with scope and
                      pricing.
                    </Typography>
                  </Stack>
                ) : null}
              </Box>

              <Typography
                sx={{
                  fontFamily: applyFont.body,
                  fontSize: 12,
                  color: applyFlow.inkFaint,
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                By submitting, you agree to be contacted by GreenLight about this request. We do
                not share your details with third parties without consent.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
