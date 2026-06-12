import { describe, expect, it } from 'vitest'
import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import {
  assessTravelDateFeasibility,
  countWorkingDaysBetween,
  getCalendarHeatmapRiskLevel,
  getCalendarRiskLevel,
  parseProcessingWorkingDays,
} from './travelDateFeasibility'

describe('parseProcessingWorkingDays', () => {
  it('parses plain numeric days', () => {
    expect(parseProcessingWorkingDays('10')).toBe(10)
    expect(parseProcessingWorkingDays('15')).toBe(15)
  })

  it('parses business day text', () => {
    expect(parseProcessingWorkingDays('10 business days')).toBe(10)
  })

  it('uses upper bound for ranges', () => {
    expect(parseProcessingWorkingDays('10–14 business days')).toBe(14)
    expect(parseProcessingWorkingDays('10-14 business days')).toBe(14)
  })

  it('returns null for empty values', () => {
    expect(parseProcessingWorkingDays('')).toBeNull()
    expect(parseProcessingWorkingDays('TBD')).toBeNull()
  })
})

describe('countWorkingDaysBetween', () => {
  it('counts Mon–Fri between dates', () => {
    const start = new Date(2026, 5, 15)
    const end = new Date(2026, 5, 22)
    expect(countWorkingDaysBetween(start, end)).toBe(5)
  })

  it('skips weekends', () => {
    const start = new Date(2026, 5, 19)
    const end = new Date(2026, 5, 22)
    expect(countWorkingDaysBetween(start, end)).toBe(1)
  })

  it('returns zero when end is not after start', () => {
    const day = new Date(2026, 5, 15)
    expect(countWorkingDaysBetween(day, day)).toBe(0)
  })
})

describe('assessTravelDateFeasibility', () => {
  const applicationDate = new Date(2026, 5, 15)

  it('marks green with On Track headline when buffer is above safe threshold', () => {
    const result = assessTravelDateFeasibility({
      applicationDate,
      travelDateIso: '2026-07-20',
      requiredWorkingDays: 10,
    })
    expect(result.status).toBe('green')
    expect(result.headline).toBe('On Track')
    expect(result.bufferWorkingDays).toBeGreaterThan(10)
    expect(result.summaryLine).toMatch(/10 Days Required/)
    expect(result.showWarning).toBe(false)
  })

  it('marks amber with Timeline Tight headline when buffer is between thresholds', () => {
    const result = assessTravelDateFeasibility({
      applicationDate,
      travelDateIso: '2026-07-01',
      requiredWorkingDays: 5,
    })
    expect(result.status).toBe('amber')
    expect(result.headline).toBe('Timeline Tight')
    expect(result.bufferWorkingDays).toBeGreaterThanOrEqual(5)
    expect(result.bufferWorkingDays).toBeLessThanOrEqual(10)
    expect(result.showWarning).toBe(true)
  })

  it('marks red with Processing Timeline at Risk when buffer is below escalation threshold', () => {
    const result = assessTravelDateFeasibility({
      applicationDate,
      travelDateIso: '2026-06-19',
      requiredWorkingDays: 10,
    })
    expect(result.status).toBe('red')
    expect(result.headline).toBe('Processing Timeline at Risk')
    expect(result.bufferWorkingDays).toBeLessThan(5)
    expect(result.showWarning).toBe(true)
  })

  it('warns when available days are less than required processing time', () => {
    const result = assessTravelDateFeasibility({
      applicationDate: new Date(2026, 5, 15),
      travelDateIso: '2026-06-30',
      requiredWorkingDays: 15,
    })
    expect(result.availableWorkingDays).toBeLessThan(15)
    expect(result.bufferWorkingDays).toBeLessThan(0)
    expect(result.headline).toBe('Processing Timeline at Risk')
    expect(result.summaryLine).toContain('15 Days Required')
    expect(result.showWarning).toBe(true)
  })

  it('respects custom thresholds', () => {
    const customThresholds = { escalationBufferDays: 3, safeBufferDays: 8 }
    const result = assessTravelDateFeasibility({
      applicationDate,
      travelDateIso: '2026-07-06',
      requiredWorkingDays: 10,
      thresholds: customThresholds,
    })
    expect(result.status).toBe('amber')
    expect(result.bufferWorkingDays).toBeGreaterThanOrEqual(3)
    expect(result.bufferWorkingDays).toBeLessThanOrEqual(8)
  })

  it('returns unknown when travel date is missing', () => {
    const result = assessTravelDateFeasibility({
      applicationDate,
      travelDateIso: '',
      requiredWorkingDays: 10,
    })
    expect(result.status).toBe('unknown')
    expect(result.showWarning).toBe(false)
  })
})

describe('getCalendarRiskLevel', () => {
  const applicationDate = new Date(2026, 5, 15)
  const config = {
    requiredWorkingDays: 10,
    thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
  }

  it('returns past for today and earlier dates', () => {
    expect(getCalendarRiskLevel('2026-06-15', config, applicationDate)).toBe('past')
    expect(getCalendarRiskLevel('2026-06-10', config, applicationDate)).toBe('past')
  })

  it('returns safe for dates with ample buffer', () => {
    expect(getCalendarRiskLevel('2026-07-20', config, applicationDate)).toBe('safe')
  })

  it('returns tight for dates within amber band', () => {
    const tightConfig = { requiredWorkingDays: 5, thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS }
    expect(getCalendarRiskLevel('2026-07-01', tightConfig, applicationDate)).toBe('tight')
  })

  it('returns high for dates within red band', () => {
    expect(getCalendarRiskLevel('2026-06-19', config, applicationDate)).toBe('high')
  })

  it('returns unavailable when processing days are not configured', () => {
    expect(
      getCalendarRiskLevel('2026-07-20', { requiredWorkingDays: null, thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS }, applicationDate),
    ).toBe('unavailable')
  })
})

describe('getCalendarHeatmapRiskLevel', () => {
  const applicationDate = new Date(2026, 5, 12)
  const config = {
    requiredWorkingDays: 10,
    thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
  }

  it('returns neutral past tiles for today and earlier dates', () => {
    expect(getCalendarHeatmapRiskLevel('2026-06-12', config, applicationDate)).toBe('past')
    expect(getCalendarHeatmapRiskLevel('2026-06-10', config, applicationDate)).toBe('past')
  })

  it('returns safe, tight, and high bands for future dates', () => {
    expect(getCalendarHeatmapRiskLevel('2026-07-20', config, applicationDate)).toBe('safe')
    expect(getCalendarHeatmapRiskLevel('2026-07-06', config, applicationDate)).toBe('tight')
    expect(getCalendarHeatmapRiskLevel('2026-06-19', config, applicationDate)).toBe('high')
  })

  it('respects custom thresholds from country config', () => {
    const customConfig = {
      requiredWorkingDays: 10,
      thresholds: { escalationBufferDays: 3, safeBufferDays: 8 },
    }
    expect(getCalendarHeatmapRiskLevel('2026-07-06', customConfig, applicationDate)).toBe('tight')
  })
})
