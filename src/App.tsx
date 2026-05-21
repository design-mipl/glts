import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  AppShell,
  ToastProvider,
  type NavConfig,
} from '@/design-system/UIComponents'
import SettingsPanel from '@/pages/Settings'
import ComponentLibrary from '@/pages/ComponentLibrary'
import BillingsLayout from '@/pages/Billings'
import ListingPage from '@/pages/Billings/components/ListingPage'
import DetailPage from '@/pages/Billings/components/DetailPage'
import FormPage from '@/pages/Billings/components/FormPage'
import StepperFormPage from '@/pages/Billings/components/StepperFormPage'
import PaymentsPage from '@/pages/Billings/components/PaymentsPage'
import {
  LayoutDashboard,
  BarChart2,
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
        label: 'Billings',
        icon: <FileText size={16} strokeWidth={1.75} />,
        children: [
          { type: 'item', label: 'All Invoices', href: '/billings' },
          { type: 'item', label: 'Create Invoice', href: '/billings/create' },
          { type: 'item', label: 'Stepper Demo', href: '/billings/stepper' },
          { type: 'item', label: 'Payments', href: '/billings/payments' },
        ],
      },
      {
        type: 'item',
        label: 'Records',
        icon: <Folder size={16} strokeWidth={1.75} />,
        href: '/records',
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
            <Route path="/" element={<ComponentLibrary />} />
            <Route path="/billings" element={<BillingsLayout />}>
              <Route index element={<ListingPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="create" element={<FormPage />} />
              <Route path="stepper" element={<StepperFormPage />} />
              <Route path=":id/edit" element={<FormPage />} />
              <Route path=":id" element={<DetailPage />} />
            </Route>
            <Route path="*" element={<ComponentLibrary />} />
          </Routes>
          <SettingsPanel />
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  )
}
