import type {
  ApplicationActivityEvent,
  ApplicationActivityModule,
  ApplicationLogisticsUpdate,
  ApplicationLogisticsUpdateInput,
} from '@/shared/types/applicationCaseActivity'

const ACTOR = 'Ops User'

function nowIso(): string {
  return new Date().toISOString()
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const activityByApplication = new Map<string, ApplicationActivityEvent[]>()
const logisticsByApplication = new Map<string, ApplicationLogisticsUpdate[]>()

function seedIfNeeded(applicationId: string) {
  if (activityByApplication.has(applicationId)) return

  const seededActivity: ApplicationActivityEvent[] = [
    {
      id: createId('act'),
      applicationId,
      occurredAt: '2026-03-01T09:15:00.000Z',
      actor: 'Customer portal',
      action: 'Application submitted',
      detail: 'Customer submitted the application for processing.',
      module: 'application',
    },
    {
      id: createId('act'),
      applicationId,
      occurredAt: '2026-03-01T10:05:00.000Z',
      actor: 'Arun Krishnan',
      action: 'Consultant assigned',
      detail: 'Assigned to Arun Krishnan · Marine Team · High priority.',
      module: 'assignment',
    },
    {
      id: createId('act'),
      applicationId,
      occurredAt: '2026-03-02T11:40:00.000Z',
      actor: 'Sneha Patel',
      action: 'Documents verification started',
      detail: 'Ops opened document verification workspace.',
      module: 'documents',
    },
  ]

  if (applicationId.includes('884') || applicationId.includes('829') || applicationId.includes('818')) {
    seededActivity.push({
      id: createId('act'),
      applicationId,
      occurredAt: '2026-03-03T08:20:00.000Z',
      actor: 'Priya Sharma',
      action: 'VIP tagged',
      detail: 'Application marked as Green Star VIP.',
      module: 'assignment',
    })
    seededActivity.push({
      id: createId('act'),
      applicationId,
      occurredAt: '2026-03-04T14:10:00.000Z',
      actor: 'Meera Shah',
      action: 'Logistics update synced from Ground Ops',
      detail: 'Courier · Blue Dart · AWB BD8841201 · In transit.',
      module: 'logistics',
    })
  }

  activityByApplication.set(
    applicationId,
    seededActivity.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
  )

  if (applicationId.includes('884') || applicationId.includes('829') || applicationId.includes('818')) {
    logisticsByApplication.set(applicationId, [
      {
        id: createId('log'),
        applicationId,
        sequence: 1,
        createdAt: '2026-03-04T14:10:00.000Z',
        createdBy: 'Meera Shah',
        source: 'ground_operations',
        status: 'In transit',
        deliveryMethod: 'Courier',
        courierPartner: 'Blue Dart',
        awbNumber: 'BD8841201',
        trackingUrl: 'https://www.bluedart.com/tracking',
        dispatchDateTime: '2026-03-04T13:30',
        remarks: 'Passport packet handed to courier for vessel agent delivery.',
      },
    ])
  } else {
    logisticsByApplication.set(applicationId, [])
  }
}

function logisticsDetailBits(input: ApplicationLogisticsUpdateInput): string {
  return [
    input.deliveryMethod || undefined,
    input.courierPartner || undefined,
    input.awbNumber ? `AWB ${input.awbNumber}` : undefined,
    input.status,
  ]
    .filter(Boolean)
    .join(' · ')
}

export const applicationCaseActivityService = {
  listActivity(applicationId: string): ApplicationActivityEvent[] {
    if (!applicationId.trim()) return []
    seedIfNeeded(applicationId)
    return [...(activityByApplication.get(applicationId) ?? [])]
  },

  addActivity(
    applicationId: string,
    input: {
      action: string
      detail: string
      module: ApplicationActivityModule
      actor?: string
      travelerName?: string
      occurredAt?: string
    },
  ): ApplicationActivityEvent {
    seedIfNeeded(applicationId)
    const event: ApplicationActivityEvent = {
      id: createId('act'),
      applicationId,
      occurredAt: input.occurredAt ?? nowIso(),
      actor: input.actor ?? ACTOR,
      action: input.action,
      detail: input.detail,
      module: input.module,
      travelerName: input.travelerName,
    }
    const next = [event, ...(activityByApplication.get(applicationId) ?? [])]
    activityByApplication.set(applicationId, next)
    return event
  },

  listLogisticsUpdates(applicationId: string): ApplicationLogisticsUpdate[] {
    if (!applicationId.trim()) return []
    seedIfNeeded(applicationId)
    return [...(logisticsByApplication.get(applicationId) ?? [])].sort(
      (a, b) => b.sequence - a.sequence,
    )
  },

  getLatestLogisticsUpdate(applicationId: string): ApplicationLogisticsUpdate | undefined {
    return this.listLogisticsUpdates(applicationId)[0]
  },

  addLogisticsUpdate(
    applicationId: string,
    input: ApplicationLogisticsUpdateInput,
    actor = ACTOR,
  ): ApplicationLogisticsUpdate {
    seedIfNeeded(applicationId)
    const existing = logisticsByApplication.get(applicationId) ?? []
    const sequence = existing.length + 1
    const update: ApplicationLogisticsUpdate = {
      id: createId('log'),
      applicationId,
      sequence,
      createdAt: nowIso(),
      createdBy: actor,
      source: 'application_management',
      status: input.status,
      deliveryMethod: input.deliveryMethod,
      courierPartner: input.courierPartner,
      awbNumber: input.awbNumber,
      trackingUrl: input.trackingUrl,
      dispatchDateTime: input.dispatchDateTime,
      remarks: input.remarks,
    }
    logisticsByApplication.set(applicationId, [...existing, update])

    this.addActivity(applicationId, {
      action: `Logistics update #${sequence} added`,
      detail: logisticsDetailBits(input) || 'Logistics details saved.',
      module: 'logistics',
      actor,
    })

    return update
  },

  updateLogisticsUpdate(
    applicationId: string,
    updateId: string,
    input: ApplicationLogisticsUpdateInput,
    actor = ACTOR,
  ): ApplicationLogisticsUpdate | undefined {
    seedIfNeeded(applicationId)
    const existing = logisticsByApplication.get(applicationId) ?? []
    const index = existing.findIndex(row => row.id === updateId)
    if (index < 0) return undefined
    const current = existing[index]
    if (current.source !== 'application_management') return undefined

    const next: ApplicationLogisticsUpdate = {
      ...current,
      status: input.status,
      deliveryMethod: input.deliveryMethod,
      courierPartner: input.courierPartner,
      awbNumber: input.awbNumber,
      trackingUrl: input.trackingUrl,
      dispatchDateTime: input.dispatchDateTime,
      remarks: input.remarks,
      createdBy: actor,
      createdAt: nowIso(),
    }
    const copy = [...existing]
    copy[index] = next
    logisticsByApplication.set(applicationId, copy)

    this.addActivity(applicationId, {
      action: `Logistics update #${current.sequence} edited`,
      detail: logisticsDetailBits(input) || 'Logistics details updated.',
      module: 'logistics',
      actor,
    })

    return next
  },

  deleteLogisticsUpdate(
    applicationId: string,
    updateId: string,
    actor = ACTOR,
  ): boolean {
    seedIfNeeded(applicationId)
    const existing = logisticsByApplication.get(applicationId) ?? []
    const target = existing.find(row => row.id === updateId)
    if (!target || target.source !== 'application_management') return false

    logisticsByApplication.set(
      applicationId,
      existing.filter(row => row.id !== updateId),
    )

    this.addActivity(applicationId, {
      action: `Logistics update #${target.sequence} deleted`,
      detail: logisticsDetailBits(target) || 'Logistics update removed.',
      module: 'logistics',
      actor,
    })

    return true
  },
}
