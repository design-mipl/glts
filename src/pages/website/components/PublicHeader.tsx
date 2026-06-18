import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  InputBase,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { Menu, X, ShieldCheck, Search, User, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button as DsButton } from '@/design-system/UIComponents'
import { useScrolledHeader } from '../hooks/useScrolledHeader'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, publicShadows, usePublicBrandColors } from '../theme/publicSiteTokens'
import { PublicContainer } from './PublicContainer'

const NAV_HEIGHT = 72

const navLinks = [
  { label: 'Destinations', href: '/countries' },
  { label: 'Marine Crew', href: '/marine-crew' },
  { label: 'Corporate', href: '/corporate' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Track', href: '/track', shortLabel: 'Track' },
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
  const colors = usePublicBrandColors()

  return (
    <Button
      component="a"
      href={href}
      disableRipple
      sx={{
        color: active ? colors.navy : colors.textSecondary,
        fontWeight: active ? 700 : 500,
        fontSize: compact ? '13px' : '14px',
        px: compact ? 1.25 : 1.75,
        py: 1,
        height: 40,
        minWidth: 'auto',
        lineHeight: 1,
        textTransform: 'none',
        fontFamily: publicFonts.body,
        borderRadius: '10px',
        bgcolor: active ? colors.greenMuted : 'transparent',
        transition: 'color 0.2s, background-color 0.2s',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          color: colors.navy,
          bgcolor: colors.greenMuted,
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

  const isWide = useMediaQuery(theme.breakpoints.up('desktop'))
  const isTablet = useMediaQuery(theme.breakpoints.up('lg'))
  const showCenterNav = isTablet

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

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
          bgcolor: alpha(colors.white, scrolled ? 0.98 : 0.94),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? colors.border : colors.borderSoft}`,
          boxShadow: scrolled ? publicShadows.nav : 'none',
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
                src={GREENLIGHT_LOGO_SRC}
                alt="Greenlight Travel Solutions"
                sx={{
                  height: { xs: 34, md: 40 },
                  width: 'auto',
                  maxWidth: { xs: 120, md: 148 },
                  objectFit: 'contain',
                }}
              />
            </Box>

            {isWide && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  pl: 1.5,
                  ml: 0.5,
                  borderLeft: `1px solid ${colors.border}`,
                }}
              >
                <ShieldCheck size={15} color={colors.greenBright} strokeWidth={2.5} />
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: colors.textSecondary,
                    letterSpacing: '0.02em',
                    lineHeight: 1.2,
                    maxWidth: 120,
                  }}
                >
                  On-time visas, guaranteed
                </Typography>
              </Box>
            )}
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
              {navLinks.map(({ label, href, shortLabel }) => (
                <NavLink
                  key={href + label}
                  label={isWide ? label : (shortLabel ?? label)}
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
            {isWide && (
              <DsButton
                href="/sign-in"
                variant="soft"
                color="primary"
                startIcon={<User size={16} />}
              >
                Sign in
              </DsButton>
            )}

            {!isTablet && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                sx={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
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
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: '12px',
              bgcolor: colors.greenMuted,
              mb: 2,
            }}
          >
            <ShieldCheck size={18} color={colors.greenBright} />
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>
              Visas on time, guaranteed
            </Typography>
          </Box>

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
