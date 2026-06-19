import type { TravelDateRiskThresholds } from '@/shared/types/countryMaster'

export const DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS: TravelDateRiskThresholds = {
  escalationBufferDays: 5,
  safeBufferDays: 10,
}
