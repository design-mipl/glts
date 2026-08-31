import {
  Box,
  Button,
  Stack,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  InputBase,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Menu, X, Search, User, ArrowRight, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button as DsButton } from '@/design-system/UIComponents'
import { useScrolledHeader } from '../hooks/useScrolledHeader'
import { GREENLIGHT_LOGO_SRC, GREENLIGHT_LOGO_DARK_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '../theme/publicSiteTokens'
import { applyFlow } from '../theme/applyFlowTheme'
import { PublicContainer } from './PublicContainer'
import { clearSession, loadSession } from '@/shared/auth/session'

const NAV_HEIGHT = 72

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/countries' },
  { label: 'Marine', href: '/marine-crew' },
  { label: 'Corporate', href: '/corporate' },
  { label: 'Travel Agents', href: '/#specialist-visa-services' },
  { label: 'Services', href: '/services' },
  { label: 'Extra Services', href: '/extra-services' },
  { label: 'About Us', href: '/about' },
]

function NavLink({
  label,
  href,
  active,
  compact,
}: {
  label: string
  href: string
  active: boolean
  compact?: boolean
}) {
  return (
    <Button
      component="a"
      href={href}
      disableRipple
      sx={{
        color: active ? applyFlow.accent : 'rgba(255, 255, 255, 0.72)',
        fontWeight: active ? 700 : 500,
        fontSize: compact ? '13px' : '14px',
        // 1:2 padding ratio — vertical : horizontal (py 2 / px 4)
        px: 4,
        py: 2,
        minWidth: 'auto',
        minHeight: 0,
        height: 'auto',
        lineHeight: 1,
        textTransform: 'none',
        fontFamily: publicFonts.body,
        borderRadius: '10px',
        bgcolor: active ? applyFlow.accentSoft : 'transparent',
        transition: 'color 0.2s, background-color 0.2s',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          color: '#fff',
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      {label}
    </Button>
  )
}

export function PublicHeader() {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const navigate = useNavigate()
  const scrolled = useScrolledHeader()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const retailSession = loadSession()?.portal === 'retail'

  const isWide = useMediaQuery(theme.breakpoints.up('desktop'))
  const isTablet = useMediaQuery(theme.breakpoints.up('lg'))
  const showCenterNav = isTablet

  const isActive = (href: string) => {
    const pathOnly = href.split('#')[0] || '/'
    if (pathOnly === '/') {
      // Hash-only home anchors (e.g. Visa Master) should not mark Home active.
      if (href.includes('#')) return false
      return pathname === '/'
    }
    return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`)
  }

  const handleSearchSubmit = () => {
    const q = searchQuery.trim()
    navigate(q ? `/countries?search=${encodeURIComponent(q)}` : '/countries')
    setSearchQuery('')
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          height: NAV_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          bgcolor: applyFlow.navy,
          borderBottom: `1px solid ${scrolled ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)'}`,
          boxShadow: scrolled ? '0 8px 24px rgba(0, 8, 20, 0.28)' : 'none',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        }}
      >
        <PublicContainer
          variant="hero"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
            gap: 2,
          }}
        >
          {/* ——— Left: brand ——— */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ minWidth: 0, flexShrink: 0, zIndex: 2 }}
          >
            <Box
              component="a"
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={GREENLIGHT_LOGO_DARK_SRC}
                alt="Greenlight Visa Solutions"
                sx={{
                  height: { xs: 34, md: 40 },
                  width: 'auto',
                  maxWidth: { xs: 120, md: 148 },
                  objectFit: 'contain',
                }}
              />
            </Box>

          </Stack>

          {/* ——— Center: navigation ——— */}
          {showCenterNav ? (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { md: 0.5, lg: 0.75 },
                zIndex: 1,
              }}
            >
              {navLinks.map(({ label, href }) => (
                <NavLink
                  key={href + label}
                  label={label}
                  href={href}
                  active={isActive(href)}
                  compact={!isWide}
                />
              ))}
            </Box>
          ) : null}

          {/* ——— Right: actions ——— */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.75, md: 1.25 }}
            sx={{ flexShrink: 0, zIndex: 2, ml: 'auto' }}
          >
            {retailSession ? (
              <>
                <DsButton
                  href="/retail/account"
                  variant="outlined"
                  color="primary"
                  size={isWide ? 'md' : 'sm'}
                  startIcon={<User size={isWide ? 16 : 14} />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.32)',
                    color: '#fff',
                    '&:hover': {
                      borderColor: applyFlow.accent,
                      color: applyFlow.accent,
                      backgroundColor: applyFlow.accentSoft,
                    },
                  }}
                >
                  My account
                </DsButton>
                <DsButton
                  variant="text"
                  size={isWide ? 'md' : 'sm'}
                  startIcon={<LogOut size={isWide ? 16 : 14} />}
                  onClick={() => {
                    clearSession()
                    navigate('/sign-in', { replace: true })
                  }}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    '&:hover': { color: applyFlow.accent, backgroundColor: applyFlow.accentSoft },
                  }}
                >
                  Sign out
                </DsButton>
              </>
            ) : (
              <DsButton
                href="/sign-in"
                variant="outlined"
                color="primary"
                size={isWide ? 'md' : 'sm'}
                startIcon={<User size={isWide ? 16 : 14} />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.32)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: applyFlow.accent,
                    color: applyFlow.accent,
                    backgroundColor: applyFlow.accentSoft,
                  },
                }}
              >
                Sign in
              </DsButton>
            )}

            {!isTablet && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: '10px',
                  color: '#fff',
                  ml: 0.5,
                }}
              >
                <Menu size={20} />
              </IconButton>
            )}
          </Stack>
        </PublicContainer>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            fontFamily: publicFonts.body,
            bgcolor: colors.white,
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Box component="img" src={GREENLIGHT_LOGO_SRC} alt="" sx={{ height: 36 }} />
          <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X size={20} />
          </IconButton>
        </Box>

        <Box sx={{ px: 2.5, py: 2 }}>
          <Box
            component="form"
            onSubmit={e => {
              e.preventDefault()
              handleSearchSubmit()
              setDrawerOpen(false)
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              mb: 2,
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              bgcolor: colors.surface,
            }}
          >
            <Search size={18} color={colors.textMuted} />
            <InputBase
              placeholder="Search country…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ flex: 1, fontSize: '14px' }}
            />
          </Box>
        </Box>

        <List sx={{ px: 1.5 }}>
          {navLinks.map(({ label, href }) => (
            <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
              <Button
                component="a"
                href={href}
                fullWidth
                onClick={() => setDrawerOpen(false)}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.25,
                  px: 2,
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: isActive(href) ? 700 : 500,
                  color: isActive(href) ? colors.navy : colors.text,
                  bgcolor: isActive(href) ? colors.greenMuted : 'transparent',
                  textTransform: 'none',
                }}
              >
                {label}
              </Button>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mx: 2.5, my: 2 }} />

        <Stack spacing={1.5} sx={{ px: 2.5, pb: 3 }}>
          {retailSession ? (
            <>
              <Button
                component="a"
                href="/retail/account"
                fullWidth
                variant="outlined"
                startIcon={<User size={18} />}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  py: 1.25,
                  borderRadius: '12px',
                  borderColor: colors.border,
                  color: colors.navy,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                My account
              </Button>
              <Button
                fullWidth
                variant="text"
                startIcon={<LogOut size={18} />}
                onClick={() => {
                  setDrawerOpen(false)
                  clearSession()
                  navigate('/sign-in', { replace: true })
                }}
                sx={{
                  py: 1.25,
                  borderRadius: '12px',
                  color: colors.textSecondary,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button
              component="a"
              href="/sign-in"
              fullWidth
              variant="outlined"
              startIcon={<User size={18} />}
              onClick={() => setDrawerOpen(false)}
              sx={{
                py: 1.25,
                borderRadius: '12px',
                borderColor: colors.border,
                color: colors.navy,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Sign in
            </Button>
          )}
          <Button
            component="a"
            href="/countries"
            fullWidth
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            onClick={() => setDrawerOpen(false)}
            sx={{
              py: 1.35,
              borderRadius: '12px',
              bgcolor: colors.greenBright,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: colors.greenDark },
            }}
          >
            Start application
          </Button>
        </Stack>
      </Drawer>
    </>
  )
}
