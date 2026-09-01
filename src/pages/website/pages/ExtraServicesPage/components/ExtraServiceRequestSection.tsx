import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
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
import { mrzSx, site, siteFont, siteRadius, siteType } from '@/pages/website/theme/siteTheme'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'
import {
  extraServiceSelectOptions,
  extraServices,
  resolveExtraServiceId,
  type ExtraServiceDefinition,
  type ExtraServiceId,
} from '../extraServicesPageData'

type RequestFormState = {
  companyName: string
  contactPerson: string
  mobile: string
  email: string
  companyAddress: string
  service: ExtraServiceId
}

const EMPTY_FORM: RequestFormState = {
  companyName: '',
  contactPerson: '',
  mobile: '',
  email: '',
  companyAddress: '',
  service: 'attestation',
}

function ServiceContentPanel({ service }: { service: ExtraServiceDefinition }) {
  const [imgSrc, setImgSrc] = useState(service.image.src)

  useEffect(() => {
    setImgSrc(service.image.src)
  }, [service.image.src])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: siteRadius.card,
        border: `1px solid ${site.hairline}`,
        backgroundColor: site.surface,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box sx={{ p: { xs: 2.75, md: 3.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.75} sx={{ mb: 2.5 }}>
          <Box
            aria-hidden
            sx={{ width: 20, height: '1px', backgroundColor: site.accent, flex: '0 0 auto' }}
          />
          <Typography sx={mrzSx}>{service.tabLabel}</Typography>
        </Stack>

        <Box sx={{ mb: 2.25 }}>
          <Typography
            component="h2"
            sx={{
              ...siteType.section,
              fontSize: { xs: 22, sm: 24, md: 26 },
              mb: 1.25,
            }}
          >
            {service.headline}
          </Typography>
          <Typography sx={{ ...siteType.body, fontSize: { xs: 14, md: 14.5 }, lineHeight: 1.6 }}>
            {service.lead}
          </Typography>
        </Box>

        <Stack component="ul" spacing={1} sx={{ m: 0, p: 0, listStyle: 'none' }}>
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

      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: { xs: 200, sm: 220, md: 240 },
          mt: 'auto',
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt={service.image.alt}
          loading="lazy"
          onError={() => setImgSrc(service.image.fallback)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: service.image.objectPosition ?? 'center',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.12) 32%, rgba(8,24,43,0.14) 100%)',
          }}
        />
      </Box>
    </Box>
  )
}

export function ExtraServiceRequestSection() {
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialService = resolveExtraServiceId(searchParams.get('service'))
  const [form, setForm] = useState<RequestFormState>({
    ...EMPTY_FORM,
    service: initialService,
  })
  const [submitting, setSubmitting] = useState(false)

  const activeService =
    extraServices.find((service) => service.id === form.service) ?? extraServices[0]

  useEffect(() => {
    const serviceFromUrl = resolveExtraServiceId(searchParams.get('service'))
    setForm((current) => ({ ...current, service: serviceFromUrl }))
  }, [searchParams])

  const setField = useCallback(<K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }, [])

  const handleServiceChange = useCallback(
    (service: ExtraServiceId) => {
      setForm((current) => ({ ...current, service }))
      setSearchParams({ service }, { replace: true })
    },
    [setSearchParams],
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

      setSubmitting(true)
      void orderEnquiryService
        .createFromWebsite({
          companyName: form.companyName,
          contactPerson: form.contactPerson,
          mobile: form.mobile,
          email: form.email,
          companyAddress: form.companyAddress,
          service: form.service,
        })
        .then(() => {
          setForm({ ...EMPTY_FORM, service: activeService.id })
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
        pt: { xs: 2.5, md: 3.5 },
        pb: landingSectionPy,
        backgroundColor: site.surface,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
            gap: { xs: 4, md: 6 },
            alignItems: { xs: 'start', md: 'stretch' },
          }}
        >
          <ServiceContentPanel service={activeService} />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              alignSelf: { md: 'start' },
              p: { xs: 3, md: 4 },
              borderRadius: applyRadius.card,
              border: `1px solid ${applyFlow.hairline}`,
              backgroundColor: site.surface,
              boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Typography
              sx={{
                fontFamily: siteFont.display,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: site.ink,
                mb: 3,
              }}
            >
              Request this service
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
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
                  value={form.service}
                  options={extraServiceSelectOptions}
                  onChange={(value) => handleServiceChange(value as ExtraServiceId)}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={!isValid || submitting}
                sx={{
                  ...getAccentButtonSx(),
                  mt: 1,
                  px: 3.5,
                  py: 1.75,
                  fontSize: 14,
                }}
              >
                {submitting ? 'Submitting…' : 'Submit request'}
              </Button>

              <Typography
                sx={{
                  fontFamily: applyFont.body,
                  fontSize: 12,
                  color: applyFlow.inkFaint,
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                By submitting, you agree to be contacted by GreenLight about this request. We do not
                share your details with third parties without consent.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
