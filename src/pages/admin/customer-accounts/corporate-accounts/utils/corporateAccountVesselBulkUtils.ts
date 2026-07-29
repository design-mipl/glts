/**
 * @deprecated Prefer `@/shared/utils/vesselMasterBulkUpload`.
 * Kept as a thin re-export for existing admin imports.
 */
export {
  downloadVesselMasterUploadTemplate as downloadCorporateAccountVesselTemplate,
  importVesselMastersFromCsv as importCorporateAccountVesselsFromCsv,
  type VesselBulkImportResult,
  type VesselBulkImportRowIssue,
} from '@/shared/utils/vesselMasterBulkUpload'
