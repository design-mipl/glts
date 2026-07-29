import type {
  ExecutiveInsight,
  ExecutiveRecommendation,
  ExecutiveSearchItem,
  ManagementAlertRecord,
  PredictivePanelModel,
} from '../../shared/dashboard-intelligence'

export const SUPER_ADMIN_INSIGHTS: ExecutiveInsight[] = [
  {
    id: 'ins-1',
    title: 'Revenue up 14% MoM',
    body: 'Marine contributed 81% of this month’s incremental growth.',
    tone: 'positive',
    segment: 'Marine',
    metricId: 'rev-mtd',
  },
  {
    id: 'ins-2',
    title: 'Collections soft −9%',
    body: 'Three clients represent 72% of outstanding receivables.',
    tone: 'warning',
    segment: 'Finance',
    metricId: 'collections',
  },
  {
    id: 'ins-3',
    title: 'Joining-date risk rising',
    body: '12 crew members require attention within 5 days.',
    tone: 'negative',
    segment: 'Marine',
  },
  {
    id: 'ins-4',
    title: 'Embassy delays above SLA',
    body: 'Dubai processing time is now above the network SLA band.',
    tone: 'warning',
    segment: 'Operations',
  },
]

export const SUPER_ADMIN_RECOMMENDATIONS: ExecutiveRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Escalate Nordic Marine AR',
    description: 'Schedule collections call this week — ₹14.1L overdue.',
    actionLabel: 'Open client',
    owner: 'Finance Head',
    priority: 'high',
  },
  {
    id: 'rec-2',
    title: 'Clear Pacific Pearl joining risk',
    description: 'Embassy lag threatens sign-on in 4 days for 18 crew.',
    actionLabel: 'Open marine',
    owner: 'Operations Head',
    priority: 'critical',
  },
]

export const SUPER_ADMIN_MANAGEMENT_ALERTS: ManagementAlertRecord[] = [
  {
    id: 'ma-1',
    title: '90+ receivables concentration',
    description: 'Three accounts hold 41% of overdue AR.',
    severity: 'critical',
    businessImpact: 'Cash risk / board visibility',
    affectedSegment: 'Finance',
    recommendedAction: 'Escalate top-3 AR owners today',
    owner: 'Finance Head',
    status: 'open',
    financialImpact: '₹1.11Cr',
    count: 3,
  },
  {
    id: 'ma-2',
    title: 'MV Pacific Pearl joining risk',
    description: 'Sign-on in 4 days with embassy lag.',
    severity: 'critical',
    businessImpact: 'Marine delivery & client SLA',
    affectedSegment: 'Marine',
    recommendedAction: 'Prioritize embassy follow-up',
    owner: 'Operations Head',
    status: 'in-progress',
    financialImpact: '₹38L at risk',
    count: 18,
  },
  {
    id: 'ma-3',
    title: 'Schengen embassy capacity',
    description: 'Two corridors above delay threshold.',
    severity: 'high',
    businessImpact: 'Approval SLA',
    affectedSegment: 'Operations',
    recommendedAction: 'Rebalance submissions',
    owner: 'Ops Pod A',
    status: 'watching',
    financialImpact: '₹22L delayed billings',
    count: 2,
  },
  {
    id: 'ma-4',
    title: 'Documentation SLA dip',
    description: 'Docs SLA at 88% vs 90% target.',
    severity: 'medium',
    businessImpact: 'Rework queue growth',
    affectedSegment: 'Operations',
    recommendedAction: 'Add temporary capacity',
    owner: 'Documentation Lead',
    status: 'open',
    financialImpact: '₹4L rework cost',
  },
  {
    id: 'ma-5',
    title: 'Retail branch variance',
    description: 'Hyderabad trailing network average by 8 pts.',
    severity: 'low',
    businessImpact: 'Monitor only',
    affectedSegment: 'Retail',
    recommendedAction: 'Review in weekly ops',
    owner: 'Branch Manager',
    status: 'watching',
    financialImpact: '₹1.2L',
  },
]

export const SUPER_ADMIN_FORECASTS: PredictivePanelModel[] = [
  {
    id: 'fc-rev',
    title: 'Revenue forecast',
    horizonLabel: 'Next 30 days',
    projectedValue: '₹2.35Cr',
    confidenceLabel: '78% confidence',
    deltaLabel: '+8% vs MTD run-rate',
    notes: ['Assumes Marine sign-ons clear on schedule.'],
  },
  {
    id: 'fc-col',
    title: 'Collection forecast',
    horizonLabel: 'Next 30 days',
    projectedValue: '₹2.05Cr',
    confidenceLabel: '71% confidence',
    notes: ['Sensitive to Nordic Marine recovery.'],
  },
  {
    id: 'fc-pipe',
    title: 'Pipeline forecast',
    horizonLabel: 'Next quarter',
    projectedValue: '₹1.24Cr',
    confidenceLabel: 'Placeholder',
    notes: ['Corporate / retail CRM depth pending.'],
  },
  {
    id: 'fc-cap',
    title: 'Capacity forecast',
    horizonLabel: 'Next 2 weeks',
    projectedValue: '92%',
    confidenceLabel: 'Utilization',
    notes: ['Ops Pod A near soft capacity limit.'],
  },
]

export function buildSuperAdminSearchItems(options: {
  onNavigate: (href: string) => void
  onJump: (sectionId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 's-marine',
      title: 'Marine intelligence',
      subtitle: 'Jump to section',
      category: 'section',
      onSelect: () => options.onJump('marine-intelligence'),
    },
    {
      id: 's-finance',
      title: 'Finance',
      subtitle: 'Jump to section',
      category: 'section',
      onSelect: () => options.onJump('finance'),
    },
    {
      id: 'c-nordic',
      title: 'Nordic Marine Ltd',
      subtitle: 'Client · at risk',
      category: 'client',
      onSelect: () => options.onNavigate('/admin/customer-accounts/corporate-accounts'),
    },
    {
      id: 'c-bright',
      title: 'BrightCorp India',
      subtitle: 'Client · healthy',
      category: 'client',
      onSelect: () => options.onNavigate('/admin/customer-accounts/corporate-accounts'),
    },
    {
      id: 'm-pacific',
      title: 'MV Pacific Pearl',
      subtitle: 'Marine vessel · critical',
      category: 'marine',
      onSelect: () => options.onJump('marine-intelligence'),
    },
    {
      id: 'a-ops',
      title: 'Operations dashboard',
      subtitle: 'Quick action',
      category: 'action',
      href: '/admin/dashboard-next/operations',
      onSelect: () => options.onNavigate('/admin/dashboard-next/operations'),
    },
    {
      id: 'r-board',
      title: 'Monthly executive pack',
      subtitle: 'Recent report',
      category: 'report',
      onSelect: () => options.onNavigate('/admin/dashboard/accounts'),
    },
  ]
}
