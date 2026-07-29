/**
 * @deprecated Prefer `@/shared/utils/entityMasterBulkUpload`.
 * Kept as a thin re-export for existing admin imports.
 */
export {
  downloadEntityMasterUploadTemplate as downloadCorporateAccountEntityTemplate,
  importEntityMastersFromCsv as importCorporateAccountEntitiesFromCsv,
  type EntityBulkImportResult,
  type EntityBulkImportRowIssue,
} from '@/shared/utils/entityMasterBulkUpload'
