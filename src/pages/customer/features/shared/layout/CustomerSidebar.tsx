import { Box, Drawer, IconButton } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ChevronLeft, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavItem, renderNavConfig } from '@/design-system/UIComponents'
import { clearSession } from '@/shared/auth/session'
import { useCustomerPortalBase } from '../hooks/useCustomerPortalBase'
import { buildCustomerFooterNavConfig, buildCustomerNavConfig } from '../config/customerNav'

export const CUSTOMER_SIDEBAR_WIDTH = 240
const TOPBAR_HEIGHT = 56

interface CustomerSidebarProps {
  mobile?: boolean
  open?: boolean
  onClose?: () => void
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
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const navigation = theme.foundation.navigation
  const {
    base,
    isBusiness,
    canAccessAdminManagement,
    canAccessBookerManagement,
    canAccessMasters,
  } = useCustomerPortalBase()

  const navConfig = buildCustomerNavConfig({
    base,
    isBusiness,
    canAccessAdminManagement,
    canAccessBookerManagement,
    canAccessMasters,
  })
  const footerNavConfig = buildCustomerFooterNavConfig(base)
  const currentPath = location.pathname

  const handleLogout = () => {
    clearSession()
    onClose?.()
    navigate(isBusiness ? '/sign-in/business' : '/', { replace: true })
  }

  const handleNavClick = () => {
    onNavigate?.()
  }

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : CUSTOMER_SIDEBAR_WIDTH,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: navigation.background,
        color: navigation.textPrimary,
        borderRight: `1px solid ${navigation.border}`,
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
          px: '12px',
          borderBottom: `1px solid ${navigation.border}`,
          gap: 1,
        }}
      >
        <Box
          component="img"
          src="/greenlight_logo.jpg"
          alt="Greenlight Travel Solutions"
          sx={{ height: 28, maxWidth: 160 }}
        />
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close navigation"
            sx={{
              width: 28,
              height: 28,
              color: navigation.textSecondary,
              '&:hover': {
                color: navigation.textPrimary,
                bgcolor: navigation.hover,
              },
            }}
          >
            <ChevronLeft size={16} />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          py: '8px',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'transparent',
            borderRadius: '2px',
            transition: 'background-color 200ms',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            bgcolor: alpha(navigation.textPrimary, 0.18),
          },
        }}
        onClick={handleNavClick}
      >
        {renderNavConfig(navConfig, false, currentPath)}
      </Box>

      <Box sx={{ width: '100%', flexShrink: 0, borderTop: `1px solid ${navigation.border}`, py: '8px' }}>
        <Box onClick={handleNavClick}>{renderNavConfig(footerNavConfig, false, currentPath)}</Box>
        <Box sx={{ px: '8px', pt: '4px' }}>
          <NavItem
            label="Log out"
            icon={<LogOut size={16} strokeWidth={1.75} />}
            onClick={handleLogout}
            collapsed={false}
          />
        </Box>
      </Box>
    </Box>
  )
}

export function CustomerSidebar({ mobile, open, onClose }: CustomerSidebarProps) {
  const theme = useTheme()

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
            bgcolor: (t) => t.foundation.navigation.background,
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
