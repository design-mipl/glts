import { Box, Grid, Stack, Typography, Avatar, LinearProgress } from '@mui/material'
import { FileText, Upload, CheckCircle2, ArrowRight, Plus, Bell, Plane, AlertTriangle, Ship } from 'lucide-react'
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
  const { base, session, contactName } = useCustomerPortalBase()
  const dashboard = customerPortalService.getDashboard()
  const applications = dashboard.applications
  const isMarinePortal = dashboard.isMarinePortal
  const marineVariant = isMarinePortal ? getBusinessDashboardVariant(session?.customerType) : null
  const colors = usePublicBrandColors()

  return (
    <Box>
      <CustomerPageHeader
        prominent
        title={`${greeting()}, ${contactName.split(' ')[0]}.`}
        subtitle={
          isMarinePortal
            ? marineVariant?.subtitle ?? 'Track crew visas, vessel assignments, and pending corrections from one place.'
            : 'Track active visa work, complete pending actions, and start new applications from one place.'
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
          <Stack spacing={2}>
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

            <CustomerCard
              title={isMarinePortal ? 'Active crew' : 'Active journeys'}
              subtitle={
                isMarinePortal
                  ? 'Quick follow-up by passenger, vessel, and travel date'
                  : 'A card-led view for quick B2B follow-up'
              }
              icon={isMarinePortal ? Ship : Plane}
            >
              <Grid container spacing={1.5}>
                {applications.map(app => (
                  <Grid size={{ xs: 12, md: 4 }} key={app.id}>
                    <Box
                      onClick={() => navigate(`${base}/applications/${app.id}`)}
                      sx={{
                        p: 2,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '14px',
                        bgcolor: colors.surface,
                        cursor: 'pointer',
                        height: '100%',
                        '&:hover': { borderColor: colors.greenBright },
                      }}
                    >
                      {isMarinePortal ? (
                        <>
                          <Ship size={22} color={colors.greenDark} />
                          <Typography sx={{ mt: 1, fontSize: 14, fontWeight: 800, color: colors.navy }}>
                            {app.passengerName ?? 'Applicant'}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600 }}>
                            {app.vesselName ?? '—'}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                            {app.rank ?? '—'} · Travel {app.travelDate}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography sx={{ fontSize: 28, lineHeight: 1 }}>{app.countryFlag}</Typography>
                          <Typography sx={{ mt: 1, fontSize: 14, fontWeight: 800, color: colors.navy }}>{app.country}</Typography>
                          <Typography sx={{ fontSize: 12, color: colors.textMuted }}>{app.id}</Typography>
                        </>
                      )}
                      <LinearProgress variant="determinate" value={app.progress ?? 0} sx={{ mt: 1.5, height: 6, borderRadius: 99 }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.25 }}>
                        <CustomerStatusChip label={app.statusLabel} tone={getCustomerStatusTone(app.statusLabel)} />
                        <Typography sx={{ fontSize: 11, color: colors.textMuted }}>ETA {app.eta}</Typography>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CustomerCard>
          </Stack>
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

            <CustomerCard title="Quick actions" icon={CheckCircle2}>
              <Stack spacing={1}>
                {[
                  { label: 'Create application', icon: FileText, action: () => navigateToCreateApplication(navigate, base) },
                  { label: 'Upload documents', icon: Upload, path: '/documents' },
                  { label: 'Track application', icon: CheckCircle2, path: '/tracking' },
                ].map(({ label, icon: Icon, path, action }) => (
                  <Button
                    key={label}
                    variant="outlined"
                    fullWidth
                    startIcon={<Icon size={16} />}
                    onClick={() => (action ? action() : navigate(`${base}${path}`))}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {label}
                  </Button>
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

            <CustomerCard tone="info">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar sx={{ width: 36, height: 36, bgcolor: colors.navy, fontSize: 12, fontWeight: 900 }}>
                  {contactName
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.navy }}>{contactName}</Typography>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>{session?.email ?? 'Signed-in customer'}</Typography>
                </Box>
              </Stack>
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
