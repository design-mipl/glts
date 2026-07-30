import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'

export function buildAccountsSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'acc-tab-overview',
      title: 'Overview',
      subtitle: 'Accounts workspace tab',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'acc-tab-work',
      title: 'Work',
      subtitle: 'Reconciliation · invoicing · credit control',
      category: 'section',
      onSelect: () => options.onOpenTab('work'),
    },
    {
      id: 'acc-tab-performance',
      title: 'Performance',
      subtitle: 'Revenue · ageing · top clients / countries',
      category: 'section',
      onSelect: () => options.onOpenTab('performance'),
    },
    {
      id: 'acc-tab-reports',
      title: 'Reports',
      subtitle: 'Daily packs · collections · supervisor analytics',
      category: 'section',
      onSelect: () => options.onOpenTab('reports'),
    },
    {
      id: 'acc-invoices',
      title: 'Invoice listing',
      subtitle: 'Open finance invoices',
      category: 'action',
      href: '/admin/finance/invoices',
      onSelect: () => options.onNavigate('/admin/finance/invoices'),
    },
    {
      id: 'acc-vendor',
      title: 'Vendor billing',
      subtitle: 'Reconciliation workspace',
      category: 'action',
      href: '/admin/finance/vendor-billing',
      onSelect: () => options.onNavigate('/admin/finance/vendor-billing'),
    },
    {
      id: 'acc-expenses',
      title: 'Expenses',
      subtitle: 'Expense management — card, cash, courier, insurance',
      category: 'action',
      href: '/admin/finance/expenses',
      onSelect: () => options.onNavigate('/admin/finance/expenses'),
    },
  ]
}
