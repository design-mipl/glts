import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/design-system/UIComponents'
import { PageRouter } from './PageRouter'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <PageRouter />
      </ToastProvider>
    </BrowserRouter>
  )
}
