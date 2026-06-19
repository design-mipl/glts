import { Box, Stack, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import {
  PORTAL_RECORD_PAGE_TITLE_SX,
  PORTAL_RECORD_PAGE_TITLE_VARIANT,
} from '@/shared/theme/portalChromeLayout'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { navigateToCreateApplication } from '../../utils/createApplicationNavigation'

export function ApplicationListingHeader() {
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant={PORTAL_RECORD_PAGE_TITLE_VARIANT}
            component="h1"
            fontWeight={700}
            color="text.primary"
            sx={PORTAL_RECORD_PAGE_TITLE_SX}
          >
            Application Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
            Operational workspace for draft and submitted applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          label="Create application"
          startIcon={<Plus size={14} />}
          onClick={() => navigateToCreateApplication(navigate, base)}
        />
      </Stack>
    </Box>
  )
}
