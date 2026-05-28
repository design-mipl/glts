import type { CustomerType } from './session'

export interface DashboardVariant {
  title: string
  subtitle: string
  quickActions: { label: string; pathSuffix: string }[]
  showMarineNav: boolean
}

export function getBusinessDashboardVariant(customerType: CustomerType | undefined): DashboardVariant {
  switch (customerType) {
    case 'marine':
      return {
        title: 'Marine operations dashboard',
        subtitle: 'Crew manifests, vessel assignments & fast-track visas',
        quickActions: [
          { label: 'Upload crew manifest', pathSuffix: '/marine/crew' },
          { label: 'Bulk crew upload', pathSuffix: '/applications/new/bulk' },
          { label: 'Track applications', pathSuffix: '/tracking' },
          { label: 'Create application', pathSuffix: '/applications/new/single' },
        ],
        showMarineNav: true,
      }
    case 'b2b_agent':
      return {
        title: 'B2B agent dashboard',
        subtitle: 'Multi-client applications, bookers & commission tracking',
        quickActions: [
          { label: 'New client application', pathSuffix: '/applications/new/single' },
          { label: 'Manage bookers', pathSuffix: '/bookers' },
          { label: 'Bulk upload', pathSuffix: '/applications/new/bulk' },
          { label: 'Track applications', pathSuffix: '/tracking' },
        ],
        showMarineNav: false,
      }
    case 'corporate':
    default:
      return {
        title: 'Corporate travel dashboard',
        subtitle: 'Policy compliance, travelers & enterprise applications',
        quickActions: [
          { label: 'Create application', pathSuffix: '/applications/new/single' },
          { label: 'Manage bookers', pathSuffix: '/bookers' },
          { label: 'Upload documents', pathSuffix: '/documents' },
          { label: 'Track application', pathSuffix: '/tracking' },
        ],
        showMarineNav: false,
      }
  }
}
