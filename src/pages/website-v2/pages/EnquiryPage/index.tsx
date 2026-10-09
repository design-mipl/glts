import { useState, type FormEvent } from 'react'
import { Alert, Box, Typography } from '@mui/material'
import { ArrowRight, Building2, Mail, Phone, Tag, UserRound } from 'lucide-react'
import { Button, Input, Textarea } from '@/design-system/UIComponents'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { enquiryService } from '@/shared/services/enquiryService'
import type { EnquiryFormData } from '@/shared/types/enquiry'
import { PublicContainer } from '../../components/PublicContainer'
import { websiteButtonSx, websiteFieldSx } from '../../theme/websiteComponentStyles'
import { websiteDesignSystem as ds, websiteSectionPadding } from '../../theme/websiteDesignSystem'

type EnquiryField = 'fullName' | 'email' | 'phone' | 'company' | 'subject' | 'message'
type EnquiryValues = Record<EnquiryField, string>
type EnquiryErrors = Partial<Record<EnquiryField, string>>

const emptyValues: EnquiryValues = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
}

const phoneCountry = { code: 'IN', dialCode: '+91' } as const

const fieldSx = {
  ...websiteFieldSx,
  minWidth: 0,
  '& .MuiOutlinedInput-root': {
    minHeight: 54,
    borderRadius: `${ds.radius.medium}px`,
    bgcolor: ds.color.surface,
  },
}

function validate(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {}
  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.'
  if (!values.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  const phoneDigits = values.phone.replace(/\D/g, '')
  if (!phoneDigits) {
    errors.phone = 'Enter your phone number.'
  } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.'
  }

  if (!values.subject.trim()) errors.subject = 'Enter a subject.'
  if (!values.message.trim()) errors.message = 'Write your message.'
  return errors
}

function buildEnquiryPayload(values: EnquiryValues): EnquiryFormData {
  return {
    customer: {
      companyOrCustomerName: values.company.trim() || values.fullName.trim(),
      customerType: 'retail',
      contactPersonName: values.fullName.trim(),
      contactNumber: `${phoneCountry.dialCode} ${values.phone.replace(/\D/g, '')}`,
      emailAddress: values.email.trim(),
    },
    visaRequirement: {
      countries: [],
      visaType: '',
      purposeOfVisit: '',
      numberOfApplicants: 1,
      marineRequirement: false,
      urgencyLevel: 'low',
    },
    operationalRequirements: {
      bulkUploadRequired: false,
      documentPickupRequired: false,
      groundOperationsRequired: false,
      biometricsAssistanceRequired: false,
      courierSupportRequired: false,
      dedicatedSpocRequired: false,
    },
    salesDetails: { inquirySource: 'website', priorityLevel: 'low' },
    notes: {
      initialDiscussionNotes: `Subject: ${values.subject.trim()}\n\nMessage: ${values.message.trim()}`,
    },
    attachments: [],
    followups: [],
  }
}

export function EnquiryPage() {
  const [values, setValues] = useState<EnquiryValues>(emptyValues)
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  const setField = (field: EnquiryField, value: string) => {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    if (errors[field]) setErrors(validate(nextValues))
    if (submitError) setSubmitError('')
    if (success) setSuccess(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError('')
    setSuccess(false)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      await enquiryService.create(buildEnquiryPayload(values), 'Website enquiry')
      setValues(emptyValues)
      setErrors({})
      setSuccess(true)
    } catch {
      setSubmitError('We could not submit your enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ bgcolor: ds.color.canvas, pb: websiteSectionPadding.regular }}>
      <Box
        component="section"
        aria-labelledby="enquiry-hero-title"
        sx={{
          position: 'relative',
          minHeight: { xs: 276, sm: 290, md: 310 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: ds.color.navy,
          backgroundImage: `linear-gradient(90deg, rgba(0, 31, 63, 0.92) 0%, rgba(0, 31, 63, 0.77) 42%, rgba(0, 31, 63, 0.18) 100%), url('/images/destinations-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 52%',
        }}
      >
        <PublicContainer sx={{ position: 'relative', py: { xs: 5, md: 6 } }}>
          <Box sx={{ maxWidth: 700 }}>
            <Typography
              component="p"
              sx={{
                mb: 1.5,
                color: ds.color.brand,
                fontSize: ds.type.eyebrow.size,
                fontWeight: ds.type.eyebrow.weight,
                letterSpacing: ds.type.eyebrow.tracking,
              }}
            >
              LET&apos;S PLAN YOUR NEXT JOURNEY
            </Typography>
            <Typography
              component="h1"
              id="enquiry-hero-title"
              sx={{
                mb: 1.75,
                fontFamily: ds.fonts.display,
                color: ds.color.white,
                fontSize: { xs: 34, sm: 42, md: 48 },
                fontWeight: ds.type.h1.weight,
                lineHeight: 1.12,
                letterSpacing: ds.type.h1.tracking,
              }}
            >
              Send us your Travel Enquiry
            </Typography>
            <Typography sx={{ maxWidth: 580, color: 'rgba(255,255,255,0.9)', fontSize: { xs: 16, md: 17 }, lineHeight: 1.65 }}>
              Tell us what you&apos;re looking for, and our travel experts will create a personalised plan just for you.
            </Typography>
          </Box>
        </PublicContainer>
      </Box>

      <PublicContainer sx={{ pt: websiteSectionPadding.regular }}>
        <Box
          component="section"
          aria-labelledby="enquiry-form-title"
          sx={{
            width: '100%',
            maxWidth: 820,
            mx: 'auto',
            p: { xs: 3, sm: 4, md: 5 },
            bgcolor: ds.color.surface,
            border: `1px solid ${ds.color.border}`,
            borderRadius: `${ds.radius.large}px`,
            boxShadow: ds.shadow.elevated,
          }}
        >
          <Typography
            id="enquiry-form-title"
            component="h2"
            sx={{ color: ds.color.navy, fontSize: { xs: 28, md: 32 }, fontWeight: 700, lineHeight: 1.2, mb: 1 }}
          >
            Enquiry Form
          </Typography>
          <Typography sx={{ color: ds.color.textSecondary, fontSize: 16, lineHeight: 1.6, mb: { xs: 3, md: 4 } }}>
            Share your travel details and we&apos;ll get back to you shortly.
          </Typography>

          <Box component="form" noValidate onSubmit={(event) => void handleSubmit(event)}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 2.5, md: 3 } }}>
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={values.fullName}
                onChange={(value) => setField('fullName', value)}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
                startAdornment={<UserRound size={18} aria-hidden="true" />}
                required
                fullWidth
                size="md"
                sx={fieldSx}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={values.email}
                onChange={(value) => setField('email', value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
                startAdornment={<Mail size={18} aria-hidden="true" />}
                required
                fullWidth
                size="md"
                sx={fieldSx}
              />
              <Input
                label="Contact No."
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={values.phone}
                onChange={(value) => setField('phone', value)}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                startAdornment={
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: ds.color.navy, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <CountryFlagVisual flag="🇮🇳" countryCode={phoneCountry.code} size={22} />
                    <span>{phoneCountry.dialCode}</span>
                    <Phone size={16} aria-hidden="true" />
                  </Box>
                }
                required
                fullWidth
                size="md"
                sx={fieldSx}
              />
              <Input
                label="Company Name (Optional)"
                name="company"
                placeholder="Enter your company name"
                value={values.company}
                onChange={(value) => setField('company', value)}
                startAdornment={<Building2 size={18} aria-hidden="true" />}
                fullWidth
                size="md"
                sx={fieldSx}
              />
              <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                <Input
                  label="Subject"
                  name="subject"
                  placeholder="e.g. Tour Package, Visa Assistance, Group Travel"
                  value={values.subject}
                  onChange={(value) => setField('subject', value)}
                  error={Boolean(errors.subject)}
                  helperText={errors.subject}
                  startAdornment={<Tag size={18} aria-hidden="true" />}
                  required
                  fullWidth
                  size="md"
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                <Textarea
                  label="Write Your Message"
                  placeholder="Tell us about your travel plans, dates, number of travellers, preferences or any special requests..."
                  value={values.message}
                  onChange={(value) => setField('message', value)}
                  error={Boolean(errors.message)}
                  helperText={errors.message}
                  rows={5}
                  required
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: `${ds.radius.medium}px`, bgcolor: ds.color.surface } }}
                />
              </Box>
            </Box>

            {submitError ? <Alert severity="error" role="alert" sx={{ mt: 3 }}>{submitError}</Alert> : null}
            {success ? <Alert severity="success" role="status" sx={{ mt: 3 }}>Your enquiry has been received. Our team will get back to you shortly.</Alert> : null}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="lg"
              loading={submitting}
              endIcon={<ArrowRight size={18} aria-hidden="true" />}
              sx={{
                ...websiteButtonSx,
                mt: 3.5,
                minHeight: 52,
                px: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                fontSize: 14,
                '&.MuiButton-containedPrimary': { bgcolor: ds.color.brand, color: ds.color.navy },
                '&.MuiButton-containedPrimary:hover': { bgcolor: ds.color.brandHover, color: ds.color.white },
              }}
            >
              Submit Enquiry
            </Button>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
