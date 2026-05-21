import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Stack,
  Avatar,
  Divider,
  useMediaQuery,
  Drawer,
  IconButton,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  LayoutDashboard,
  FileText,
  AlertCircle,
  Users,
  FolderOpen,
  CreditCard,
  Clock,
  CheckCircle,
  ArrowRight,
  Upload,
  MessageCircle,
  Home,
  Menu,
  X,
  Bell,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import {
  publicColors,
  publicFonts,
  publicShadows,
  primaryButtonSx,
} from '../../../shared/theme/publicBrand'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: FileText, label: 'Applications', badge: null },
  { icon: AlertCircle, label: 'Action center', badge: '2', badgeColor: '#EF4444' },
  { icon: Users, label: 'Travelers', badge: null },
  { icon: FolderOpen, label: 'Documents', badge: null },
  { icon: CreditCard, label: 'Payments', badge: null },
  { icon: Clock, label: 'Travel history', badge: null },
  { icon: Star, label: 'Recommendations', badge: null },
]

const applications = [
  {
    id: 'APP-9923-847',
    country: '🇫🇷',
    dest: 'Schengen',
    type: 'Embassy review',
    subtype: 'Tourist · Type C',
    eta: '8 days',
    status: 'In Progress',
    statusColor: '#EEF2FF',
    statusText: '#4F46E5',
    score: 92,
  },
  {
    id: 'APP-9923-901',
    country: '🇯🇵',
    dest: 'Japan',
    type: 'Photo upload',
    subtype: 'eVisa · Tourist',
    eta: '4 days',
    status: 'Action needed',
    statusColor: '#FEF3C7',
    statusText: '#92400E',
    score: 88,
  },
  {
    id: 'APP-9923-712',
    country: '🇦🇪',
    dest: 'UAE',
    type: 'Approved',
    subtype: 'eVisa · 30-day',
    eta: '—',
    status: 'Approved',
    statusColor: '#D1FAE5',
    statusText: '#065F46',
    score: 96,
  },
]

const actionItems = [
  {
    title: 'Upload bank statements',
    desc: 'Schengen · Type C · due Mar 14',
    cta: 'Upload',
    Icon: Upload,
    color: '#4F46E5',
    bg: '#EEF2FF',
    urgent: true,
  },
  {
    title: 'Take new photo',
    desc: 'Japan eVisa — rejected, resolution too low',
    cta: 'Retake',
    Icon: AlertCircle,
    color: '#D97706',
    bg: '#FEF3C7',
    urgent: true,
  },
  {
    title: 'Confirm Mumbai biometrics slot',
    desc: 'VFS · Mar 18 · 11:00am',
    cta: 'Confirm',
    Icon: CheckCircle,
    color: '#10B981',
    bg: '#D1FAE5',
    urgent: false,
  },
]

const travelers = [
  { initials: 'PW', name: 'Priya Walker', role: 'You · primary', visas: 'SCH · JPN · UAE' },
  { initials: 'JW', name: 'Jamie Walker', role: 'Spouse', visas: 'SCH · UAE' },
  { initials: 'AW', name: 'Arav Walker', role: 'Child · 7y', visas: 'SCH' },
]

const documents = [
  { name: 'Passport · Priya', status: 'Expires 2032', statusColor: '#10B981' },
  { name: 'Passport · Jamie', status: 'Expires 2028', statusColor: '#10B981' },
  { name: 'Bank statements', status: 'Updated 2d ago', statusColor: '#6B7280' },
  { name: 'Travel insurance', status: 'Booked via Allianz', statusColor: '#6B7280' },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${publicColors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Box component="img" src="/sm_logo.jpg" alt="" sx={{ height: 32, mb: 1.5, borderRadius: '8px' }} />
          <Typography sx={{ fontWeight: 800, fontFamily: publicFonts.heading, color: publicColors.navy, fontSize: '15px' }}>
            WORKSPACE
          </Typography>
          <Typography sx={{ fontSize: '13px', color: publicColors.textMuted }}>Walker household</Typography>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={onClose}><X size={16} /></IconButton>
        )}
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto' }}>
        {navItems.map(({ icon: Icon, label, badge, badgeColor, active }) => (
          <Box
            key={label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1.1,
              mx: 1,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: active ? '#F0FDF4' : 'transparent',
              '&:hover': { backgroundColor: active ? '#F0FDF4' : '#F9FAFB' },
              mb: 0.25,
            }}
          >
            <Icon size={16} color={active ? '#10B981' : '#6B7280'} />
            <Typography
              sx={{
                fontSize: '13.5px',
                fontWeight: active ? 700 : 500,
                color: active ? '#065F46' : '#374151',
                flex: 1,
              }}
            >
              {label}
            </Typography>
            {badge && (
              <Box
                sx={{
                  backgroundColor: badgeColor || '#10B981',
                  color: '#fff',
                  borderRadius: '999px',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                {badge}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Support CTA */}
      <Box sx={{ p: 2.5, borderTop: '1px solid #F3F4F6' }}>
        <Box
          sx={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '10px',
            p: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <MessageCircle size={14} color="#10B981" />
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#065F46' }}>Talk to a visa expert</Typography>
          </Box>
          <Typography sx={{ fontSize: '11px', color: '#6B7280', mb: 1 }}>Avg wait · 90 sec</Typography>
          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{ ...primaryButtonSx, fontSize: '13px', py: 1 }}
          >
            Start chat
          </Button>
        </Box>

        <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: '#9CA3AF', '&:hover': { color: '#374151' } }}>
          <Home size={14} />
          <Typography sx={{ fontSize: '12.5px' }}>Back to website</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export function UserDashboard() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const SIDEBAR_WIDTH = 240

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: publicColors.surface, fontFamily: publicFonts.body }}>
      {/* Sidebar — Desktop */}
      {isDesktop && (
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            backgroundColor: '#fff',
            borderRight: `1px solid ${publicColors.border}`,
            boxShadow: publicShadows.nav,
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Sidebar — Mobile Drawer */}
      {!isDesktop && (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
        >
          <SidebarContent onClose={() => setMobileDrawerOpen(false)} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, ml: isDesktop ? `${SIDEBAR_WIDTH}px` : 0, minWidth: 0 }}>
        {/* Topbar */}
        <Box
          sx={{
            height: 64,
            backgroundColor: '#fff',
            borderBottom: `1px solid ${publicColors.border}`,
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, md: 3 },
            gap: 1.5,
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          {!isDesktop && (
            <IconButton size="small" onClick={() => setMobileDrawerOpen(true)}>
              <Menu size={20} color="#374151" />
            </IconButton>
          )}
          <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '14px', flex: 1 }}>
            Overview
          </Typography>
          <Button
            variant="outlined"
            size="small"
            href="/countries"
            sx={{ borderColor: '#E5E7EB', color: '#374151', fontWeight: 600, fontSize: '12px', textTransform: 'none', borderRadius: '7px' }}
          >
            + New application
          </Button>
          <IconButton size="small">
            <Bell size={18} color="#6B7280" />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: '#001F3F', fontSize: '12px', fontWeight: 700 }}>PW</Avatar>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Welcome */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ color: '#9CA3AF', fontSize: '12px', mb: 0.25 }}>WED · MAR 12 · 9:42 IST</Typography>
            <Typography sx={{ fontWeight: 800, color: '#001F3F', fontSize: { xs: '20px', md: '24px' } }}>
              Good morning, Priya.
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
              You have 2 actions to take before Friday.
            </Typography>
          </Box>

          {/* KPI Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'New application', value: '+1 this week', color: '#EEF2FF', textColor: '#4F46E5' },
              { label: 'Active applications', value: '3', sub: 'avg 9d', color: '#FEF3C7', textColor: '#D97706' },
              { label: 'Awaiting embassy', value: '1', sub: 'by Mar 14', color: '#DBEAFE', textColor: '#1D4ED8' },
              { label: 'Approved this year', value: '7', sub: '+200% vs 2025', color: '#D1FAE5', textColor: '#065F46' },
            ].map(({ label, value, sub, color, textColor }) => (
              <Grid size={{ xs: 6, md: 3 }} key={label}>
                <Card sx={{ p: 2.5, backgroundColor: color, border: 'none', boxShadow: 'none', borderRadius: '12px' }}>
                  <Typography sx={{ fontSize: '24px', fontWeight: 800, color: textColor, lineHeight: 1.1 }}>{value}</Typography>
                  {sub && <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mb: 0.25 }}>{sub}</Typography>}
                  <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 0.5 }}>{label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* Active Applications */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ border: '1px solid #F3F4F6', boxShadow: 'none', borderRadius: '14px', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px' }}>Active applications</Typography>
                  <Button variant="text" endIcon={<ArrowRight size={13} />} sx={{ color: '#10B981', fontSize: '12px', fontWeight: 600, textTransform: 'none', p: 0 }}>
                    All 12
                  </Button>
                </Box>
                <Stack divider={<Divider sx={{ borderColor: '#F9FAFB' }} />}>
                  {applications.map(app => (
                    <Box key={app.id} sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { backgroundColor: '#FAFAFA' } }}>
                      <Typography fontSize="28px">{app.country}</Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                          <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '14px' }}>{app.dest}</Typography>
                          <Box
                            sx={{
                              backgroundColor: app.statusColor,
                              color: app.statusText,
                              fontSize: '10px',
                              fontWeight: 700,
                              px: 1,
                              py: 0.2,
                              borderRadius: '4px',
                            }}
                          >
                            {app.status}
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>
                          {app.id} · {app.subtype}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 0.25 }}>
                          {app.type} · ETA {app.eta}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            backgroundColor: app.score >= 90 ? '#10B981' : app.score >= 75 ? '#F59E0B' : '#EF4444',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px',
                          }}
                        >
                          {app.score}
                        </Box>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: '#10B981', fontWeight: 600, fontSize: '12px', textTransform: 'none', p: 0 }}
                        >
                          Track
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={3}>
                {/* Action Center */}
                <Card sx={{ border: '1px solid #F3F4F6', boxShadow: 'none', borderRadius: '14px', overflow: 'hidden' }}>
                  <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #F3F4F6' }}>
                    <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px' }}>Action center</Typography>
                  </Box>
                  <Stack divider={<Divider sx={{ borderColor: '#F9FAFB' }} />}>
                    {actionItems.map(({ title, desc, cta, Icon, color, bg, urgent }) => (
                      <Box key={title} sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} color={color} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '13px', mb: 0.25 }}>{title}</Typography>
                          <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>{desc}</Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: urgent ? color : '#F3F4F6',
                            color: urgent ? '#fff' : '#374151',
                            fontWeight: 700,
                            fontSize: '11px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            borderRadius: '6px',
                            px: 1.5,
                            flexShrink: 0,
                            '&:hover': { backgroundColor: urgent ? color : '#E5E7EB', opacity: 0.9 },
                          }}
                        >
                          {cta}
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Card>

                {/* Travelers */}
                <Card sx={{ border: '1px solid #F3F4F6', boxShadow: 'none', borderRadius: '14px', overflow: 'hidden' }}>
                  <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px' }}>Saved travelers</Typography>
                    <Button variant="text" size="small" sx={{ color: '#10B981', fontSize: '12px', fontWeight: 600, textTransform: 'none', p: 0 }}>
                      Manage
                    </Button>
                  </Box>
                  <Stack divider={<Divider sx={{ borderColor: '#F9FAFB' }} />}>
                    {travelers.map(({ initials, name, role, visas }) => (
                      <Box key={name} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 34, height: 34, backgroundColor: '#001F3F', fontSize: '12px', fontWeight: 800 }}>{initials}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '13px' }}>{name}</Typography>
                          <Typography sx={{ fontSize: '11.5px', color: '#9CA3AF' }}>{role}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>{visas}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>

                {/* Documents Vault */}
                <Card sx={{ border: '1px solid #F3F4F6', boxShadow: 'none', borderRadius: '14px', overflow: 'hidden' }}>
                  <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px' }}>Documents vault</Typography>
                    <Button variant="text" size="small" sx={{ color: '#10B981', fontSize: '12px', fontWeight: 600, textTransform: 'none', p: 0 }}>
                      Manage
                    </Button>
                  </Box>
                  <Stack divider={<Divider sx={{ borderColor: '#F9FAFB' }} />}>
                    {documents.map(({ name, status, statusColor }) => (
                      <Box key={name} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 30, height: 30, borderRadius: '7px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FolderOpen size={14} color="#9CA3AF" />
                        </Box>
                        <Typography sx={{ flex: 1, fontSize: '13px', color: '#374151', fontWeight: 500 }}>{name}</Typography>
                        <Typography sx={{ fontSize: '11px', color: statusColor, fontWeight: 600 }}>{status}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
