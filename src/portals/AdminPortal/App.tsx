import { Box } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ComingSoonPage } from '../../shared/components/ComingSoonPage'
import { PublicLayout } from '../PublicWebsite/components/PublicLayout'
import { publicFonts } from '../../shared/theme/publicBrand'

export function AdminPortalApp() {
  return (
    <PublicLayout>
      <Box sx={{ fontFamily: publicFonts.body }}>
        <Routes>
          <Route
            path="/"
            element={
              <ComingSoonPage
                title="Admin Portal"
                description="The Greenlight admin portal is under development."
                returnLink={{ text: 'Back to website', href: '/' }}
              />
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Box>
    </PublicLayout>
  )
}
