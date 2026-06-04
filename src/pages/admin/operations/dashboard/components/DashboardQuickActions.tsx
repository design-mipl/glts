import { Box, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  FileUp,
  FileText,
  Receipt,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import { ActionCard, BaseCard, useToast } from '@/design-system/UIComponents'

interface QuickActionDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href?: string
  fallbackMessage?: string
}

const QUICK_ACTIONS: QuickActionDef[] = [
  {
    id: 'create_application',
    title: 'Create Application',
    description: 'Start a new marine application',
    icon: FileText,
    href: '/admin/application-management/marine/new',
  },
  {
    id: 'generate_invoice',
    title: 'Generate Invoice',
    description: 'Open billing workspace',
    icon: Receipt,
    href: '/admin/finance/invoices',
  },
  {
    id: 'add_customer',
    title: 'Add Customer',
    description: 'Corporate account onboarding',
    icon: UserPlus,
    href: '/admin/customer-accounts/corporate-accounts/new',
  },
  {
    id: 'upload_documents',
    title: 'Upload Documents',
    description: 'Document verification queue',
    icon: FileUp,
    fallbackMessage: 'Document upload opens from application detail.',
  },
  {
    id: 'schedule_appointment',
    title: 'Schedule Appointment',
    description: 'VAC and biometric slots',
    icon: Calendar,
    fallbackMessage: 'Appointment scheduling opens from application detail.',
  },
]

export function DashboardQuickActions() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleAction = (action: QuickActionDef) => {
    if (action.href) {
      navigate(action.href, action.id === 'create_application' ? { state: { freshStart: true } } : undefined)
      return
    }
    showToast({ title: action.fallbackMessage ?? 'Action not available yet.', variant: 'info' })
  }

  return (
    <BaseCard>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Quick actions
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Common operational tasks
        </Typography>
      </Box>
      <Grid container spacing={1.5} sx={{ px: 2, pb: 2 }}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Grid key={action.id} size={{ xs: 12, sm: 6 }}>
              <ActionCard
                title={action.title}
                description={action.description}
                icon={<Icon size={18} />}
                onClick={() => handleAction(action)}
              />
            </Grid>
          )
        })}
      </Grid>
    </BaseCard>
  )
}
