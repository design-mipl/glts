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
      id: 'acc-tab-collections',
      title: 'Collections',
      subtitle: 'Outstanding · ageing · submission calendar',
      category: 'section',
      onSelect: () => options.onOpenTab('collections'),
    },
    {
      id: 'acc-tab-invoices',
      title: 'Invoices',
      subtitle: 'Posting queue · billing pipeline',
      category: 'section',
      onSelect: () => options.onOpenTab('invoices'),
    },
    {
      id: 'acc-tab-recon',
      title: 'Reconciliation',
      subtitle: 'Vendor payments · bank matches',
      category: 'section',
      onSelect: () => options.onOpenTab('reconciliation'),
    },
    {
      id: 'acc-tab-analytics',
      title: 'Analytics',
      subtitle: 'Top revenue · purchase vs revenue',
      category: 'section',
      onSelect: () => options.onOpenTab('analytics'),
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
      subtitle: 'Expense management',
      category: 'action',
      href: '/admin/finance/expenses',
      onSelect: () => options.onNavigate('/admin/finance/expenses'),
    },
  ]
}
