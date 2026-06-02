import type { CountryMasterFormData } from '@/shared/types/countryMaster'
import { ALL_SEGMENTS, emptySegment, ensureAllSegments, normalizeCountrySegments } from '@/shared/data/countryMasterDefaults'

export interface CountryFormValidationResult {
  valid: boolean
  errors: string[]
  stepErrors: Record<number, string[]>
}

const EMPTY_STEP_ERRORS: Record<number, string[]> = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
}

/** Validation disabled for now — all steps may proceed without required fields. */
export function validateCountryForm(
  _data: CountryMasterFormData,
  _excludeId?: string,
): CountryFormValidationResult {
  return { valid: true, errors: [], stepErrors: { ...EMPTY_STEP_ERRORS } }
}

export function validateCountryStep(
  _step: number,
  _data: CountryMasterFormData,
  _excludeId?: string,
): string[] {
  return []
}

export function createEmptyCountryFormData(): CountryMasterFormData {
  return {
    code: '',
    name: '',
    flag: '',
    region: '',
    status: 'draft',
    processingType: 'embassy',
    embassyNotes: '',
    internalNotes: '',
    cities: '',
    heroPhotoId: '',
    processingTime: '',
    price: 0,
    rating: 0,
    trending: false,
    trendingPercent: 0,
    visaCategory: 'Tourist',
    validity: '',
    fastMinutes: undefined,
    segments: ALL_SEGMENTS.map((segment) => emptySegment(segment, segment === 'retail')),
  }
}

export function countryMasterToFormData(
  master: import('@/shared/types/countryMaster').CountryMaster,
): CountryMasterFormData {
  return {
    code: master.code,
    name: master.name,
    flag: master.flag,
    region: master.region,
    status: master.status,
    processingType: master.processingType,
    embassyNotes: master.embassyNotes ?? '',
    internalNotes: master.internalNotes ?? '',
    cities: master.cities,
    heroPhotoId: master.heroPhotoId,
    processingTime: master.processingTime,
    price: master.price,
    rating: master.rating,
    trending: master.trending,
    trendingPercent: master.trendingPercent,
    visaCategory: master.visaCategory,
    validity: master.validity,
    fastMinutes: master.fastMinutes,
    segments: ensureAllSegments(normalizeCountrySegments(structuredClone(master.segments))),
  }
}
