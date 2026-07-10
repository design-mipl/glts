import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BUSINESS_SEGMENT_DISTRIBUTION,
  COUNTRY_DISTRIBUTION,
  DEFAULT_DASHBOARD_FILTERS,
  ESCALATION_ROWS,
  EXECUTIVE_CRITICAL_ALERTS,
  EXECUTIVE_KPIS,
  NO_MOVEMENT_CASES,
  PASSPORT_TRACKER_SUMMARY,
  PASSPORT_TRANSIT_ROWS,
  PIPELINE_STAGES,
  REVENUE_SNAPSHOT,
  SLA_COMPLIANCE_BY_SEGMENT,
  TEAM_PRODUCTIVITY_METRICS,
  TEAM_WORKLOAD_ROWS,
  VERIFICATION_QUEUE,
  VISA_TYPE_DISTRIBUTION,
  WEEKLY_COMPLETION_TREND,
  type DashboardFilters,
  type EscalationRow,
  type NoMovementCaseRow,
  type PassportTransitRow,
  type TeamWorkloadRow,
  type VerificationQueueRow,
} from '../data/operationsDashboardMock'
import {
  filterEscalationRows,
  filterNoMovementCases,
  filterPassportTransitRows,
  filterTeamWorkloadRows,
  filterVerificationQueue,
  scaleDistributionSlices,
  scaleExecutiveAlerts,
  scaleKpis,
  scalePassportSummary,
  scalePipelineStages,
  scaleRevenueSnapshot,
  scaleSlaCompliance,
  scaleTeamProductivity,
  scaleWeeklyCompletion,
  filterDistributionByApplicationType,
} from '../utils/applyDashboardFilters'

export type AdminDashboardStatus = 'loading' | 'ready' | 'error'

const LOAD_DELAY_MS = 400

export function useAdminDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_DASHBOARD_FILTERS)
  const [status, setStatus] = useState<AdminDashboardStatus>('loading')
  const [loadKey, setLoadKey] = useState(0)

  useEffect(() => {
    setStatus('loading')
    const timer = window.setTimeout(() => {
      setStatus('ready')
    }, LOAD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [loadKey])

  const retry = useCallback(() => {
    setLoadKey((key) => key + 1)
  }, [])

  const kpis = useMemo(() => scaleKpis(EXECUTIVE_KPIS, filters), [filters])
  const pipelineStages = useMemo(() => scalePipelineStages(PIPELINE_STAGES, filters), [filters])
  const teamWorkload = useMemo(() => filterTeamWorkloadRows(TEAM_WORKLOAD_ROWS, filters), [filters])
  const criticalAlerts = useMemo(
    () => scaleExecutiveAlerts(EXECUTIVE_CRITICAL_ALERTS, filters),
    [filters],
  )
  const verificationQueue = useMemo(
    () => filterVerificationQueue(VERIFICATION_QUEUE, filters),
    [filters],
  )
  const passportSummary = useMemo(
    () => scalePassportSummary(PASSPORT_TRACKER_SUMMARY, filters),
    [filters],
  )
  const passportTransit = useMemo(
    () => filterPassportTransitRows(PASSPORT_TRANSIT_ROWS, filters),
    [filters],
  )
  const slaCompliance = useMemo(
    () => scaleSlaCompliance(SLA_COMPLIANCE_BY_SEGMENT, filters),
    [filters],
  )
  const teamProductivity = useMemo(
    () => scaleTeamProductivity(TEAM_PRODUCTIVITY_METRICS, filters),
    [filters],
  )
  const weeklyCompletion = useMemo(
    () => scaleWeeklyCompletion(WEEKLY_COMPLETION_TREND, filters),
    [filters],
  )
  const revenueSnapshot = useMemo(() => scaleRevenueSnapshot(REVENUE_SNAPSHOT, filters), [filters])
  const countryDistribution = useMemo(
    () => scaleDistributionSlices(COUNTRY_DISTRIBUTION, filters),
    [filters],
  )
  const visaTypeDistribution = useMemo(
    () => scaleDistributionSlices(VISA_TYPE_DISTRIBUTION, filters),
    [filters],
  )
  const segmentDistribution = useMemo(
    () =>
      scaleDistributionSlices(
        filterDistributionByApplicationType(BUSINESS_SEGMENT_DISTRIBUTION, filters),
        filters,
      ),
    [filters],
  )
  const escalations = useMemo(() => filterEscalationRows(ESCALATION_ROWS, filters), [filters])
  const noMovementCases = useMemo(
    () => filterNoMovementCases(NO_MOVEMENT_CASES, filters),
    [filters],
  )

  const getTeamWorkloadCellValue = useCallback((row: TeamWorkloadRow, key: string) => {
    const value = row[key as keyof TeamWorkloadRow]
    if (value === undefined || value === null) return ''
    return String(value)
  }, [])

  const getVerificationQueueCellValue = useCallback((row: VerificationQueueRow, key: string) => {
    const value = row[key as keyof VerificationQueueRow]
    if (value === undefined || value === null) return ''
    return String(value)
  }, [])

  const getPassportTransitCellValue = useCallback((row: PassportTransitRow, key: string) => {
    const value = row[key as keyof PassportTransitRow]
    if (value === undefined || value === null) return ''
    return String(value)
  }, [])

  const getEscalationCellValue = useCallback((row: EscalationRow, key: string) => {
    const value = row[key as keyof EscalationRow]
    if (value === undefined || value === null) return ''
    return String(value)
  }, [])

  const getNoMovementCellValue = useCallback((row: NoMovementCaseRow, key: string) => {
    const value = row[key as keyof NoMovementCaseRow]
    if (value === undefined || value === null) return ''
    return String(value)
  }, [])

  return {
    filters,
    setFilters,
    status,
    retry,
    kpis,
    pipelineStages,
    teamWorkload,
    criticalAlerts,
    verificationQueue,
    passportSummary,
    passportTransit,
    slaCompliance,
    teamProductivity,
    weeklyCompletion,
    revenueSnapshot,
    countryDistribution,
    visaTypeDistribution,
    segmentDistribution,
    escalations,
    noMovementCases,
    getTeamWorkloadCellValue,
    getVerificationQueueCellValue,
    getPassportTransitCellValue,
    getEscalationCellValue,
    getNoMovementCellValue,
  }
}
