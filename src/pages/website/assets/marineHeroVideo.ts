/**
 * Marine hero background video.
 *
 * Add your 8–12s seamless 16:9 loop as `public/videos/marine-hero-loop.mp4`
 * (recommended: 1920×1080 or 3840×2160, H.264, muted, web-optimized).
 * Until that file exists, the hero falls back to the poster image.
 */
export const marineHeroBackgroundVideo = {
  /** Served from /public — replace with your premium maritime loop. */
  src: '/videos/marine-hero-loop.mp4',
  poster: {
    /** https://unsplash.com/photos/red-and-blue-cargo-ship-on-body-of-water-during-daytime-NndKt2kF1L4 */
    src: 'https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?auto=format&fit=crop&w=2400&h=1350&q=90',
    fallback:
      'https://images.unsplash.com/photo-1583342426869-91ba1e67e142?auto=format&fit=crop&w=2400&h=1350&q=90',
    alt: 'Red and blue cargo ship on body of water during daytime',
  },
} as const
