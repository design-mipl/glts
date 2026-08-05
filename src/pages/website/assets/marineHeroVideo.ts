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
    src: '/images/marine-crew-visa-hero.png',
    fallback: '/images/marine-crew-visa-hero.png',
    alt: 'Container ship Seasprinter at golden hour on open water',
  },
} as const
