import { Box, Drawer, IconButton, Tooltip } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ChevronLeft } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { GreenlightLogoCollapsed, GreenlightLogoExpanded } from '@/components/brand/GreenlightLogo'
import { renderNavConfig } from '@/design-system/UIComponents'
import {
  PORTAL_SIDEBAR_COLLAPSED_WIDTH,
  PORTAL_SIDEBAR_WIDTH,
  PORTAL_TOPBAR_HEIGHT,
} from '@/shared/theme/portalChromeLayout'
import { useCustomerPortalBase } from '../hooks/useCustomerPortalBase'
import { buildCustomerFooterNavConfig, buildCustomerNavConfig } from '../config/customerNav'

/** @deprecated Use PORTAL_SIDEBAR_WIDTH — kept for import stability. */
export const CUSTOMER_SIDEBAR_WIDTH = PORTAL_SIDEBAR_WIDTH

interface CustomerSidebarProps {
  mobile?: boolean
  open?: boolean
  onClose?: () => void
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

function SidebarPanel({
  onNavigate,
  onClose,
  fullWidth,
  collapsed = false,
  onCollapse,
}: {
  onNavigate?: () => void
  onClose?: () => void
  fullWidth?: boolean
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}) {
  const theme = useTheme()
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
  const isCollapsed = Boolean(collapsed) && !fullWidth
  const panelWidth = fullWidth
    ? '100%'
    : isCollapsed
      ? PORTAL_SIDEBAR_COLLAPSED_WIDTH
      : PORTAL_SIDEBAR_WIDTH

  const handleNavClick = () => {
    onNavigate?.()
  }

  return (
    <Box
      sx={{
        width: panelWidth,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: navigation.background,
        color: navigation.textPrimary,
        borderRight: `1px solid ${navigation.border}`,
        overflow: 'hidden',
        transition: fullWidth ? undefined : 'width 200ms ease',
      }}
    >
      {!isCollapsed ? (
        <Box
          sx={{
            height: PORTAL_TOPBAR_HEIGHT,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '12px',
            borderBottom: `1px solid ${navigation.border}`,
            gap: 1,
          }}
        >
          <GreenlightLogoExpanded />
          {(onCollapse || onClose) && (
            <IconButton
              size="small"
              onClick={() => {
                if (onCollapse) onCollapse(true)
                else onClose?.()
              }}
              aria-label={onCollapse ? 'Collapse navigation' : 'Close navigation'}
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
      ) : (
        <Tooltip title="Expand sidebar" placement="right">
          <Box
            onClick={() => onCollapse?.(false)}
            role="button"
            tabIndex={0}
            aria-label="Expand navigation"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onCollapse?.(false)
              }
            }}
            sx={{
              height: PORTAL_TOPBAR_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderBottom: `1px solid ${navigation.border}`,
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
              '&:hover': {
                background: navigation.hover,
              },
            }}
          >
            <GreenlightLogoCollapsed />
          </Box>
        </Tooltip>
      )}

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
        {renderNavConfig(navConfig, isCollapsed, currentPath)}
      </Box>

      <Box sx={{ width: '100%', flexShrink: 0, borderTop: `1px solid ${navigation.border}`, py: '8px' }}>
        <Box onClick={handleNavClick}>{renderNavConfig(footerNavConfig, isCollapsed, currentPath)}</Box>
      </Box>
    </Box>
  )
}

export function CustomerSidebar({
  mobile,
  open,
  onClose,
  collapsed = false,
  onCollapse,
}: CustomerSidebarProps) {
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
              width: PORTAL_SIDEBAR_WIDTH,
              maxWidth: PORTAL_SIDEBAR_WIDTH,
            },
          },
        }}
      >
        <SidebarPanel onNavigate={onClose} onClose={onClose} fullWidth />
      </Drawer>
    )
  }

  return <SidebarPanel collapsed={collapsed} onCollapse={onCollapse} />
}
