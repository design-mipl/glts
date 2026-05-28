import type { NavigateFunction } from 'react-router-dom'

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

/** Resume the in-progress create flow from session storage. */
export function navigateToResumeApplication(navigate: NavigateFunction, base: string): void {
  navigate(createApplicationPath(base), { state: CREATE_APPLICATION_RESUME_STATE })
}
