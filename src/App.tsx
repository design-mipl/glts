import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  AppShell,
  ToastProvider,
  type NavConfig,
} from '@/design-system/UIComponents'
import SettingsPanel from '@/pages/Settings'
import PreviewPage from '@/pages/Preview'
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Folder,
  FileText,
} from 'lucide-react'

const navConfig: NavConfig[] = [
  {
    type: 'group',
    label: 'Main',
    children: [
      {
        type: 'item',
        label: 'Dashboard',
        icon: <LayoutDashboard size={16} strokeWidth={1.75} />,
        href: '/',
      },
      {
        type: 'item',
        label: 'Analytics',
        icon: <BarChart2 size={16} strokeWidth={1.75} />,
        href: '/analytics',
      },
    ],
  },
  {
    type: 'group',
    label: 'Management',
    children: [
      {
        type: 'group',
        label: 'Users',
        icon: <Users size={16} strokeWidth={1.75} />,
        children: [
          { type: 'item', label: 'All Users', href: '/users' },
          { type: 'item', label: 'Roles', href: '/users/roles' },
          { type: 'item', label: 'Permissions', href: '/users/permissions' },
        ],
      },
      {
        type: 'item',
        label: 'Records',
        icon: <Folder size={16} strokeWidth={1.75} />,
        href: '/records',
        badge: 12,
      },
      {
        type: 'item',
        label: 'Reports',
        icon: <FileText size={16} strokeWidth={1.75} />,
        href: '/reports',
      },
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
      <ToastProvider>
        <AppShell
          navConfig={navConfig}
          user={mockUser}
          onSignOut={() => console.log('sign out')}
          onProfileClick={() => console.log('profile')}
          onSettingsClick={() => console.log('settings')}
        >
          <Routes>
            <Route path="/" element={<PreviewPage />} />
            <Route path="*" element={<PreviewPage />} />
          </Routes>
          <SettingsPanel />
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  )
}
