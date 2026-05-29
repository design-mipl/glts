import { useEffect, useState } from 'react'
import { Box, Typography, List, ListItemButton, Drawer, Divider, IconButton, Collapse, useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Bell,
  LifeBuoy,
  Users,
  Building2,
  Database,
  LogOut,
  ChevronLeft,
  ChevronDown,
  UserCog,
} from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { clearSession } from '@/shared/auth/session'
import { useCustomerPortalBase } from '../hooks/useCustomerPortalBase'

export const CUSTOMER_SIDEBAR_WIDTH = 240
const TOPBAR_HEIGHT = 56

type NavIcon = typeof LayoutDashboard

interface NavItem {
  path: string
  label: string
  icon: NavIcon
}

const footerNavItems: NavItem[] = [
  { path: 'notifications', label: 'Notifications', icon: Bell },
  { path: 'support', label: 'Support', icon: LifeBuoy },
]

const mastersSubItems: NavItem[] = [
  { path: 'masters/entities', label: 'Entity master', icon: Building2 },
  { path: 'masters/vessels', label: 'Vessel master', icon: Database },
]

interface CustomerSidebarProps {
  mobile?: boolean
  open?: boolean
  onClose?: () => void
}

function SidebarNav({
  basePath,
  items,
  onNavigate,
  indent = false,
}: {
  basePath: string
  items: NavItem[]
  onNavigate?: () => void
  indent?: boolean
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
              pl: indent ? 3 : 1.5,
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
            <Icon size={indent ? 16 : 18} color={active ? colors.white : colors.textSecondary} strokeWidth={1.75} />
            <Typography
              sx={{
                ml: 1.5,
                flex: 1,
                fontSize: indent ? '12px' : '13px',
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

function UserManagementNavGroup({
  basePath,
  onNavigate,
  expanded,
  onToggle,
  showAdminManagement,
}: {
  basePath: string
  onNavigate?: () => void
  expanded: boolean
  onToggle: () => void
  showAdminManagement: boolean
}) {
  const location = useLocation()
  const colors = usePublicBrandColors()
  const isUserMgmtActive = location.pathname.includes(`${basePath}/users/`)

  const userMgmtSubItems: NavItem[] = [
    ...(showAdminManagement ? [{ path: 'users/admins', label: 'Admin management', icon: UserCog }] : []),
    { path: 'users/bookers', label: 'Booker management', icon: Users },
  ]

  return (
    <Box sx={{ px: 1, mb: 0.25 }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          width: '100%',
          borderRadius: '8px',
          py: 1,
          px: 1.5,
          bgcolor: isUserMgmtActive ? colors.greenBright : 'transparent',
          color: isUserMgmtActive ? colors.white : colors.textSecondary,
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover': {
            bgcolor: isUserMgmtActive ? colors.greenBright : colors.greenMuted,
            color: isUserMgmtActive ? colors.white : colors.navy,
          },
        }}
      >
        <UserCog size={18} color={isUserMgmtActive ? colors.white : colors.textSecondary} strokeWidth={1.75} />
        <Typography
          sx={{
            ml: 1.5,
            flex: 1,
            fontSize: '13px',
            fontWeight: isUserMgmtActive ? 600 : 500,
            color: 'inherit',
          }}
        >
          User management
        </Typography>
        <ChevronDown
          size={14}
          color={isUserMgmtActive ? colors.white : colors.textSecondary}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </ListItemButton>
      <Collapse in={expanded}>
        <SidebarNav basePath={basePath} items={userMgmtSubItems} onNavigate={onNavigate} indent />
      </Collapse>
    </Box>
  )
}

function MastersNavGroup({
  basePath,
  onNavigate,
  expanded,
  onToggle,
}: {
  basePath: string
  onNavigate?: () => void
  expanded: boolean
  onToggle: () => void
}) {
  const location = useLocation()
  const colors = usePublicBrandColors()
  const isMastersActive = location.pathname.includes(`${basePath}/masters/`)

  return (
    <Box sx={{ px: 1, mb: 0.25 }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          width: '100%',
          borderRadius: '8px',
          py: 1,
          px: 1.5,
          bgcolor: isMastersActive ? colors.greenBright : 'transparent',
          color: isMastersActive ? colors.white : colors.textSecondary,
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover': {
            bgcolor: isMastersActive ? colors.greenBright : colors.greenMuted,
            color: isMastersActive ? colors.white : colors.navy,
          },
        }}
      >
        <Database size={18} color={isMastersActive ? colors.white : colors.textSecondary} strokeWidth={1.75} />
        <Typography
          sx={{
            ml: 1.5,
            flex: 1,
            fontSize: '13px',
            fontWeight: isMastersActive ? 600 : 500,
            color: 'inherit',
          }}
        >
          Masters
        </Typography>
        <ChevronDown
          size={14}
          color={isMastersActive ? colors.white : colors.textSecondary}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </ListItemButton>
      <Collapse in={expanded}>
        <SidebarNav basePath={basePath} items={mastersSubItems} onNavigate={onNavigate} indent />
      </Collapse>
    </Box>
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
  const location = useLocation()
  const { base, isBusiness, canAccessUserManagement, canAccessAdminManagement, canAccessMasters } =
    useCustomerPortalBase()
  const colors = usePublicBrandColors()
  const showBusinessNav = isBusiness

  const [userMgmtExpanded, setUserMgmtExpanded] = useState(() =>
    location.pathname.includes(`${base}/users/`),
  )
  const [mastersExpanded, setMastersExpanded] = useState(() =>
    location.pathname.includes(`${base}/masters/`),
  )

  useEffect(() => {
    if (location.pathname.includes(`${base}/users/`)) {
      setUserMgmtExpanded(true)
    }
  }, [location.pathname, base])

  useEffect(() => {
    if (location.pathname.includes(`${base}/masters/`)) {
      setMastersExpanded(true)
    }
  }, [location.pathname, base])

  const primaryNavItems: NavItem[] = [
    { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: 'profile', label: 'Profile details', icon: Building2 },
    { path: 'applications', label: 'Application management', icon: FileText },
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
          <IconButton size="small" onClick={onClose} aria-label="Close navigation" sx={{ color: colors.textSecondary }}>
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
        <SidebarNav basePath={base} items={primaryNavItems} onNavigate={onNavigate} />
        {showBusinessNav && canAccessUserManagement && (
          <UserManagementNavGroup
            basePath={base}
            onNavigate={onNavigate}
            expanded={userMgmtExpanded}
            onToggle={() => setUserMgmtExpanded(e => !e)}
            showAdminManagement={canAccessAdminManagement}
          />
        )}
        {showBusinessNav && canAccessMasters && (
          <MastersNavGroup
            basePath={base}
            onNavigate={onNavigate}
            expanded={mastersExpanded}
            onToggle={() => setMastersExpanded(e => !e)}
          />
        )}
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
