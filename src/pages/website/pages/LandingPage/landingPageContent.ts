import type { FAQItem } from '../../components/FAQSection'
import type { TestimonialItem } from '../../components/TestimonialSection'
import { testimonialPortraits } from '../../assets/testimonialPortraits'

export const landingTestimonials: TestimonialItem[] = [
  {
    quote:
      'GreenLight handled my Canada visitor visa flawlessly. The team guided me through every document and kept me updated throughout the process.',
    name: 'Priya Sharma',
    service: 'Canada Visitor Visa',
    initials: 'PS',
    avatarBg: 'linear-gradient(135deg, #73C064 0%, #4A8F3F 100%)',
    avatarSrc: testimonialPortraits.priyaSharma,
    rating: 4.5,
  },
  {
    quote:
      'We rotated 312 crew across 14 ports last quarter without a single missed sailing. Their marine travel desk is an extension of our operations team.',
    name: 'Hiroshi Kondo',
    service: 'Marine Crew Travel Services',
    initials: 'HK',
    avatarBg: 'linear-gradient(135deg, #0A2540 0%, #1E4D6B 100%)',
    avatarSrc: testimonialPortraits.hiroshiKondo,
    rating: 4.5,
  },
  {
    quote:
      'After a refusal, their specialists rebuilt my case file and coached me through the reapplication. Schengen approved on the second attempt.',
    name: 'Amara Okafor',
    service: 'Visa Refusal Support',
    initials: 'AO',
    avatarBg: 'linear-gradient(135deg, #5A9A4E 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.amaraOkafor,
    rating: 4.5,
  },
  {
    quote:
      'Our university placed 48 exchange students across Europe. GreenLight handled bulk documentation and embassy coordination flawlessly.',
    name: 'Dr. Elena Vasquez',
    service: 'Student Visa Program',
    initials: 'EV',
    avatarBg: 'linear-gradient(135deg, #123B5C 0%, #0A2540 100%)',
    avatarSrc: testimonialPortraits.elenaVasquez,
    rating: 4.5,
  },
  {
    quote:
      'From document checklist to courier tracking, everything was transparent. Business visa to Singapore processed ahead of my conference deadline.',
    name: 'Rajesh Mehta',
    service: 'Singapore Business Visa',
    initials: 'RM',
    avatarBg: 'linear-gradient(135deg, #4A8F3F 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.rajeshMehta,
    rating: 4.5,
  },
  {
    quote:
      'Family of four, four different visa types, one coordinator. They made a complex Japan trip feel effortless from start to finish.',
    name: 'Sarah & James Chen',
    service: 'Family Travel Package',
    initials: 'SC',
    avatarBg: 'linear-gradient(135deg, #1E4D6B 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.sarahChen,
    rating: 4.5,
  },
]

export const landingFaqs: FAQItem[] = [
  {
    q: 'How fast is fast?',
    a: 'Median eVisa: 3.4 days. Embassy stamps: 12–18 days. We show you the exact ETA before you pay.',
  },
  {
    q: 'What if my application is rejected?',
    a: 'We refund the service fee and re-file at no extra cost. Our team reviews before submission to reduce this risk.',
  },
  {
    q: 'Do you store my passport?',
    a: 'No. Encrypted at rest, purged 30 days after approval. We comply with GDPR and ISO 27001.',
  },
  {
    q: 'Marine crew without a fixed address?',
    a: 'We accept seaman book + employer letter in lieu of utility bills and rental agreements.',
  },
  {
    q: 'Can I manage multiple travelers at once?',
    a: 'Yes. Corporate and marine accounts support bulk CSV uploads, team dashboards, and parallel filing.',
  },
  {
    q: 'Do you support all nationalities?',
    a: 'We support 192 destination countries and most major nationalities. Check your eligibility on the country page.',
  },
]