import {
  Box,
  Button,
  Stack,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useScrolledHeader } from '../hooks/useScrolledHeader'
import {
  publicColors,
  publicFonts,
  publicLayout,
  publicShadows,
} from '../theme/publicSiteTokens'
import { PublicContainer } from './PublicContainer'

const navLinks = [
  { label: 'Destinations', href: '/countries' },
  { label: 'Marine Crew', href: '/business' },
  { label: 'Corporate', href: '/business' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Track Application', href: '/track' },
]

export function PublicHeader() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const scrolled = useScrolledHeader()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navColor = transparent ? 'rgba(255,255,255,0.92)' : publicColors.text
  const navColorMuted = transparent ? 'rgba(255,255,255,0.75)' : publicColors.textSecondary

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          height: publicLayout.navHeight,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: transparent ? 'transparent' : 'rgba(255, 255, 255, 0.94)',
          backdropFilter: transparent ? 'none' : 'blur(16px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(16px)',
          borderBottom: transparent ? '1px solid transparent' : `1px solid ${publicColors.borderSoft}`,
          boxShadow: transparent ? 'none' : publicShadows.nav,
        }}
      >
        <PublicContainer
          variant="hero"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
          }}
        >
          <Box
            component="a"
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/greenlight_logo.jpg"
              alt="Greenlight"
              sx={{
                height: { xs: 36, md: 44 },
                width: 'auto',
                maxWidth: 180,
                objectFit: 'contain',
              }}
            />
          </Box>

          {isDesktop && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {navLinks.map(({ label, href }) => (
                <Button
                  key={label}
                  variant="text"
                  href={href}
                  sx={{
                    color: navColor,
                    fontWeight: 500,
                    fontSize: '15px',
                    px: 2,
                    py: 1,
                    minWidth: 'auto',
                    fontFamily: publicFonts.body,
                    borderRadius: '10px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: publicColors.greenBright,
                      backgroundColor: transparent
                        ? 'rgba(255,255,255,0.08)'
                        : publicColors.greenMuted,
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={1.5} alignItems="center">
            {isDesktop && (
              <Button
                variant="text"
                href="/retail"
                sx={{
                  color: navColorMuted,
                  fontWeight: 500,
                  fontSize: '15px',
                  px: 2,
                  textTransform: 'none',
                  '&:hover': { color: publicColors.greenBright },
                }}
              >
                Sign In
              </Button>
            )}
            <Button
              variant="contained"
              href="/countries"
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${publicColors.green} 0%, ${publicColors.greenBright} 100%)`,
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                px: 3,
                py: 1.25,
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(118, 199, 107, 0.4)',
                transition: 'all 0.25s',
                '&:hover': {
                  background: `linear-gradient(135deg, ${publicColors.greenBright} 0%, ${publicColors.greenDark} 100%)`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                },
              }}
            >
              Start Application
            </Button>
            {!isDesktop && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: transparent ? '#fff' : publicColors.text,
                  border: `1px solid ${transparent ? 'rgba(255,255,255,0.25)' : publicColors.border}`,
                }}
              >
                <Menu size={22} />
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
          sx: { width: 320, fontFamily: publicFonts.body, p: 1 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box component="img" src="/sm_logo.jpg" alt="" sx={{ height: 32 }} />
          <IconButton onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>
        <List>
          {navLinks.map(({ label, href }) => (
            <ListItem key={label} sx={{ py: 0 }}>
              <Button
                href={href}
                fullWidth
                sx={{ justifyContent: 'flex-start', py: 1.5, fontSize: '16px', fontWeight: 500 }}
                onClick={() => setDrawerOpen(false)}
              >
                {label}
              </Button>
            </ListItem>
          ))}
          <ListItem>
            <Button href="/retail" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5 }}>
              Sign In
            </Button>
          </ListItem>
          <ListItem sx={{ pt: 2 }}>
            <Button
              variant="contained"
              href="/countries"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: publicColors.greenBright,
                textTransform: 'none',
                fontWeight: 700,
              }}
              onClick={() => setDrawerOpen(false)}
            >
              Start Application
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}
