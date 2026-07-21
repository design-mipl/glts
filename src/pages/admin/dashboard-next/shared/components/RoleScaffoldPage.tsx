import { EmptyState } from '@/design-system/UIComponents'
import type { DashboardNextRoleConfig } from '../config/roles'
import { DashboardSection } from './DashboardSection'
import { DashboardShell } from './DashboardShell'

export interface RoleScaffoldPageProps {
  role: DashboardNextRoleConfig
}

/** Thin placeholder until the role dashboard is fully composed. */
export function RoleScaffoldPage({ role }: RoleScaffoldPageProps) {
  return (
    <DashboardShell
      badge="Next"
      title={role.title}
      subtitle={role.description}
      empty={false}
    >
      <DashboardSection card>
        <EmptyState
          variant="no-data"
          title="Coming soon"
          description={`${role.label} is scaffolded on the Dashboard Next foundation and will be composed in a later phase.`}
        />
      </DashboardSection>
    </DashboardShell>
  )
}
