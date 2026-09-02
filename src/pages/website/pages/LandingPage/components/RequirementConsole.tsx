import { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowRight, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui'
import { ink, paper, paperFont, paperRadius, paperShadow } from '../../../theme/sitePaper'
import { getAllCountries } from '@/shared/services/visaService'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'

const VISA_TYPES = [
  { value: 'tourist', label: 'Tourist visa' },
  { value: 'business', label: 'Business visa' },
  { value: 'student', label: 'Student visa' },
  { value: 'transit', label: 'Transit visa' },
  { value: 'family', label: 'Family application' },
  { value: 'group', label: 'Group application' },
  { value: 'other', label: 'Other visa' },
] as const

const POPULAR_DESTINATION_CODES = ['AE', 'US', 'GB', 'SG', 'CA', 'AU', 'DE', 'FR', 'JP', 'TH'] as const

/** Radix uses the empty string internally, so "no filter" needs a real sentinel value. */
const ANY = '__any__'

/**
 * The requirement checker — the hero's signature element and the site's front door.
 *
 * It is the only thing in the hero that *does* something, so it gets the only lift
 * (`paperShadow.lift`) and the only saturated fill on the screen. Everything else in the
 * hero is flat on paper.
 *
 * Two fields divided by a rule rather than two separately-boxed inputs: boxed fields read
 * as a form to be filled in, and this is a question to be answered. The labels are always
 * visible — never placeholders doing double duty, which vanish exactly when a user needs
 * to check what they typed.
 */
export function RequirementConsole() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState(ANY)
  const [visaType, setVisaType] = useState(ANY)

  const destinations = useMemo(() => {
    const all = getAllCountries()
    const popular = POPULAR_DESTINATION_CODES.map((code) =>
      all.find((country) => country.code === code),
    ).filter(Boolean) as ReturnType<typeof getAllCountries>
    return popular.length > 0 ? popular : all.slice(0, 10)
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const hasDestination = destination !== ANY
    const hasVisaType = visaType !== ANY

    if (hasDestination) {
      const query = hasVisaType ? `?visaType=${encodeURIComponent(visaType)}` : ''
      navigate(`/countries/${destination}${query}`)
      return
    }

    navigate(hasVisaType ? `/countries?visaType=${encodeURIComponent(visaType)}` : '/countries')
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 600,
        display: 'flex',
        // `lg` is 600px in this project's remapped scale — the first width where two
        // fields and a button genuinely fit on one line. `sm` here would be 375px.
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: 'stretch',
        backgroundColor: paper.white,
        border: `1px solid ${paper.hairline}`,
        borderRadius: paperRadius.panel,
        boxShadow: paperShadow.lift,
      }}
    >
      <Field label="Where are you going?">
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger aria-label="Destination">
            <SelectValue placeholder="Choose a destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>
              <Row>
                <Globe size={18} strokeWidth={1.8} color={ink.faint} aria-hidden />
                All destinations
              </Row>
            </SelectItem>
            {destinations.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                <Row>
                  <CountryFlagVisual flag={country.flags} countryCode={country.code} size={18} />
                  {country.name}
                </Row>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Box
        aria-hidden
        sx={{
          alignSelf: 'stretch',
          flexShrink: 0,
          backgroundColor: paper.hairline,
          width: { xs: 'auto', lg: '1px' },
          height: { xs: '1px', lg: 'auto' },
          mx: { xs: 3, lg: 0 },
        }}
      />

      <Field label="What kind of visa?">
        <Select value={visaType} onValueChange={setVisaType}>
          <SelectTrigger aria-label="Visa type">
            <SelectValue placeholder="Any purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any purpose</SelectItem>
            {VISA_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Box sx={{ flex: '0 0 auto', p: { xs: 2.5, lg: 1.25 }, pt: { xs: 0, lg: 1.25 } }}>
        <Button
          type="submit"
          size="lg"
          sx={{ width: { xs: '100%', lg: 'auto' } }}
          // The arrow nudges toward the destination on hover — motion as a response to
          // input, which is the only kind this page uses.
          className="gl-console-submit"
        >
          Check requirements
          <Box
            component="span"
            aria-hidden
            sx={{
              display: 'inline-flex',
              transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
              '.gl-console-submit:hover &': { transform: 'translateX(3px)' },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            <ArrowRight size={17} />
          </Box>
        </Button>
      </Box>
    </Box>
  )
}

/**
 * Flag-and-label row for a select option.
 *
 * Radix clones the chosen item's `ItemText` into the trigger, so putting the flag inside
 * the row means the selected destination shows its flag in the closed field too — the
 * picker and the field stay the same object rather than the flag appearing only in the
 * open list.
 *
 * The flag is decorative: the country's name is right beside it, so announcing the image
 * as well would just repeat the label. `CountryFlagVisual` renders it with `alt=""`.
 */
function Row({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}
    >
      {children}
    </Box>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, px: 3, py: { xs: 2.25, lg: 2.5 } }}>
      <Typography
        component="span"
        sx={{
          display: 'block',
          mb: 1,
          fontFamily: paperFont.body,
          fontSize: 12.5,
          fontWeight: 600,
          lineHeight: 1.3,
          color: ink.faint,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )
}
