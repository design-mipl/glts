import type { AdminDashboardNextData, AdminDashboardNextFilters } from '../types'
import { ADMIN_DASHBOARD_NEXT_MOCK } from '../data/adminDashboardNextMock'
import { applyAdminDashboardFilters } from '../utils/applyAdminDashboardFilters'
import { listLogisticsInTransitRows } from '../../shared/utils/mapLogisticsInTransitRows'
import { getAllMarineListingRows } from '@/pages/admin/application-management/marine/utils/marineApplicationListingUtils'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import { countPhysicalOriginalsPendingApplications } from '../../shared/utils/physicalOriginalsDeskUtils'
import { OPS_QUEUE_DISPLAY_LABELS } from '../../shared/widgets/operations/opsQueueDisplayLabels'

const LOAD_DELAY_MS = 350

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function overlayPhysicalOriginalsLiveCounts(data: AdminDashboardNextData): void {
  const { singles, bulks } = marineApplicationAdminService.listMarineApplications()
  const apps = getAllMarineListingRows(singles, bulks)
  const physicalCount = countPhysicalOriginalsPendingApplications(apps)

  const kpi = data.quickStats.find(item => item.id === 'physical-documents-pending')
  if (kpi) {
    kpi.value = physicalCount
    kpi.sparklineData = [physicalCount, physicalCount, physicalCount]
  } else {
    data.quickStats.push({
      id: 'physical-documents-pending',
      label: 'Physical documents pending',
      value: physicalCount,
      deltaLabel: 'Awaiting original receipt',
      sparklineData: [physicalCount, physicalCount, physicalCount],
    })
  }

  const attention = data.attentionAlerts.find(item => item.id === 'ca-physical')
  if (attention) {
    attention.count = physicalCount
  } else if (physicalCount > 0) {
    data.attentionAlerts.unshift({
      id: 'ca-physical',
      title: 'Physical documents pending',
      count: physicalCount,
      oldestWaiting: '—',
      priority: 'high',
    })
  }

  const opsAlert = data.opsAlerts.find(item => item.id === 'oa-physical')
  if (opsAlert) {
    opsAlert.count = physicalCount
  } else if (physicalCount > 0) {
    data.opsAlerts.unshift({
      id: 'oa-physical',
      title: 'Physical documents pending',
      description: 'Originals awaiting GLTS receipt confirmation',
      severity: 'warning',
      href: '/admin/application-management/marine?tab=verification_pending',
      count: physicalCount,
    })
  }

  const mix = data.opsQueueSnapshot.queueMix.find(item => item.key === 'physical_originals')
  if (mix) {
    mix.value = physicalCount
    mix.label = OPS_QUEUE_DISPLAY_LABELS.physicalOriginals
  } else {
    data.opsQueueSnapshot.queueMix.push({
      key: 'physical_originals',
      label: OPS_QUEUE_DISPLAY_LABELS.physicalOriginals,
      value: physicalCount,
    })
  }
}

/** Mock fetch adapter — swap for real API later without changing widgets. */
export async function fetchAdminDashboardNext(
  filters: AdminDashboardNextFilters,
): Promise<AdminDashboardNextData> {
  await delay(LOAD_DELAY_MS)
  const base = structuredClone(ADMIN_DASHBOARD_NEXT_MOCK)
  base.inTransitCourierRows = listLogisticsInTransitRows()
  overlayPhysicalOriginalsLiveCounts(base)
  return applyAdminDashboardFilters(base, filters)
}
