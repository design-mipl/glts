import type {
  AgreementEntity,
  AgreementPricingSchedule,
  CommercialAgreement,
  CommercialAgreementFormData,
} from '@/shared/types/commercialAgreement'
import type { CommercialVisaPricingRule, QuotationServiceLine } from '@/shared/types/quotation'
import { syncAgreementCommercialPricing } from '@/shared/utils/quotationPricingUtils'

export const DEFAULT_AGREEMENT_PRICING_SCHEDULE_ID = 'aps-default'

export function createPricingScheduleId() {
  return `aps-${Math.random().toString(36).slice(2, 10)}`
}

export function createDefaultPricingSchedule(
  commercialVisaPricing: CommercialVisaPricingRule[] = [],
  miscellaneousServices: QuotationServiceLine[] = [],
): AgreementPricingSchedule {
  return {
    id: DEFAULT_AGREEMENT_PRICING_SCHEDULE_ID,
    name: 'Default pricing',
    appliesTo: 'all',
    entityIds: [],
    commercialVisaPricing: structuredClone(commercialVisaPricing),
    miscellaneousServices: structuredClone(miscellaneousServices),
  }
}

export function createEntityPricingSchedule(input?: {
  name?: string
  entityIds?: string[]
}): AgreementPricingSchedule {
  return {
    id: createPricingScheduleId(),
    name: input?.name?.trim() || 'Entity pricing',
    appliesTo: 'entities',
    entityIds: [...(input?.entityIds ?? [])],
    commercialVisaPricing: [],
    miscellaneousServices: [],
  }
}

export function getDefaultPricingSchedule(
  schedules: AgreementPricingSchedule[] | undefined,
): AgreementPricingSchedule | undefined {
  return schedules?.find((schedule) => schedule.appliesTo === 'all')
}

export function listOverridePricingSchedules(
  schedules: AgreementPricingSchedule[] | undefined,
): AgreementPricingSchedule[] {
  return (schedules ?? []).filter((schedule) => schedule.appliesTo === 'entities')
}

export function countPricingScheduleFees(schedule: AgreementPricingSchedule): number {
  return schedule.commercialVisaPricing.length + schedule.miscellaneousServices.length
}

export function resolvePricingScheduleForEntity(
  schedules: AgreementPricingSchedule[] | undefined,
  entityId?: string,
): AgreementPricingSchedule | undefined {
  const list = schedules ?? []
  if (entityId) {
    const override = list.find(
      (schedule) => schedule.appliesTo === 'entities' && schedule.entityIds.includes(entityId),
    )
    if (override) return override
  }
  return getDefaultPricingSchedule(list) ?? list[0]
}

export function entityIdsMappedToOverrides(
  schedules: AgreementPricingSchedule[] | undefined,
  exceptScheduleId?: string,
): string[] {
  return listOverridePricingSchedules(schedules).flatMap((schedule) =>
    schedule.id === exceptScheduleId ? [] : schedule.entityIds,
  )
}

function cloneSchedule(schedule: AgreementPricingSchedule): AgreementPricingSchedule {
  return {
    ...schedule,
    entityIds: [...schedule.entityIds],
    commercialVisaPricing: structuredClone(schedule.commercialVisaPricing),
    miscellaneousServices: structuredClone(schedule.miscellaneousServices),
  }
}

function pruneScheduleEntityIds(
  schedule: AgreementPricingSchedule,
  validEntityIds: Set<string>,
): AgreementPricingSchedule {
  if (schedule.appliesTo !== 'entities') {
    return { ...cloneSchedule(schedule), entityIds: [] }
  }
  return {
    ...cloneSchedule(schedule),
    entityIds: schedule.entityIds.filter((id) => validEntityIds.has(id)),
  }
}

export function ensureAgreementPricingSchedules(
  schedules: AgreementPricingSchedule[] | undefined,
  fallbackVisa: CommercialVisaPricingRule[] = [],
  fallbackMisc: QuotationServiceLine[] = [],
  entities: AgreementEntity[] = [],
): AgreementPricingSchedule[] {
  const validEntityIds = new Set(entities.map((entity) => entity.id))
  const existing = (schedules ?? []).map((schedule) => pruneScheduleEntityIds(schedule, validEntityIds))
  const defaults = existing.filter((schedule) => schedule.appliesTo === 'all')
  const overrides = existing.filter((schedule) => schedule.appliesTo === 'entities')

  const defaultSchedule = defaults[0]
    ? {
        ...defaults[0],
        id: defaults[0].id || DEFAULT_AGREEMENT_PRICING_SCHEDULE_ID,
        name: defaults[0].name.trim() || 'Default pricing',
        appliesTo: 'all' as const,
        entityIds: [],
        commercialVisaPricing:
          defaults[0].commercialVisaPricing.length > 0
            ? defaults[0].commercialVisaPricing
            : structuredClone(fallbackVisa),
        miscellaneousServices:
          defaults[0].miscellaneousServices.length > 0
            ? defaults[0].miscellaneousServices
            : structuredClone(fallbackMisc),
      }
    : createDefaultPricingSchedule(fallbackVisa, fallbackMisc)

  return [defaultSchedule, ...overrides]
}

export function flattenDefaultPricingSchedule(schedules: AgreementPricingSchedule[]): {
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
} {
  const def = getDefaultPricingSchedule(schedules)
  return {
    commercialVisaPricing: structuredClone(def?.commercialVisaPricing ?? []),
    miscellaneousServices: structuredClone(def?.miscellaneousServices ?? []),
  }
}

type AgreementPricingSyncInput = {
  workflowType: CommercialAgreementFormData['workflowType']
  entities: AgreementEntity[]
  pricingMatrix: CommercialAgreementFormData['pricingMatrix']
  miscellaneousCosts: CommercialAgreementFormData['miscellaneousCosts']
  commercialVisaPricing?: CommercialVisaPricingRule[]
  miscellaneousServices?: QuotationServiceLine[]
  pricingSchedules?: AgreementPricingSchedule[]
}

export function syncAgreementPricingSchedules<T extends AgreementPricingSyncInput>(
  data: T,
): T & {
  pricingSchedules: AgreementPricingSchedule[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
} {
  const hydrated = syncAgreementCommercialPricing(data)
  const pricingSchedules = ensureAgreementPricingSchedules(
    data.pricingSchedules,
    hydrated.commercialVisaPricing,
    hydrated.miscellaneousServices,
    data.entities,
  )
  const flattened = flattenDefaultPricingSchedule(pricingSchedules)
  const withDefault = {
    ...hydrated,
    commercialVisaPricing: flattened.commercialVisaPricing,
    miscellaneousServices: flattened.miscellaneousServices,
  }
  const synced = syncAgreementCommercialPricing(withDefault)
  return {
    ...data,
    ...synced,
    pricingSchedules,
    commercialVisaPricing: synced.commercialVisaPricing,
    miscellaneousServices: synced.miscellaneousServices,
  }
}

export function replacePricingSchedule(
  schedules: AgreementPricingSchedule[],
  scheduleId: string,
  patch: Partial<AgreementPricingSchedule>,
): AgreementPricingSchedule[] {
  return schedules.map((schedule) =>
    schedule.id === scheduleId
      ? {
          ...schedule,
          ...patch,
          entityIds: patch.entityIds ? [...patch.entityIds] : schedule.entityIds,
        }
      : schedule,
  )
}

export function removePricingSchedule(
  schedules: AgreementPricingSchedule[],
  scheduleId: string,
): AgreementPricingSchedule[] {
  return schedules.filter((schedule) => schedule.id !== scheduleId || schedule.appliesTo === 'all')
}

export function stripEntityFromPricingSchedules(
  schedules: AgreementPricingSchedule[] | undefined,
  entityId: string,
): AgreementPricingSchedule[] {
  return (schedules ?? []).map((schedule) => ({
    ...schedule,
    entityIds: schedule.entityIds.filter((id) => id !== entityId),
  }))
}

export function scheduleDisplayEntities(
  schedule: AgreementPricingSchedule,
  entities: AgreementEntity[],
): AgreementEntity[] {
  return schedule.entityIds
    .map((id) => entities.find((entity) => entity.id === id))
    .filter((entity): entity is AgreementEntity => Boolean(entity))
}

export function resolveAgreementRulesForEntity(
  agreement: Pick<CommercialAgreement, 'pricingSchedules' | 'commercialVisaPricing'>,
  entityId?: string,
): CommercialVisaPricingRule[] {
  const schedule = resolvePricingScheduleForEntity(agreement.pricingSchedules, entityId)
  if (schedule) return schedule.commercialVisaPricing
  return agreement.commercialVisaPricing ?? []
}

export function resolveAgreementMiscForEntity(
  agreement: Pick<CommercialAgreement, 'pricingSchedules' | 'miscellaneousServices'>,
  entityId?: string,
): QuotationServiceLine[] {
  const schedule = resolvePricingScheduleForEntity(agreement.pricingSchedules, entityId)
  if (schedule) return schedule.miscellaneousServices
  return agreement.miscellaneousServices ?? []
}
