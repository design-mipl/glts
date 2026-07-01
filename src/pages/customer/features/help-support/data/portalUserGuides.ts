export type PortalUserGuideFormat = 'pdf' | 'doc'

export interface PortalUserGuide {
  id: string
  name: string
  version: string
  updatedDate: string
  fileSize: string
  format: PortalUserGuideFormat
}

export const PORTAL_USER_GUIDES: PortalUserGuide[] = [
  {
    id: 'guide-customer-portal',
    name: 'Customer Portal User Guide',
    version: '3.2',
    updatedDate: '2026-03-01',
    fileSize: '2.4 MB',
    format: 'pdf',
  },
  {
    id: 'guide-corporate-admin',
    name: 'Corporate Admin Guide',
    version: '2.8',
    updatedDate: '2026-02-20',
    fileSize: '1.9 MB',
    format: 'pdf',
  },
  {
    id: 'guide-booker',
    name: 'Booker Guide',
    version: '2.1',
    updatedDate: '2026-02-15',
    fileSize: '1.2 MB',
    format: 'pdf',
  },
  {
    id: 'guide-marine',
    name: 'Marine Processing Guide',
    version: '1.6',
    updatedDate: '2026-03-05',
    fileSize: '3.1 MB',
    format: 'pdf',
  },
  {
    id: 'guide-bulk-template',
    name: 'Bulk Upload Template',
    version: '4.0',
    updatedDate: '2026-03-08',
    fileSize: '156 KB',
    format: 'doc',
  },
  {
    id: 'guide-document-upload',
    name: 'Document Upload Guidelines',
    version: '2.3',
    updatedDate: '2026-02-28',
    fileSize: '890 KB',
    format: 'pdf',
  },
]
