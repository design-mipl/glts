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
    src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1570168007207-a0e90bb4cde2?auto=format&fit=crop&w=2400&h=900&q=90',
    alt: 'Business professionals collaborating on international corporate travel',
  },
} as const satisfies Record<string, SolutionCtaImageAsset>
