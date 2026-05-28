import type { Country } from '../types/visa'

/** Short ETA label for cards, e.g. "3d", "59m" */
export function formatEtaShort(processingTime: string): string {
  const minMatch = processingTime.match(/(\d+)\s*min/i)
  if (minMatch) return `${minMatch[1]}m`
  const dayMatch = processingTime.match(/(\d+)(?:\s*-\s*(\d+))?\s*days?/i)
  if (dayMatch) {
    const end = dayMatch[2] ?? dayMatch[1]
    return dayMatch[2] ? `${dayMatch[1]}-${end}d` : `${end}d`
  }
  const singleDay = processingTime.match(/(\d+)\s*day/i)
  if (singleDay) return `${singleDay[1]}d`
  return processingTime.replace(/\s*days?/i, 'd').replace(/\s*min/i, 'm')
}

export function isFastVisa(country: Country): boolean {
  if (country.fastMinutes != null && country.fastMinutes <= 1440) return true
  return /\d+\s*min/i.test(country.processingTime)
}
