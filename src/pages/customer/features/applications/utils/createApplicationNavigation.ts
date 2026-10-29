import type { NavigateFunction } from 'react-router-dom'
import type { SingleApplicationRow } from '../data/applicationFlowData'

export type CreateApplicationLocationState = {
  freshStart?: boolean
  resumeDraft?: boolean
}

export const CREATE_APPLICATION_FRESH_START_STATE: CreateApplicationLocationState = {
  freshStart: true,
}

export const CREATE_APPLICATION_RESUME_STATE: CreateApplicationLocationState = {
  resumeDraft: true,
}

export function createApplicationPath(base: string): string {
  return `${base}/applications/new`
}

/** Start a brand-new application (clears in-progress session state). */
export function navigateToCreateApplication(navigate: NavigateFunction, base: string): void {
  navigate(createApplicationPath(base), { state: CREATE_APPLICATION_FRESH_START_STATE })
}

/** Resume the in-progress create flow from session storage (portal B2B create). */
export function navigateToResumeApplication(navigate: NavigateFunction, base: string): void {
  navigate(createApplicationPath(base), { state: CREATE_APPLICATION_RESUME_STATE })
}

/**
 * Resume a website retail draft at the saved step (`retailApply.lastStepId`).
 * Lands on `/apply/new` with country, visa, and application query params.
 */
export function buildRetailApplyContinueHref(row: Pick<SingleApplicationRow, 'id' | 'retailApply'>): string | null {
  const apply = row.retailApply
  if (!apply?.countryId) return null
  const params = new URLSearchParams()
  params.set('country', apply.countryId)
  if (apply.visaOfferingId) params.set('visa', apply.visaOfferingId)
  params.set('application', row.id)
  return `/apply/new?${params.toString()}`
}

export function navigateToContinueRetailApplication(
  navigate: NavigateFunction,
  row: Pick<SingleApplicationRow, 'id' | 'retailApply' | 'operationalStatus'>,
  fallbackBase: string,
): void {
  if (row.operationalStatus === 'Draft' && row.retailApply?.countryId) {
    const href = buildRetailApplyContinueHref(row)
    if (href) {
      navigate(href)
      return
    }
  }
  navigateToResumeApplication(navigate, fallbackBase)
}
