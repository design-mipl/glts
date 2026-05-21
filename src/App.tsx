import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  AppShell,
  ToastProvider,
  type NavConfig,
} from '@/design-system/UIComponents'
import RouteFallback from '@/components/RouteFallback'
import BillingsLayout from '@/pages/Billings'
import {
  LayoutDashboard,
  BarChart2,
  Folder,
  FileText,
} from 'lucide-react'

const ComponentLibrary = lazy(() => import('@/pages/ComponentLibrary'))
const SettingsPanel = lazy(() => import('@/pages/Settings'))
const ListingPage = lazy(() => import('@/pages/Billings/components/ListingPage'))
const DetailPage = lazy(() => import('@/pages/Billings/components/DetailPage'))
const FormPage = lazy(() => import('@/pages/Billings/components/FormPage'))
const StepperFormPage = lazy(() => import('@/pages/Billings/components/StepperFormPage'))
const PaymentsPage = lazy(() => import('@/pages/Billings/components/PaymentsPage'))

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

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
            <Route
              path="/"
              element={
                <LazyPage>
                  <ComponentLibrary />
                </LazyPage>
              }
            />
            <Route path="/billings" element={<BillingsLayout />}>
              <Route
                index
                element={
                  <LazyPage>
                    <ListingPage />
                  </LazyPage>
                }
              />
              <Route
                path="payments"
                element={
                  <LazyPage>
                    <PaymentsPage />
                  </LazyPage>
                }
              />
              <Route
                path="create"
                element={
                  <LazyPage>
                    <FormPage />
                  </LazyPage>
                }
              />
              <Route
                path="stepper"
                element={
                  <LazyPage>
                    <StepperFormPage />
                  </LazyPage>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <LazyPage>
                    <FormPage />
                  </LazyPage>
                }
              />
              <Route
                path=":id"
                element={
                  <LazyPage>
                    <DetailPage />
                  </LazyPage>
                }
              />
            </Route>
            <Route
              path="*"
              element={
                <LazyPage>
                  <ComponentLibrary />
                </LazyPage>
              }
            />
          </Routes>
          <Suspense fallback={null}>
            <SettingsPanel />
          </Suspense>
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  )
}
