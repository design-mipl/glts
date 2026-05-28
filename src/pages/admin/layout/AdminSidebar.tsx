import { Sidebar } from '@/design-system/UIComponents'
import type { NavConfig, SidebarProps } from '@/design-system/UIComponents'
import { GreenlightLogoCollapsed, GreenlightLogoExpanded } from '@/components/brand/GreenlightLogo'
import { adminNav } from '../config/adminNav'

export interface AdminSidebarProps extends Omit<SidebarProps, 'appName' | 'logoMark' | 'navConfig'> {
  navConfig?: NavConfig[]
}

export function AdminSidebar({ navConfig = adminNav, ...props }: AdminSidebarProps) {
  return (
    <Sidebar
      {...props}
      navConfig={navConfig}
      appName="Greenlight Travel Solutions"
      logo={<GreenlightLogoExpanded />}
      logoCollapsed={<GreenlightLogoCollapsed />}
    />
  )
}
