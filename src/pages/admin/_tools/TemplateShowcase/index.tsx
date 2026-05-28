import { Navigate, Route, Routes } from 'react-router-dom'
import { TemplateShowcaseHub } from './pages/TemplateShowcaseHub'
import { ListingTemplatePage } from './pages/ListingTemplatePage'
import { DetailTemplatePage } from './pages/DetailTemplatePage'
import { DashboardTemplatePage } from './pages/DashboardTemplatePage'
import { ModalFormTemplatePage } from './pages/forms/ModalFormTemplatePage'
import { DrawerFormTemplatePage } from './pages/forms/DrawerFormTemplatePage'
import { FullPageFormTemplatePage } from './pages/forms/FullPageFormTemplatePage'
import { StepperFormTemplatePage } from './pages/forms/StepperFormTemplatePage'
import { TEMPLATE_SHOWCASE_BASE } from './config/templateRegistry'

export default function TemplateShowcaseRoutes() {
  return (
    <Routes>
      <Route index element={<TemplateShowcaseHub />} />
      <Route path="listing" element={<ListingTemplatePage />} />
      <Route path="detail" element={<DetailTemplatePage />} />
      <Route path="dashboard" element={<DashboardTemplatePage />} />
      <Route path="forms/modal" element={<ModalFormTemplatePage />} />
      <Route path="forms/drawer" element={<DrawerFormTemplatePage />} />
      <Route path="forms/page" element={<FullPageFormTemplatePage />} />
      <Route path="forms/stepper" element={<StepperFormTemplatePage />} />
      <Route path="*" element={<Navigate to={TEMPLATE_SHOWCASE_BASE} replace />} />
    </Routes>
  )
}
