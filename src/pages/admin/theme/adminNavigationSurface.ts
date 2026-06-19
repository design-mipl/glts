import { generateScale } from '@/design-system/tokens'
import { publicLightColors as brand } from '@/shared/theme/publicBrand'

const accentScale = generateScale(brand.greenBright)

/** Always-dark admin sidebar — independent of app light/dark toggle. */
export const adminDarkNavigationSurface = {
  background: brand.navy,
  textPrimary: brand.onBrandFilled,
  textSecondary: 'rgba(255, 255, 255, 0.72)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  border: brand.navyLight,
  hover: 'rgba(255, 255, 255, 0.08)',
  activeBg: accentScale[500],
  activeText: brand.onBrandFilled,
} as const
