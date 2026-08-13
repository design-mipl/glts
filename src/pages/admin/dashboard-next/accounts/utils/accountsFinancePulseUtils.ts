import type { AccountsDashboardData } from '../types'

export type AccountsOverviewAlertSeverity = 'critical' | 'warning' | 'info'

export interface AccountsOverviewAlert {
  id: string
  title: string
  description: string
  severity: AccountsOverviewAlertSeverity
}

/** Finance risk alerts for Overview AlertCenter (not duplicated as hero KPIs). */
export function buildAccountsFinanceRiskAlerts(
  data: AccountsDashboardData,
): AccountsOverviewAlert[] {
  const blocked = data.financeWorkspace.blockedCash
  const kpi = data.financeKpiStrip
  const risk = data.financeRiskCallouts
  const alerts: AccountsOverviewAlert[] = []

  if (blocked.applicationCount > 0) {
    alerts.push({
      id: 'alert-blocked-cash',
      title: 'Cash blocked',
      description: `${blocked.amount} across ${blocked.applicationCount} apps · ${blocked.expectedReleaseLabel}`,
      severity: blocked.applicationCount >= 5 ? 'critical' : 'warning',
    })
  }

  if (kpi.overdueInvoiceCount > 0) {
    alerts.push({
      id: 'alert-overdue-receivables',
      title: 'Overdue receivables',
      description: `${kpi.overdueAmount} · ${kpi.overdueInvoiceCount} invoices`,
      severity: 'critical',
    })
  }

  if (risk.creditExposure) {
    alerts.push({
      id: 'alert-credit-exposure',
      title: 'Credit exposure',
      description: `${risk.creditExposure}${risk.creditExposureTop5 ? ` · top 5 ${risk.creditExposureTop5}` : ''}`,
      severity: 'warning',
    })
  }

  if (kpi.availableFundsStatus === 'critical' || kpi.availableFundsStatus === 'approaching') {
    alerts.push({
      id: 'alert-available-funds',
      title: 'Available funds',
      description: `${kpi.availableFunds} · ${kpi.availableFundsFloor} · ${kpi.availableFundsStatusLabel}`,
      severity: kpi.availableFundsStatus === 'critical' ? 'critical' : 'warning',
    })
  }

  if (risk.slaCashAtRiskCases > 0) {
    alerts.push({
      id: 'alert-sla-cash',
      title: 'SLA cash at risk',
      description: `${risk.slaCashAtRisk} · ${risk.slaCashAtRiskCases} cases`,
      severity: 'warning',
    })
  }

  return alerts
}

const SEVERITY_RANK: Record<AccountsOverviewAlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
}

/** Keep Overview alerts short — critical/warning first, then cap. */
export function prioritizeOverviewAlerts<T extends { severity: AccountsOverviewAlertSeverity }>(
  alerts: T[],
  maxItems = 5,
): T[] {
  return [...alerts]
    .filter((alert) => alert.severity !== 'info')
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
    .slice(0, maxItems)
}
