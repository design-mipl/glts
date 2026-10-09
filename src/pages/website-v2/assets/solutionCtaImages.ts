type SolutionCtaImageAsset = {
  src: string
  fallback: string
  alt: string
}

/** Full-width backgrounds for solution page final CTA bands. */
export const solutionCtaBackgroundImages = {
  marine: {
    src: '/images/marine-final-cta.png',
    fallback: '/images/marine-final-cta.png',
    alt: 'Maritime workers in safety gear walking an offshore platform deck at sunset with a ship on the horizon',
  },
  corporate: {
    src: '/images/about-industries/corporate-businesses.png',
    fallback: '/images/about-industries/corporate-businesses.png',
    alt: 'Business professionals collaborating in a premium airport lounge',
  },
} as const satisfies Record<string, SolutionCtaImageAsset>
