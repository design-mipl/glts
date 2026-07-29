/** Passport physical movement stages for PassportJourney. */
export const PASSPORT_JOURNEY_STAGE_IDS = [
  'glts',
  'courier-outbound',
  'embassy',
  'courier-inbound',
  'client',
] as const

export type PassportJourneyStageId = (typeof PASSPORT_JOURNEY_STAGE_IDS)[number]

export const PASSPORT_JOURNEY_STAGE_LABELS: Record<PassportJourneyStageId, string> = {
  glts: 'GLTS',
  'courier-outbound': 'Courier',
  embassy: 'Embassy',
  'courier-inbound': 'Courier',
  client: 'Client',
}
