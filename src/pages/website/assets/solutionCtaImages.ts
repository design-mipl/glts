type SolutionCtaImageAsset = {
  src: string
  fallback: string
  alt: string
}

/** Full-width backgrounds for solution page final CTA bands. */
export const solutionCtaBackgroundImages = {
  marine: {
    src: 'https://images.unsplash.com/photo-1494412574640-08084c076e68?auto=format&fit=crop&w=2400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&h=900&q=90',
    alt: 'Container ship at port with global maritime shipping routes',
  },
  corporate: {
    src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1570168007207-a0e90bb4cde2?auto=format&fit=crop&w=2400&h=900&q=90',
    alt: 'Business professionals collaborating on international corporate travel',
  },
} as const satisfies Record<string, SolutionCtaImageAsset>
