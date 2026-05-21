import { Box } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserDashboard } from './pages/UserDashboard'
import { publicFonts } from '../../shared/theme/publicBrand'

export function RetailPortalApp() {
  return (
    <Box sx={{ fontFamily: publicFonts.body, minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="*" element={<Navigate to="/retail" replace />} />
      </Routes>
    </Box>
  )
}
