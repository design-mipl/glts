import { Box, Grid, Stack, Typography } from '@mui/material'
import { FileText, CheckCircle2, ArrowRight, Plus, Bell, Plane, AlertTriangle, Ship } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getBusinessDashboardVariant } from '@/shared/auth/dashboardConfig'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { navigateToCreateApplication } from '@/pages/customer/features/applications/utils/createApplicationNavigation'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { formatMarineDashboardDescription } from '../utils/marineDashboardUtils'
import type { CustomerApplication } from '../../../data/mockData'
import {
  CustomerActionPanel,
  CustomerCard,
  CustomerEmptyState,
  CustomerPageHeader,
  CustomerStatusChip,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { GLTS_NOTIFICATION_IDS } from '../../../data/portalIds'
import { customerFinanceService } from '@/shared/services/customerFinanceService'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function applicationPanelTitle(app: CustomerApplication, isMarinePortal: boolean): string {
  if (isMarinePortal) {
    return app.passengerName ?? (app.applicantCount > 1 ? `${app.applicantCount} crew members` : 'Applicant')
  }
  return `${app.countryFlag ?? ''} ${app.country} · ${app.visaType}`
}

function applicationPanelDescription(app: CustomerApplication, isMarinePortal: boolean): string {
  if (isMarinePortal) {
    return formatMarineDashboardDescription(app)
  }
  return `${app.id} · ${app.applicantCount} applicant${app.applicantCount === 1 ? '' : 's'} · Travel ${app.travelDate}`
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { base, session, contactName, isBusiness, customerType } = useCustomerPortalBase()
  const dashboard = customerPortalService.getDashboard()
  const applications = dashboard.applications
  const isMarinePortal = dashboard.isMarinePortal
  const variant = isBusiness ? getBusinessDashboardVariant(customerType ?? session?.customerType) : null
  const colors = usePublicBrandColors()

  return (
    <Box>
      <CustomerPageHeader
        prominent
        title={`${greeting()}, ${contactName.split(' ')[0]}.`}
        subtitle={
          variant?.subtitle ??
          (isMarinePortal
            ? 'Track crew visas, vessel assignments, and pending corrections from one place.'
            : 'Track active visa work, complete pending actions, and start new applications from one place.')
        }
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => navigateToCreateApplication(navigate, base)}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            New application
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {dashboard.kpis.map(({ label, value, sub, tone }) => {
          const iconMap = { indigo: Plane, amber: AlertTriangle, blue: FileText, green: CheckCircle2 }
          const toneMap = { indigo: 'info', amber: 'warning', blue: 'info', green: 'success' } as const
          const Icon = iconMap[tone]
          return (
            <Grid size={{ xs: 6, md: 3 }} key={label}>
              <CustomerCard tone={toneMap[tone]} sx={{ height: '100%' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: colors.greenMuted,
                      color: colors.greenDark,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 900, color: colors.navy, lineHeight: 1 }}>
                      {value}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>{label}</Typography>
                    {sub && <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{sub}</Typography>}
                  </Box>
                </Stack>
              </CustomerCard>
            </Grid>
          )
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <CustomerCard
            title={isMarinePortal ? 'Recent crew applications' : 'Recent applications'}
            subtitle={
              isMarinePortal
                ? 'Passenger, vessel, rank, and travel date for your latest crew work'
                : 'Most recent visa work across single and bulk requests'
            }
            icon={isMarinePortal ? Ship : FileText}
            action={
              <Button variant="text" endIcon={<ArrowRight size={14} />} onClick={() => navigate(`${base}/applications`)}>
                View all
              </Button>
            }
          >
            {applications.length === 0 ? (
              <CustomerEmptyState
                title="No applications yet"
                description="Start a visa application and it will appear here for tracking."
                actionLabel="Create application"
                onAction={() => navigateToCreateApplication(navigate, base)}
              />
            ) : (
              <Stack spacing={1.25}>
                {applications.map(app => (
                  <CustomerActionPanel
                    key={app.id}
                    title={applicationPanelTitle(app, isMarinePortal)}
                    description={applicationPanelDescription(app, isMarinePortal)}
                    progress={app.progress}
                    action={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CustomerStatusChip label={app.statusLabel} tone={getCustomerStatusTone(app.statusLabel)} />
                        <Button variant="outlined" onClick={() => navigate(`${base}/applications/${app.id}`)}>
                          Track
                        </Button>
                      </Stack>
                    }
                  />
                ))}
              </Stack>
            )}
          </CustomerCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2}>
            <CustomerCard title="Pending actions" subtitle="Items that need customer input" icon={AlertTriangle} tone="warning">
              <Stack spacing={1}>
                {dashboard.pendingActions.map(action => (
                  <CustomerActionPanel
                    key={action.id}
                    title={action.title}
                    description={action.description}
                    action={
                      <Button
                        variant={action.urgent ? 'contained' : 'outlined'}
                        onClick={() =>
                          action.applicationId
                            ? navigate(`${base}/applications/${action.applicationId}`)
                            : navigate(`${base}/documents`)
                        }
                      >
                        {action.cta}
                      </Button>
                    }
                  />
                ))}
              </Stack>
            </CustomerCard>

            <CustomerCard
              title="Notifications"
              icon={Bell}
              action={<Button variant="text" onClick={() => navigate(`${base}/notifications`)}>View all</Button>}
            >
              <Stack spacing={1.25}>
                {dashboard.notifications.map(n => (
                  <Box
                    key={n.id}
                    sx={{
                      opacity: n.read ? 0.7 : 1,
                      cursor: n.id === GLTS_NOTIFICATION_IDS.invoice ? 'pointer' : 'default',
                      '&:hover': n.id === GLTS_NOTIFICATION_IDS.invoice ? { opacity: 1 } : undefined,
                    }}
                    onClick={() => {
                      if (n.id !== GLTS_NOTIFICATION_IDS.invoice) return
                      const inv = customerFinanceService
                        .listSessionInvoices()
                        .find(i => i.invoiceId.includes('8821'))
                      if (inv) navigate(`${base}/finance/invoices/${inv.id}`)
                      else navigate(`${base}/finance/invoices`)
                    }}
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: n.read ? 600 : 800, color: colors.navy }}>{n.title}</Typography>
                    <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{n.time}</Typography>
                  </Box>
                ))}
              </Stack>
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
