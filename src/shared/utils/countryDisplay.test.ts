import { describe, expect, it } from 'vitest'
import { formatEtaShort } from './countryDisplay'

describe('formatEtaShort', () => {
  it('shortens business-day ranges that use an en dash', () => {
    expect(formatEtaShort('7–14 business days')).toBe('7-14d')
  })

  it('shortens hyphenated day ranges', () => {
    expect(formatEtaShort('10-15 days')).toBe('10-15d')
  })

  it('shortens minute ETAs', () => {
    expect(formatEtaShort('59 min')).toBe('59m')
  })
})
