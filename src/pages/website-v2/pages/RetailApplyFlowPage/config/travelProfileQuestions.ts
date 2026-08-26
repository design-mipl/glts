/** Travel-profile questionnaire options for retail apply Build profile. */

export const PROFILE_ANSWER_KEYS = {
  profession: 'profession',
  maritalStatus: 'maritalStatus',
  visaRefusal: 'visaRefusal',
} as const

export type ProfileAnswerKey = (typeof PROFILE_ANSWER_KEYS)[keyof typeof PROFILE_ANSWER_KEYS]

export interface TravelProfileOption {
  id: string
  label: string
}

export const PROFESSION_OPTIONS: TravelProfileOption[] = [
  { id: 'salaried', label: 'Salaried Employee' },
  { id: 'part_time', label: 'Part-Time Employee' },
  { id: 'govt_psu', label: 'Govt. / PSU Employee' },
  { id: 'defence', label: 'Defence Personnel' },
  { id: 'self_employed', label: 'Self Employed' },
  { id: 'business', label: 'Business Owner' },
  { id: 'student', label: 'Student' },
  { id: 'retired', label: 'Retired' },
  { id: 'homemaker', label: 'Homemaker' },
  { id: 'unemployed', label: 'Unemployed' },
]

export const MARITAL_STATUS_OPTIONS: TravelProfileOption[] = [
  { id: 'single', label: 'Single' },
  { id: 'married', label: 'Married' },
  { id: 'divorced', label: 'Divorced' },
  { id: 'widowed', label: 'Widowed' },
]

export const VISA_REFUSAL_OPTIONS: TravelProfileOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
]

export type TravelProfileQuestionId = 'profession' | 'maritalStatus' | 'visaRefusal'

export const TRAVEL_PROFILE_QUESTION_ORDER: TravelProfileQuestionId[] = [
  'profession',
  'maritalStatus',
  'visaRefusal',
]

function labelFor(options: TravelProfileOption[], id?: string): string {
  if (!id) return ''
  return options.find((option) => option.id === id)?.label ?? ''
}

/** Labels for completed-card option tags (profession, marital, refusal). */
export function profileAnswerTags(answers?: Record<string, string>): string[] {
  if (!answers) return []
  const tags: string[] = []
  const profession = labelFor(PROFESSION_OPTIONS, answers[PROFILE_ANSWER_KEYS.profession])
  const marital = labelFor(MARITAL_STATUS_OPTIONS, answers[PROFILE_ANSWER_KEYS.maritalStatus])
  const refusal = labelFor(VISA_REFUSAL_OPTIONS, answers[PROFILE_ANSWER_KEYS.visaRefusal])
  if (profession) tags.push(profession)
  if (marital) tags.push(marital)
  if (refusal) tags.push(refusal)
  return tags
}

export function displayNameUpper(name: string): string {
  return name.trim().toUpperCase()
}

export function initialsFromName(name: string, fallback = 'T'): string {
  const trimmed = name.trim()
  if (!trimmed) return fallback
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return trimmed.slice(0, 2).toUpperCase()
}
