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
          { label: 'Create application', pathSuffix: '/applications/new' },
          { label: 'Track applications', pathSuffix: '/tracking' },
          { label: 'Vessel master', pathSuffix: '/masters/vessels' },
        ],
        showMarineNav: true,
      }
    case 'b2b_agent':
      return {
        title: 'B2B agent dashboard',
        subtitle: 'Multi-client applications, bookers & commission tracking',
        quickActions: [
          { label: 'New client application', pathSuffix: '/applications/new' },
          { label: 'Manage bookers', pathSuffix: '/users/bookers' },
          { label: 'Track applications', pathSuffix: '/tracking' },
          { label: 'Upload documents', pathSuffix: '/documents' },
        ],
        showMarineNav: false,
      }
    case 'corporate':
    default:
      return {
        title: 'Corporate travel dashboard',
        subtitle: 'Policy compliance, travelers & enterprise applications',
        quickActions: [
          { label: 'Create application', pathSuffix: '/applications/new' },
          { label: 'Manage bookers', pathSuffix: '/users/bookers' },
          { label: 'Upload documents', pathSuffix: '/documents' },
          { label: 'Track application', pathSuffix: '/tracking' },
        ],
        showMarineNav: false,
      }
  }
}
