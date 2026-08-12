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
    q: 'How do you handle urgent business travel visa requests?',
    a: 'Corporate accounts receive priority review, dedicated escalation paths, and timeline estimates before submission so travel coordinators can plan around meeting dates.',
  },
  {
    q: 'Can we manage employee visas across multiple destinations?',
    a: 'Yes. Corporate portals support multi-country business visa workflows, centralized document storage, and live status for authorized team members.',
  },
  {
    q: 'Do you support group visa applications for corporate delegations?',
    a: 'Yes. We coordinate bulk business travel filings, shared documentation standards, and embassy submissions for teams attending conferences, site visits, and client engagements.',
  },
  {
    q: 'How does compliance documentation work for corporate accounts?',
    a: 'Invitation letters, employment records, and embassy-specific requirements are reviewed before filing. Compliance trails are maintained for audit and internal reporting.',
  },
  {
    q: 'Can our travel management team track all active applications?',
    a: 'Yes. Travel coordinators and stakeholders receive live application status, milestone updates, and visibility across active corporate cases from one workspace.',
  },
  {
    q: 'What account support is available for corporate retainer clients?',
    a: 'Retainer plans may include a dedicated account manager, priority processing, documentation management, monthly reporting, and escalation handling.',
  },
]