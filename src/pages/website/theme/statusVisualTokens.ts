/**
 * Shared visual language for the "live status" surfaces — LiveStatusPanel, StatusStepper,
 * and the redesigned upload trio (FileUploadModal, BulkUploadDropzone, TravellerUploadStatusRow).
 *
 * Discipline: green is the one confident accent for actions/highlights; gold is reserved for
 * a single emphasis number per surface (headline stat, confidence %). Corners run tighter than
 * the general retail-flow tokens — precise, not soft.
 */

/** Tightened corner radii — deliberately smaller than `retailFlowLayout` for this surface family. */
export const statusVisualRadius = {
  /** LiveStatusPanel outer card. */
  hero: '16px',
  /** Dropzones, modals, list rows. */
  card: '8px',
  /** Inner controls — chips, thumbnails, buttons. */
  control: '6px',
  /** Fully round (avatars, step circles, rings). */
  full: '50%',
} as const

/** Elevated white/light card shadow — shared with retail apply-flow cards. */
export const statusElevatedCardShadow =
  '0 1px 2px rgba(15,27,43,0.04), 0 8px 24px -4px rgba(15,27,43,0.10)' as const

export function getElevatedStatusCardSx(borderColor = 'rgba(15, 23, 42, 0.06)') {
  return {
    border: `1px solid ${borderColor}`,
    boxShadow: statusElevatedCardShadow,
  } as const
}

/** Blurred, restrained single-color ambient bloom — sits behind a headline number, never a flat fill. */
export function getAmbientGlowSx(rgb: string, sizePx = 220, opacity = 0.32) {
  return {
    content: '""',
    position: 'absolute' as const,
    inset: 0,
    margin: 'auto',
    width: sizePx,
    height: sizePx,
    borderRadius: '50%',
    background: `rgba(${rgb}, ${opacity})`,
    filter: `blur(${Math.round(sizePx * 0.32)}px)`,
    pointerEvents: 'none' as const,
    zIndex: 0,
  }
}

/** Ring-border emphasis for an active/selected state — replaces filled tint backgrounds. */
export function getRingBorderSx(colorHex: string, active: boolean, restingBorder: string) {
  return {
    border: `1.5px solid ${active ? colorHex : restingBorder}`,
    boxShadow: active ? `0 0 0 3px ${colorHex}26` : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  }
}

/** Conic-gradient ring for a percentage value — gold arc, used for the one emphasis number on a row. */
export function getConicRingBackground(goldHex: string, trackRgba: string, percent: number) {
  const clamped = Math.min(100, Math.max(0, percent))
  return `conic-gradient(${goldHex} ${clamped}%, ${trackRgba} ${clamped}% 100%)`
}
