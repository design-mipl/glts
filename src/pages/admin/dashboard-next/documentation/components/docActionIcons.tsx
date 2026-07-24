import type { ReactNode } from 'react'
import {
  ClipboardCheck,
  FileStack,
  FormInput,
  LayoutDashboard,
  LineChart,
  Send,
  Sparkles,
} from 'lucide-react'

export const DOC_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-my-apps': <FileStack size={18} />,
  'qa-qc': <ClipboardCheck size={18} />,
  'qa-forms': <FormInput size={18} />,
  'qa-submit': <Send size={18} />,
  'qa-overview': <LayoutDashboard size={18} />,
  'qa-activity': <Sparkles size={18} />,
  'qa-reports': <LineChart size={18} />,
}
