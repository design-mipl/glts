import { Box, Drawer, IconButton, Tooltip, Typography, Stack } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { HelpCircle, ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import NavItem from './NavItem'
import NavGroup from './NavGroup'
import UserProfile from './UserProfile'
import type { UserProfileProps } from './UserProfile'

export interface NavConfig {
  type: 'item' | 'group' | 'divider'
  label?: string
  icon?: ReactNode
  href?: string
  badge?: number | string
  children?: NavConfig[]
  roles?: string[]
}

export interface SidebarProps {
  navConfig: NavConfig[]
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  logo?: ReactNode
  logoCollapsed?: ReactNode
  currentPath?: string
  mobileOpen?: boolean
  onMobileClose?: () => void
  logoMark?: string
  appName?: string
  footerUser?: Pick<UserProfileProps, 'name' | 'email' | 'role' | 'avatarSrc'>
  onSignOut?: () => void
  onProfileClick?: () => void
}

const TOPBAR_HEIGHT = 52

/** Strip trailing slash so `/admin/` and `/admin` compare consistently. */
function normalizeNavPath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

/**
 * Whether a nav href matches the current route.
 * Section links (e.g. agreements listing) stay active on create/edit/detail child paths.
 * `/admin` dashboard href is exact-only so it does not highlight on every admin URL.
 */
export function isNavActive(href: string | undefined, currentPath: string): boolean {
  if (!href) return false

  const hrefNorm = normalizeNavPath(href)
  const pathNorm = normalizeNavPath(currentPath)

  if (pathNorm === hrefNorm) return true

  if (hrefNorm === '/admin') return false

  return pathNorm.startsWith(`${hrefNorm}/`)
}

function isGroupChildActive(children: NavConfig[] | undefined, currentPath: string): boolean {
  if (!children) return false
  return children.some(
    (child) => child.type === 'item' && isNavActive(child.href, currentPath),
  )
}

export function renderNavConfig(
  items: NavConfig[],
  collapsed: boolean,
  currentPath: string,
): ReactNode {
  return items.map((item, i) => {
    if (item.type === 'divider') {
      return (
        <Box
          key={i}
          sx={{
            height: '1px',
            mx: 2,
            my: 1,
            backgroundColor: (t) => alpha(t.foundation.navigation.border, 0.5),
          }}
        />
      )
    }

    if (item.type === 'group') {
      if (item.icon) {
        const groupActive = isGroupChildActive(item.children, currentPath)
        return (
          <NavGroup
            key={i}
            label={item.label ?? ''}
            icon={item.icon}
            collapsed={collapsed}
            badge={typeof item.badge === 'number' ? item.badge : undefined}
            defaultExpanded={groupActive}
            active={groupActive}
          >
            {item.children?.map((child, j) => {
              if (child.type === 'item') {
                return (
                  <NavItem
                    key={j}
                    label={child.label ?? ''}
                    href={child.href}
                    active={isNavActive(child.href, currentPath)}
                    badge={child.badge}
                    depth={1}
                    collapsed={false}
                  />
                )
              }
              return null
            })}
          </NavGroup>
        )
      }
      return (
        <NavGroup key={i} label={item.label ?? ''} collapsed={collapsed}>
          {item.children?.map((child) => renderNavConfig([child], collapsed, currentPath))}
        </NavGroup>
      )
    }

    if (item.type === 'item') {
      return (
        <NavItem
          key={i}
          label={item.label ?? ''}
          icon={item.icon}
          href={item.href}
          active={isNavActive(item.href, currentPath)}
          badge={item.badge}
          collapsed={collapsed}
        />
      )
    }

    return null
  })
}

function DefaultLogoMark({
  logoMark,
}: {
  logoMark: string
}) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: tokens.borderRadius.md,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          color: '#fff',
          fontSize: '12px',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {logoMark}
      </Typography>
    </Box>
  )
}

function SidebarContent({
  navConfig,
  collapsed,
  onCollapse,
  currentPath = '',
  logo,
  logoCollapsed,
  logoMark = 'F',
  appName = 'Foundation',
  footerUser,
  onSignOut,
  onProfileClick,
}: Pick<
  SidebarProps,
  | 'navConfig'
  | 'collapsed'
  | 'onCollapse'
  | 'currentPath'
  | 'logo'
  | 'logoCollapsed'
  | 'logoMark'
  | 'appName'
  | 'footerUser'
  | 'onSignOut'
  | 'onProfileClick'
>) {
  const theme = useTheme()
  const navigation = theme.foundation.navigation
  const collapsedBrand = logoCollapsed ?? logo

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: navigation.background,
        color: navigation.textPrimary,
        borderRight: `1px solid ${navigation.border}`,
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Logo area — 52px to align with topbar */}
      {!collapsed ? (
        <Box
          sx={{
            height: TOPBAR_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '12px',
            flexShrink: 0,
            borderBottom: `1px solid ${navigation.border}`,
            overflow: 'hidden',
            gap: 1.5,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
            {logo ?? <DefaultLogoMark logoMark={logoMark} />}
            {!logo && appName ? (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: navigation.textPrimary,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {appName}
              </Typography>
            ) : null}
          </Stack>

          {/* Collapse button */}
          <IconButton
            onClick={() => onCollapse(true)}
            size="small"
            sx={{
              width: 28,
              height: 28,
              color: navigation.textSecondary,
              flexShrink: 0,
              '&:hover': {
                color: navigation.textPrimary,
                background: navigation.hover,
              },
            }}
          >
            <ChevronLeft size={16} />
          </IconButton>
        </Box>
      ) : (
        <Tooltip title="Expand sidebar" placement="right">
          <Box
            onClick={() => onCollapse(false)}
            sx={{
              height: TOPBAR_HEIGHT,
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
            {collapsedBrand ?? <DefaultLogoMark logoMark={logoMark} />}
          </Box>
        </Tooltip>
      )}

      {/* Nav scroll area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
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
      >
        {renderNavConfig(navConfig, collapsed, currentPath)}
      </Box>

      {/* Bottom — user profile + Help & Docs */}
      <Box sx={{ flexShrink: 0, borderTop: `1px solid ${navigation.border}` }}>
        {footerUser && (
          <UserProfile
            name={footerUser.name}
            email={footerUser.email}
            role={footerUser.role}
            avatarSrc={footerUser.avatarSrc}
            collapsed={collapsed}
            onSignOut={onSignOut}
            onProfileClick={onProfileClick}
          />
        )}
        <Box sx={{ p: '8px' }}>
          <NavItem
            label="Help & Docs"
            icon={<HelpCircle size={16} strokeWidth={1.75} />}
            href="/docs"
            collapsed={collapsed}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
  navConfig,
  onCollapse,
  currentPath,
  logo,
  logoCollapsed,
  logoMark = 'F',
  appName = 'Foundation',
  footerUser,
  onSignOut,
  onProfileClick,
}: SidebarProps) {
  return (
    <>
      {/* Desktop permanent sidebar — managed by AppShell layout */}
      <SidebarContent
        navConfig={navConfig}
        collapsed={collapsed}
        onCollapse={onCollapse}
        currentPath={currentPath}
        logo={logo}
        logoCollapsed={logoCollapsed}
        logoMark={logoMark}
        appName={appName}
        footerUser={footerUser}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
      />

      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            top: 0,
            height: '100%',
            border: 'none',
            boxSizing: 'border-box',
            bgcolor: (theme) => theme.foundation.navigation.background,
          },
        }}
      >
        <SidebarContent
          navConfig={navConfig}
          collapsed={false}
          onCollapse={onCollapse}
          currentPath={currentPath}
          logo={logo}
          logoCollapsed={logoCollapsed}
          logoMark={logoMark}
          appName={appName}
          footerUser={footerUser}
          onSignOut={onSignOut}
          onProfileClick={onProfileClick}
        />
      </Drawer>
    </>
  )
}
