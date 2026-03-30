import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import FolderIcon from '@mui/icons-material/Folder'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsPanel from './pages/Settings'
import PreviewPage from './pages/Preview'
import { AppShell } from './design-system/components/navigation'
import type { NavConfig } from './design-system/components/navigation'

const navConfig: NavConfig[] = [
  {
    type: 'group',
    label: 'Main',
    children: [
      { type: 'item', label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, href: '/' },
      { type: 'item', label: 'Analytics', icon: <BarChartIcon sx={{ fontSize: 20 }} />, href: '/analytics' },
    ],
  },
  {
    type: 'group',
    label: 'Management',
    children: [
      {
        type: 'group',
        label: 'Users',
        icon: <PeopleIcon sx={{ fontSize: 20 }} />,
        children: [
          { type: 'item', label: 'All Users', href: '/users' },
          { type: 'item', label: 'Roles', href: '/users/roles' },
          { type: 'item', label: 'Permissions', href: '/users/permissions' },
        ],
      },
      {
        type: 'item',
        label: 'Records',
        icon: <FolderIcon sx={{ fontSize: 20 }} />,
        href: '/records',
        badge: 12,
      },
    ],
  },
  { type: 'divider' },
  {
    type: 'group',
    label: 'Settings',
    children: [
      { type: 'item', label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} />, href: '/settings' },
    ],
  },
]

const mockUser = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'Admin',
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell navConfig={navConfig} user={mockUser}>
        <Routes>
          <Route path="/" element={<PreviewPage />} />
        </Routes>
      </AppShell>
      <SettingsPanel />
    </BrowserRouter>
  )
}
