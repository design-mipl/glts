import { Box, Card, Stack, Typography } from '@mui/material'
import { Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import {
  getPrimaryButtonSx,
  publicTypography,
  usePublicBrandColors,
} from '@/shared/theme/publicBrand'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { FINANCE_NAV_ITEMS, FINANCE_NAV_PARENT } from '../config/financeNav'

const MODULE_FEATURES = [
  'Invoices',
  'Advance payments',
  'Outstanding tracking',
  'Payment history',
  'Receipts',
]

export function FinanceComingSoonPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const location = useLocation()

  const pageTitle = useMemo(() => {
    const match = FINANCE_NAV_ITEMS.find(item => location.pathname.includes(`/${item.path}`))
    return match?.pageTitle ?? FINANCE_NAV_PARENT.label
  }, [location.pathname])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'min(70vh, 640px)',
        py: { xs: 3, md: 5 },
        px: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          maxWidth: 560,
          width: '100%',
          textAlign: 'center',
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '18px',
            bgcolor: colors.greenMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <Wallet size={36} color={colors.greenBright} strokeWidth={1.75} />
        </Box>

        <Stack direction="row" justifyContent="center" sx={{ mb: 1.5 }}>
          <CustomerStatusChip label="Coming Soon" tone="info" />
        </Stack>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: publicTypography.h2,
            color: colors.navy,
            mb: 1,
          }}
        >
          {pageTitle}
        </Typography>

        <Typography
          sx={{
            color: colors.textSecondary,
            fontSize: 15,
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Finance and invoice management workspace is currently under development.
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: colors.textMuted,
            textAlign: 'left',
            mb: 1,
          }}
        >
          This module will include:
        </Typography>

        <Box
          component="ul"
          sx={{
            m: 0,
            mb: 3,
            pl: 2.5,
            textAlign: 'left',
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          {MODULE_FEATURES.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate(`${base}/dashboard`)}
          sx={{ ...getPrimaryButtonSx(colors), px: 3 }}
        >
          Back to dashboard
        </Button>
      </Card>
    </Box>
  )
}
