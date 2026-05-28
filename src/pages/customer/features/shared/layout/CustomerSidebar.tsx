import { Box, Typography, List, ListItemButton, Drawer, Divider, IconButton, useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Bell,
  LifeBuoy,
  Users,
  Building2,
  Ship,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { clearSession, loadSession } from '@/shared/auth/session'
import { getBusinessDashboardVariant } from '@/shared/auth/dashboardConfig'
import { useCustomerPortalBase } from '../hooks/useCustomerPortalBase'

export const CUSTOMER_SIDEBAR_WIDTH = 240
const TOPBAR_HEIGHT = 56

const coreNavItems = [
  { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'profile', label: 'Profile & account', icon: Building2 },
  { path: 'applications', label: 'Application management', icon: FileText },
  { path: 'tracking', label: 'Tracking', icon: MapPin },
]

const adminNavItem = { path: 'bookers', label: 'Booker management', icon: Users }

const footerNavItems = [
  { path: 'notifications', label: 'Notifications', icon: Bell },
  { path: 'support', label: 'Support', icon: LifeBuoy },
]

const marineNavItem = { path: 'marine/crew', label: 'Crew upload', icon: Ship }

interface CustomerSidebarProps {
  mobile?: boolean
  open?: boolean
  onClose?: () => void
}

function SidebarNav({
  basePath,
  items,
  onNavigate,
}: {
  basePath: string
  items: Array<{ path: string; label: string; icon: typeof LayoutDashboard }>
  onNavigate?: () => void
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const colors = usePublicBrandColors()

  return (
    <List disablePadding sx={{ width: '100%', px: 1, py: 0.5 }}>
      {items.map(({ path, label, icon: Icon }) => {
        const full = `${basePath}/${path}`
        const active = location.pathname.includes(full)
        return (
          <ListItemButton
            key={path}
            onClick={() => {
              navigate(full)
              onNavigate?.()
            }}
            sx={{
              width: '100%',
              borderRadius: '8px',
              py: 1,
              px: 1.5,
              mb: 0.25,
              bgcolor: active ? colors.greenBright : 'transparent',
              color: active ? colors.white : colors.textSecondary,
              transition: 'background-color 150ms ease, color 150ms ease',
              '&:hover': {
                bgcolor: active ? colors.greenBright : colors.greenMuted,
                color: active ? colors.white : colors.navy,
              },
            }}
          >
            <Icon size={18} color={active ? colors.white : colors.textSecondary} strokeWidth={1.75} />
            <Typography
              sx={{
                ml: 1.5,
                flex: 1,
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                color: 'inherit',
              }}
            >
              {label}
            </Typography>
          </ListItemButton>
        )
      })}
    </List>
  )
}

function SidebarPanel({
  onNavigate,
  onClose,
  fullWidth,
}: {
  onNavigate?: () => void
  onClose?: () => void
  fullWidth?: boolean
}) {
  const navigate = useNavigate()
  const { base, isBusiness, isAdmin } = useCustomerPortalBase()
  const session = loadSession()
  const colors = usePublicBrandColors()
  const showMarine = isBusiness && getBusinessDashboardVariant(session?.customerType).showMarineNav

  const navItems = [
    ...coreNavItems.slice(0, 3),
    ...(showMarine ? [marineNavItem] : []),
    ...coreNavItems.slice(3),
    ...(isAdmin && isBusiness ? [adminNavItem] : []),
  ]

  const handleLogout = () => {
    clearSession()
    onClose?.()
    navigate(isBusiness ? '/sign-in/business' : '/', { replace: true })
  }

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : CUSTOMER_SIDEBAR_WIDTH,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.white,
        borderRight: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: TOPBAR_HEIGHT,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          borderBottom: `1px solid ${colors.border}`,
          gap: 1,
        }}
      >
        <Box component="img" src="/greenlight_logo.jpg" alt="Greenlight Travel Solutions" sx={{ height: 28, maxWidth: 160 }} />
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close navigation"
            sx={{ color: colors.textSecondary }}
          >
            <ChevronLeft size={18} />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(15, 23, 42, 0.12)',
            borderRadius: 2,
          },
        }}
      >
        <SidebarNav basePath={base} items={navItems} onNavigate={onNavigate} />
      </Box>

      <Box sx={{ width: '100%', flexShrink: 0, borderTop: `1px solid ${colors.border}`, py: 0.5 }}>
        <SidebarNav basePath={base} items={footerNavItems} onNavigate={onNavigate} />
        <Divider sx={{ mx: 1.5, my: 0.5 }} />
        <List disablePadding sx={{ width: '100%', px: 1, pb: 1 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              width: '100%',
              borderRadius: '8px',
              py: 1,
              px: 1.5,
              color: colors.textSecondary,
              '&:hover': { bgcolor: colors.greenMuted, color: colors.navy },
            }}
          >
            <LogOut size={18} color={colors.textSecondary} strokeWidth={1.75} />
            <Typography sx={{ ml: 1.5, flex: 1, fontSize: '13px', fontWeight: 500, color: 'inherit' }}>
              Log out
            </Typography>
          </ListItemButton>
        </List>
      </Box>
    </Box>
  )
}

export function CustomerSidebar({ mobile, open, onClose }: CustomerSidebarProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()

  if (mobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiBackdrop-root': { bgcolor: 'rgba(0, 0, 0, 0.35)' },
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '100%',
            height: '100vh',
            border: 'none',
            boxSizing: 'border-box',
            bgcolor: colors.white,
            [theme.breakpoints.up('sm')]: {
              width: CUSTOMER_SIDEBAR_WIDTH,
              maxWidth: CUSTOMER_SIDEBAR_WIDTH,
            },
          },
        }}
      >
        <SidebarPanel onNavigate={onClose} onClose={onClose} fullWidth />
      </Drawer>
    )
  }

  return <SidebarPanel />
}
