import type { FAQItem } from '../../components/FAQSection'
import type { TestimonialItem } from '../../components/TestimonialSection'
import { testimonialPortraits } from '../../assets/testimonialPortraits'

export const landingTestimonials: TestimonialItem[] = [
  {
    quote:
      'GreenLight made the document checklist clear and reviewed every upload before my visitor visa was submitted.',
    name: 'Priya Sharma',
    service: 'Visitor Visa',
    initials: 'PS',
    avatarBg: 'linear-gradient(135deg, #73C064 0%, #4A8F3F 100%)',
    avatarSrc: testimonialPortraits.priyaSharma,
  },
  {
    quote:
      'The portal helped us track our family application in one place while the team kept checking the details.',
    name: 'Neha Kapoor',
    service: 'Family Application',
    initials: 'NK',
    avatarBg: 'linear-gradient(135deg, #0A2540 0%, #1E4D6B 100%)',
    avatarSrc: testimonialPortraits.hiroshiKondo,
  },
  {
    quote:
      'I had a previous refusal, so the expert review gave me a clearer view of what needed correction before reapplying.',
    name: 'Arjun Mehta',
    service: 'Reapplication Support',
    initials: 'AM',
    avatarBg: 'linear-gradient(135deg, #5A9A4E 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.amaraOkafor,
  },
  {
    quote:
      'The requirements were easy to understand, and I could see what was still pending before my student visa submission.',
    name: 'Riya Nair',
    service: 'Student Visa',
    initials: 'RN',
    avatarBg: 'linear-gradient(135deg, #123B5C 0%, #0A2540 100%)',
    avatarSrc: testimonialPortraits.elenaVasquez,
  },
  {
    quote:
      'From checklist to status updates, the process felt transparent for my business trip application.',
    name: 'Rajesh Mehta',
    service: 'Business Visa',
    initials: 'RM',
    avatarBg: 'linear-gradient(135deg, #4A8F3F 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.rajeshMehta,
  },
  {
    quote:
      'The team explained the appointment process and helped me keep the supporting documents organized.',
    name: 'Sarah & James Chen',
    service: 'Tourist Visa',
    initials: 'SC',
    avatarBg: 'linear-gradient(135deg, #1E4D6B 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.sarahChen,
  },
]

export const landingFaqs: FAQItem[] = [
  {
    q: 'How do I know which documents are required?',
    a: 'Select your destination and visa category to see the available requirements. A GreenLight specialist reviews your uploaded documents before submission.',
  },
  {
    q: 'Can I complete the application online?',
    a: 'You can complete the application and upload documents online. Some destinations may still require appointments, biometrics or offline submission steps.',
  },
  {
    q: 'Does GreenLight review my application before submission?',
    a: 'Yes. Visa specialists review the application and supporting documents to identify missing, unclear or inconsistent information early.',
  },
  {
    q: 'Are the fees final when I browse a destination?',
    a: 'Visible destination prices are indicative or starting values where shown. Embassy fee, GreenLight fee and final total are confirmed after visa type selection.',
  },
  {
    q: 'Can families or groups apply together?',
    a: 'Yes. Family and group applications can be coordinated together while each applicant still receives the document checks required for their profile.',
  },
  {
    q: 'Can approval be guaranteed?',
    a: 'Final visa decisions are made by the relevant embassy or immigration authority. GreenLight supports eligibility checks, document readiness and accurate submission.',
  },
]
