import type { SuperAdminAnalyticsData, AnalyticsTrendPoint } from '../types/analyticsTypes'

const MONTHS_24 = [
  'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24',
  'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
  'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
  'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26',
  'Jul 26', 'Aug 26',
]

function multiTrend(
  keys: string[],
  series: Record<string, number[]>,
): AnalyticsTrendPoint[] {
  return MONTHS_24.map((label, i) => {
    const row: AnalyticsTrendPoint = { label }
    keys.forEach((key) => {
      row[key] = series[key]?.[i] ?? series[key]?.[series[key].length - 1] ?? 0
    })
    return row
  })
}

export const SUPER_ADMIN_ANALYTICS_MOCK: SuperAdminAnalyticsData = {
  revenueQuality: {
    headlines: [
      {
        id: 'top3-concentration',
        title: 'Top 3 account concentration',
        value: '41%',
        tooltip:
          'Share of net revenue from the three largest accounts on a rolling 12-month basis. High concentration increases financial risk if a major account churns.',
        tone: 'warning',
        delta: 13,
        deltaLabel: 'vs 6 months ago',
        priorValue: '28%',
        targetLabel: 'Target ≤35%',
        supportingLines: ['Rolling 12 months · Net revenue basis'],
      },
      {
        id: 'largest-client',
        title: 'Largest account share',
        value: '18%',
        tooltip:
          'Single largest account as a percentage of total net revenue. No individual account should exceed 15% of total revenue.',
        tone: 'warning',
        delta: 4,
        deltaLabel: 'vs 6 months ago',
        priorValue: '14%',
        targetLabel: 'Target ≤15%',
        supportingLines: ['Eastern Pacific Shipping'],
      },
      {
        id: 'recurring-revenue',
        title: 'Recurring revenue',
        value: '68%',
        tooltip:
          'Revenue from accounts that also generated revenue in the previous month. Higher recurring revenue indicates stronger client relationships.',
        tone: 'positive',
        delta: 5,
        deltaLabel: 'vs 6 months ago',
        priorValue: '63%',
        supportingLines: ['Transactional revenue: 32%'],
      },
    ],
    concentrationTrend: {
      title: 'Revenue concentration risk',
      description: 'Rolling 12-month net revenue share · Top 3 target ≤35% · Largest account ≤15%',
      xKey: 'label',
      yFormat: 'percent',
      lines: [
        { key: 'top3', label: 'Top 3 accounts' },
        { key: 'top5', label: 'Top 5 accounts' },
        { key: 'top10', label: 'Top 10 accounts' },
        { key: 'largest', label: 'Largest account' },
      ],
      data: multiTrend(['top3', 'top5', 'top10', 'largest'], {
        top3: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 38, 39, 40, 40, 39, 40, 41, 41, 40, 41, 41, 41],
        top5: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 48, 49, 50, 50, 49, 50, 51, 51, 50, 51, 52, 52],
        top10: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 62, 63, 64, 64, 63, 64, 65, 65, 64, 65, 66, 66],
        largest: [12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 16, 16, 15, 16, 17, 17, 16, 17, 18, 18, 17, 18, 18, 18],
      }),
    },
    revenueByCountryTrend: {
      title: 'Net revenue by destination',
      description: 'Monthly share of total net revenue · Strategic corridors highlighted',
      xKey: 'label',
      yFormat: 'percent',
      lines: [
        { key: 'schengen', label: 'Schengen' },
        { key: 'uae', label: 'UAE' },
        { key: 'uk', label: 'UK' },
        { key: 'us', label: 'USA' },
        { key: 'other', label: 'Other destinations' },
      ],
      data: multiTrend(['schengen', 'uae', 'uk', 'us', 'other'], {
        schengen: [22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33],
        uae: [18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29],
        uk: [14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 22, 22],
        us: [12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20],
        other: [34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
      }),
    },
    recurringVsTransactional: {
      title: 'Recurring vs transactional revenue',
      description: 'Monthly net revenue split · Recurring = accounts active in prior month',
      xKey: 'label',
      yFormat: 'currency',
      bars: [
        { key: 'recurring', label: 'Recurring revenue (₹L)' },
        { key: 'transactional', label: 'Transactional revenue (₹L)' },
      ],
      data: multiTrend(['recurring', 'transactional'], {
        recurring: [820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280],
        transactional: [480, 470, 460, 450, 440, 430, 420, 410, 400, 390, 380, 370, 360, 350, 340, 330, 320, 310, 300, 290, 280, 270, 260, 250],
      }),
    },
    recurringPct: '68%',
    transactionalPct: '32%',
  },

  clientRetention: {
    headlines: [
      {
        id: 'nrr',
        title: 'Net revenue retention',
        value: '104%',
        tooltip:
          'Revenue retained and expanded from the existing account base, excluding newly acquired accounts. Above 100% means existing clients are spending more.',
        tone: 'positive',
        delta: 3,
        deltaLabel: 'vs prior month',
        priorValue: '101%',
        targetLabel: 'Target >100%',
        supportingLines: ['Existing accounts expanding'],
      },
      {
        id: 'churn-marine',
        title: 'Marine churn rate',
        value: '4.2%',
        tooltip:
          'Accounts active last month but inactive this month, as a share of prior-month active Marine accounts.',
        tone: 'positive',
        delta: -1.1,
        deltaLabel: 'vs 3-month avg',
        priorValue: '5.3%',
        supportingLines: ['Marine · Monthly'],
      },
      {
        id: 'churn-retail',
        title: 'Retail churn rate',
        value: '11.8%',
        tooltip:
          'Accounts active last month but inactive this month, as a share of prior-month active Retail accounts.',
        tone: 'warning',
        delta: 2.4,
        deltaLabel: 'vs 3-month avg',
        priorValue: '9.4%',
        supportingLines: ['Retail · Monthly'],
      },
    ],
    nrrTrend: {
      title: 'Net revenue retention trend',
      description: 'Monthly NRR · Reference at 100%',
      xKey: 'label',
      yFormat: 'percent',
      lines: [{ key: 'nrr', label: 'NRR' }],
      data: multiTrend(['nrr'], {
        nrr: [96, 97, 97, 98, 98, 99, 99, 100, 100, 101, 101, 102, 102, 103, 103, 103, 104, 104, 104, 105, 105, 104, 104, 104],
      }),
    },
    churnBySegmentTrend: {
      title: 'Churn rate by business segment',
      description: 'Monthly · Accounts active last month but inactive this month',
      xKey: 'label',
      yFormat: 'percent',
      lines: [
        { key: 'marine', label: 'Marine' },
        { key: 'corporate', label: 'Corporate' },
        { key: 'retail', label: 'Retail' },
        { key: 'b2b', label: 'B2B' },
      ],
      data: multiTrend(['marine', 'corporate', 'retail', 'b2b'], {
        marine: [6.2, 5.8, 5.5, 5.3, 5.1, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.3, 4.2, 4.2, 4.1, 4.1, 4.2, 4.2, 4.1, 4.2, 4.2, 4.2, 4.2],
        corporate: [3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 3.0, 2.9, 2.9, 2.8, 2.8, 2.8, 2.7, 2.7, 2.7, 2.8, 2.8, 2.7, 2.8, 2.8, 2.8, 2.8],
        retail: [8.2, 8.5, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.6, 10.8, 11.0, 11.2, 11.4, 11.6, 11.8, 11.8, 11.6, 11.8, 11.8, 11.8, 11.8],
        b2b: [5.0, 4.8, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.7, 3.6, 3.6, 3.5, 3.5, 3.6, 3.6, 3.5, 3.6, 3.6, 3.6, 3.6],
      }),
    },
    walletShareAccounts: [
      {
        id: 'ws-1',
        primary: 'Eastern Pacific Shipping',
        value: '35%',
        progress: 35,
        secondary: 'Est. spend ₹40L · GLTS ₹14L · was 45%',
        tone: 'negative',
      },
      {
        id: 'ws-2',
        primary: 'Reliance Industries',
        value: '52%',
        progress: 52,
        secondary: 'Est. spend ₹82L · GLTS ₹42.6L · was 48%',
        tone: 'positive',
      },
      {
        id: 'ws-3',
        primary: 'BrightCorp India',
        value: '41%',
        progress: 41,
        secondary: 'Est. spend ₹28L · GLTS ₹11.5L · was 44%',
        tone: 'warning',
      },
      {
        id: 'ws-4',
        primary: 'Oceanic Crew Services',
        value: '58%',
        progress: 58,
        secondary: 'Est. spend ₹36L · GLTS ₹20.9L · was 55%',
        tone: 'positive',
      },
      {
        id: 'ws-5',
        primary: 'Skyline Travels',
        value: '29%',
        progress: 29,
        secondary: 'Est. spend ₹18L · GLTS ₹5.2L · was 34%',
        tone: 'negative',
      },
    ],
  },

  operationalEfficiency: {
    headlines: [
      {
        id: 'approval-schengen',
        title: 'Schengen approval rate',
        value: '94%',
        tooltip:
          '90-day rolling approval rate for Schengen applications. Declines above 3 percentage points trigger investigation.',
        tone: 'positive',
        delta: -1.2,
        deltaLabel: 'vs 90 days ago',
        priorValue: '95.2%',
        supportingLines: ['90-day rolling · Decided applications'],
      },
      {
        id: 'rework-rate',
        title: 'Rework rate',
        value: '8.4%',
        tooltip:
          'Applications requiring document correction, re-upload, form correction, or internal processing correction.',
        tone: 'warning',
        delta: 1.6,
        deltaLabel: 'vs 3-month avg',
        priorValue: '6.8%',
        supportingLines: ['All business segments'],
      },
      {
        id: 'glts-error-rejections',
        title: 'GLTS error rejections',
        value: '12%',
        tooltip:
          'Share of rejections attributed to GLTS processing errors — wrong document, incorrect category, incomplete form.',
        tone: 'warning',
        delta: 3,
        deltaLabel: 'vs 6 months ago',
        priorValue: '9%',
        supportingLines: ['Of total rejections · Monthly'],
      },
    ],
    approvalRateTrend: {
      title: 'Approval rate by destination',
      description: '90-day rolling approval rate · Alert when decline exceeds 3 pts',
      xKey: 'label',
      yFormat: 'percent',
      lines: [
        { key: 'schengen', label: 'Schengen' },
        { key: 'uae', label: 'UAE' },
        { key: 'uk', label: 'UK' },
        { key: 'us', label: 'USA' },
      ],
      data: multiTrend(['schengen', 'uae', 'uk', 'us'], {
        schengen: [97, 96.8, 96.5, 96.2, 96.0, 95.8, 95.5, 95.2, 95.0, 94.8, 94.6, 94.4, 94.3, 94.2, 94.1, 94.0, 94.0, 94.0, 94.0, 94.0, 94.0, 94.0, 94.0, 94.0],
        uae: [98, 98, 97.8, 97.6, 97.5, 97.4, 97.2, 97.0, 96.9, 96.8, 96.7, 96.6, 96.5, 96.4, 96.3, 96.2, 96.1, 96.0, 96.0, 96.0, 96.0, 96.0, 96.0, 96.0],
        uk: [95, 94.8, 94.6, 94.4, 94.2, 94.0, 93.8, 93.6, 93.4, 93.2, 93.0, 92.8, 92.6, 92.4, 92.2, 92.0, 91.8, 91.6, 91.4, 91.2, 91.0, 91.0, 91.0, 91.0],
        us: [96, 95.8, 95.6, 95.4, 95.2, 95.0, 94.8, 94.6, 94.4, 94.2, 94.0, 93.8, 93.6, 93.4, 93.2, 93.0, 92.8, 92.6, 92.4, 92.2, 92.0, 92.0, 92.0, 92.0],
      }),
    },
    rejectionRootCause: {
      title: 'Rejection root cause mix',
      description: 'Monthly share of rejections by cause category',
      xKey: 'label',
      yFormat: 'percent',
      bars: [
        { key: 'gltsError', label: 'GLTS error' },
        { key: 'applicantProfile', label: 'Applicant profile' },
        { key: 'embassyDiscretion', label: 'Embassy discretion' },
      ],
      data: multiTrend(['gltsError', 'applicantProfile', 'embassyDiscretion'], {
        gltsError: [9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 12, 12, 12, 12, 12, 12, 12, 12],
        applicantProfile: [38, 38, 39, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45, 44, 44, 44, 44, 44, 44, 44, 44],
        embassyDiscretion: [53, 53, 51, 51, 50, 49, 48, 48, 46, 46, 45, 45, 44, 44, 42, 42, 44, 44, 44, 44, 44, 44, 44, 44],
      }),
    },
    reworkBySegmentTrend: {
      title: 'Rework rate by business segment',
      description: 'Monthly · Applications requiring correction or resubmission',
      xKey: 'label',
      yFormat: 'percent',
      lines: [
        { key: 'marine', label: 'Marine' },
        { key: 'corporate', label: 'Corporate' },
        { key: 'retail', label: 'Retail' },
        { key: 'b2b', label: 'B2B' },
      ],
      data: multiTrend(['marine', 'corporate', 'retail', 'b2b'], {
        marine: [5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 8.8, 8.6, 8.4, 8.4],
        corporate: [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.8, 5.7, 5.6, 5.6],
        retail: [6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.6, 8.5, 8.4, 8.4],
        b2b: [3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.3, 5.2, 5.1, 5.1],
      }),
    },
  },

  salesPipeline: {
    headlines: [
      {
        id: 'lead-conversion',
        title: 'Enquiry conversion rate',
        value: '22%',
        tooltip:
          'Converted accounts divided by total enquiries in the selected period. Measures end-to-end acquisition efficiency.',
        tone: 'neutral',
        delta: -2,
        deltaLabel: 'vs 6 months ago',
        priorValue: '24%',
        supportingLines: ['Last 6 months · All inquiry sources'],
      },
      {
        id: 'referral-conversion',
        title: 'Referral conversion',
        value: '31%',
        tooltip: 'Conversion rate for enquiries received via Referral inquiry source.',
        tone: 'positive',
        delta: 4,
        deltaLabel: 'vs 6 months ago',
        priorValue: '27%',
        supportingLines: ['Highest converting channel'],
      },
      {
        id: 'website-conversion',
        title: 'Website conversion',
        value: '14%',
        tooltip: 'Conversion rate for enquiries received via Website inquiry source.',
        tone: 'warning',
        delta: -3,
        deltaLabel: 'vs 6 months ago',
        priorValue: '17%',
        supportingLines: ['Largest enquiry volume channel'],
      },
    ],
    leadSourceRows: [
      { id: 'ls-1', source: 'Website', enquiries: 248, quotationsSent: 186, convertedAccounts: 35, conversionPct: 14.1, avgNetRevenue: '₹2.8L' },
      { id: 'ls-2', source: 'Referral', enquiries: 142, quotationsSent: 118, convertedAccounts: 44, conversionPct: 31.0, avgNetRevenue: '₹5.2L' },
      { id: 'ls-3', source: 'Existing Customer', enquiries: 96, quotationsSent: 82, convertedAccounts: 38, conversionPct: 39.6, avgNetRevenue: '₹4.6L' },
      { id: 'ls-4', source: 'Email', enquiries: 78, quotationsSent: 54, convertedAccounts: 12, conversionPct: 15.4, avgNetRevenue: '₹3.1L' },
      { id: 'ls-5', source: 'Call', enquiries: 64, quotationsSent: 48, convertedAccounts: 14, conversionPct: 21.9, avgNetRevenue: '₹3.4L' },
      { id: 'ls-6', source: 'Sales Team', enquiries: 52, quotationsSent: 46, convertedAccounts: 18, conversionPct: 34.6, avgNetRevenue: '₹6.1L' },
    ],
    conversionBySourceTrend: {
      title: 'Conversion rate by inquiry source',
      description: '6-month trend · Converted accounts ÷ enquiries',
      xKey: 'label',
      yFormat: 'percent',
      lines: [
        { key: 'website', label: 'Website' },
        { key: 'referral', label: 'Referral' },
        { key: 'existing', label: 'Existing Customer' },
        { key: 'salesTeam', label: 'Sales Team' },
      ],
      data: multiTrend(['website', 'referral', 'existing', 'salesTeam'], {
        website: [17, 16.5, 16, 15.5, 15, 14.8, 14.5, 14.3, 14.2, 14.1, 14.0, 14.0, 14.1, 14.1, 14.0, 14.0, 14.1, 14.1, 14.0, 14.0, 14.1, 14.1, 14.1, 14.1],
        referral: [27, 27.5, 28, 28.5, 29, 29.2, 29.5, 29.8, 30, 30.2, 30.5, 30.8, 31, 31, 30.8, 30.8, 31, 31, 30.8, 30.8, 31, 31, 31, 31],
        existing: [36, 36.5, 37, 37.5, 38, 38.2, 38.5, 38.8, 39, 39.2, 39.5, 39.6, 39.6, 39.6, 39.5, 39.5, 39.6, 39.6, 39.5, 39.5, 39.6, 39.6, 39.6, 39.6],
        salesTeam: [30, 30.5, 31, 31.5, 32, 32.2, 32.5, 32.8, 33, 33.2, 33.5, 33.8, 34, 34.2, 34.5, 34.6, 34.6, 34.6, 34.5, 34.5, 34.6, 34.6, 34.6, 34.6],
      }),
    },
  },
}
