/** Imagery shown only when a retail service card is expanded. */
export const retailServiceImages = {
  touristFamily: {
    src: '/images/visa-services/tourist.png',
    fallback: '/images/visa-services/tourist.png',
    alt: 'Travelers enjoying a holiday destination',
    objectPosition: 'center',
  },
  business: {
    src: '/images/visa-services/business.png',
    fallback: '/images/visa-services/business.png',
    alt: 'Business travelers in a professional meeting',
    // Full-body portrait — bias crop upward so the face stays visible in the short featured panel
    objectPosition: 'center 12%',
  },
  student: {
    src: '/images/additional-services/student-visa-guidance.png',
    fallback: '/images/additional-services/student-visa-guidance.png',
    alt: 'Students preparing for overseas education',
    objectPosition: 'center',
  },
  transit: {
    src: '/images/visa-services/transit.png',
    fallback: '/images/visa-services/transit.png',
    alt: 'Traveler moving through an airport terminal during transit',
    objectPosition: 'center',
  },
  refusal: {
    src: '/images/retail-advantage/fewer-last-minute-surprises.png',
    fallback: '/images/retail-advantage/fewer-last-minute-surprises.png',
    alt: 'Specialist reviewing application documents with a client',
    objectPosition: 'center 45%',
  },
} as const
