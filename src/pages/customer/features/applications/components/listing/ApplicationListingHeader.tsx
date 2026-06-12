import { Box, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import { getPrimaryButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { navigateToCreateApplication } from '../../utils/createApplicationNavigation'

export function ApplicationListingHeader() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ fontSize: { xs: '22px', md: '26px' }, fontWeight: 700 }}>
          Application Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
          Operational workspace for draft and submitted applications
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Plus size={16} />}
        onClick={() => navigateToCreateApplication(navigate, base)}
        sx={{ ...getPrimaryButtonSx(colors), flexShrink: 0 }}
      >
        Create application
      </Button>
    </Box>
  )
}
