import type { ExtractedField, UploadQueueRow } from '../data/applicationFlowData'
import {
  BASIC_DETAIL_REQUIRED_KEYS,
  emptyApplicantBasicDetails,
  type ApplicantBasicDetails,
} from '../config/applicantBasicDetailsConfig'
const PLACEHOLDER = '—'

function isEmptyValue(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.length === 0 || trimmed === PLACEHOLDER
}

function fieldValue(fields: ExtractedField[] | undefined, key: string): string {
  return fields?.find(f => f.key === key)?.value?.trim() ?? ''
}

function nameFromPassportFields(fields: ExtractedField[]): string {
  const given = fieldValue(fields, 'given')
  const surname = fieldValue(fields, 'surname')
  return `${given} ${surname}`.trim()
}

function passportFieldsFromRow(row: UploadQueueRow): ExtractedField[] {
  const passportDoc = row.documents?.find(d => d.documentId === 'passport')
  if (passportDoc?.fields?.length) return passportDoc.fields
  return row.fields ?? []
}

export function resolveApplicantBasicDetails(row: UploadQueueRow): ApplicantBasicDetails {
  const stored = row.basicDetails ?? emptyApplicantBasicDetails()
  return {
    ...emptyApplicantBasicDetails(),
    ...stored,
    crewId: stored.crewId || row.gltsApplicantId || '',
    applicantName: stored.applicantName || (row.travelerName === PLACEHOLDER ? '' : row.travelerName),
    passportNumber: stored.passportNumber || (row.passportNo === PLACEHOLDER ? '' : row.passportNo),
    nationality: stored.nationality || (row.nationality === PLACEHOLDER ? '' : row.nationality),
  }
}

export function syncBasicDetailsFromPassport(
  row: UploadQueueRow,
  options: { fillEmptyOnly?: boolean } = { fillEmptyOnly: true },
): ApplicantBasicDetails {
  const current = resolveApplicantBasicDetails(row)
  const fields = passportFieldsFromRow(row)
  if (fields.length === 0) return current

  const fillEmptyOnly = options.fillEmptyOnly !== false
  const pick = (currentVal: string, nextVal: string) => {
    if (!nextVal || nextVal === PLACEHOLDER) return currentVal
    if (fillEmptyOnly && !isEmptyValue(currentVal)) return currentVal
    return nextVal
  }

  const fromName = nameFromPassportFields(fields)
  const fromDocNo = fieldValue(fields, 'docNo')
  const fromNationality = fieldValue(fields, 'issuer')
  const fromDob = fieldValue(fields, 'dob')

  return {
    ...current,
    applicantName: pick(current.applicantName, fromName),
    passportNumber: pick(current.passportNumber, fromDocNo),
    nationality: pick(current.nationality, fromNationality),
    dateOfBirth: pick(current.dateOfBirth, fromDob),
  }
}

export function applyBasicDetailsToRow(
  row: UploadQueueRow,
  patch: Partial<ApplicantBasicDetails>,
): UploadQueueRow {
  const nextDetails: ApplicantBasicDetails = {
    ...resolveApplicantBasicDetails(row),
    ...patch,
  }

  const travelerName = nextDetails.applicantName.trim() || PLACEHOLDER
  const passportNo = nextDetails.passportNumber.trim() || PLACEHOLDER
  const nationality = nextDetails.nationality.trim() || PLACEHOLDER

  return {
    ...row,
    basicDetails: nextDetails,
    travelerName,
    passportNo,
    nationality,
  }
}

export function basicDetailsCompletion(details: ApplicantBasicDetails): {
  complete: number
  total: number
} {
  const total = BASIC_DETAIL_REQUIRED_KEYS.length
  const complete = BASIC_DETAIL_REQUIRED_KEYS.filter(key => !isEmptyValue(details[key])).length
  return { complete, total }
}

export function ensureRowBasicDetails(row: UploadQueueRow): UploadQueueRow {
  const withDetails = row.basicDetails
    ? row
    : applyBasicDetailsToRow(row, emptyApplicantBasicDetails())
  return applyBasicDetailsToRow(withDetails, syncBasicDetailsFromPassport(withDetails))
}
