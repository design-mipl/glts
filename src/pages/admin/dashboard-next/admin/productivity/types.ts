import type { WorkforceDepartmentId, WorkforceTeamId } from './config/workforceAnalyticsConfig'

export interface WorkforceKpi {
  id: string
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
}

export interface WorkforceNamedMetric {
  id: string
  label: string
  value: number
  secondary?: number
  tertiary?: number
  quaternary?: number
  meta?: string
}

export interface WorkforceTrendPoint {
  label: string
  value: number
  secondary?: number
  tertiary?: number
  quaternary?: number
}

export interface WorkforceSlice {
  id: string
  label: string
  value: number
}

export interface WorkforceDepartmentCard {
  id: WorkforceDepartmentId
  label: string
  users: number
  openCases: number
  completedToday: number
  pending: number
  capacityPercent: number
  slaPercent: number
  productivityPercent: number
}

export interface WorkforceTeamMetric {
  id: WorkforceTeamId
  label: string
  openApplications: number
  completed: number
  delayed: number
  slaPercent: number
  productivityPercent: number
}

export interface WorkforceEmployeeRow {
  id: string
  name: string
  department: string
  departmentId: WorkforceDepartmentId
  teamId: WorkforceTeamId
  assigned: number
  completed: number
  pending: number
  delayed: number
  slaPercent: number
  productivityPercent: number
  capacityPercent: number
  workloadTone: 'normal' | 'busy' | 'overloaded'
}

export interface WorkforceWorkloadStackRow {
  label: string
  open: number
  pending: number
  completed: number
  delayed: number
}

export interface WorkforceRadarRow {
  metric: string
  operations: number
  documentation: number
  ground: number
  accounts: number
}

export interface WorkforceActivityEvent {
  id: string
  time: string
  employee: string
  action: string
}

export interface WorkforceAnalyticsData {
  executiveKpis: WorkforceKpi[]
  departments: WorkforceDepartmentCard[]
  departmentRanking: WorkforceNamedMetric[]
  teamKpis: WorkforceKpi[]
  teams: WorkforceTeamMetric[]
  teamContribution: WorkforceSlice[]
  teamMonthlyTrend: WorkforceTrendPoint[]
  employeeKpis: WorkforceKpi[]
  employees: WorkforceEmployeeRow[]
  workloadKpis: WorkforceKpi[]
  workloadByEmployee: WorkforceNamedMetric[]
  workloadStack: WorkforceWorkloadStackRow[]
  capacityKpis: WorkforceKpi[]
  departmentCapacity: WorkforceNamedMetric[]
  userCapacity: WorkforceNamedMetric[]
  slaKpis: WorkforceKpi[]
  slaByDepartment: WorkforceNamedMetric[]
  slaByTeam: WorkforceNamedMetric[]
  slaByEmployee: WorkforceNamedMetric[]
  slaTrend: WorkforceTrendPoint[]
  dailyProductivity: WorkforceTrendPoint[]
  weeklyProductivity: WorkforceTrendPoint[]
  monthlyProductivity: WorkforceTrendPoint[]
  departmentTrend: WorkforceTrendPoint[]
  qualityKpis: WorkforceKpi[]
  errorDistribution: WorkforceSlice[]
  qcByDepartment: WorkforceNamedMetric[]
  reworkTrend: WorkforceTrendPoint[]
  activityKpis: WorkforceKpi[]
  activityTimeline: WorkforceActivityEvent[]
  comparisonTable: WorkforceDepartmentCard[]
  comparisonBars: WorkforceNamedMetric[]
  radarComparison: WorkforceRadarRow[]
  topPerformers: WorkforceNamedMetric[]
  topTeams: WorkforceNamedMetric[]
  topDepartments: WorkforceNamedMetric[]
  mostImproved: WorkforceNamedMetric[]
  bottleneckKpis: WorkforceKpi[]
  bottleneckByDepartment: WorkforceNamedMetric[]
  bottleneckByTeam: WorkforceNamedMetric[]
  bottleneckByEmployee: WorkforceNamedMetric[]
  delayReasons: WorkforceSlice[]
}
