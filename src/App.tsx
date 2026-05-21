import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/design-system/UIComponents'
import { PortalRouter } from './PortalRouter'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <PortalRouter />
      </ToastProvider>
    </BrowserRouter>
  )
}
