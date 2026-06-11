import { useCallback, useState } from 'react'
import { FileUpload, FormField } from '@/design-system/UIComponents'
import { readFileAsDataUrl } from '@/shared/utils/imageSource'

const DEFAULT_MAX_BYTES = 2 * 1024 * 1024

interface CountryFormImageFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  helperText?: string
  dropzoneTitle?: string
  dropzoneCaption?: string
  disabled?: boolean
}

export function CountryFormImageField({
  label,
  value,
  onChange,
  helperText,
  dropzoneTitle = 'Upload an image or drag & drop here',
  dropzoneCaption = 'PNG, JPG, WebP, or SVG — up to 2 MB',
  disabled = false,
}: CountryFormImageFieldProps) {
  const [uploadError, setUploadError] = useState<string | undefined>()

  const handleUpload = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      setUploadError(undefined)
      try {
        const dataUrl = await readFileAsDataUrl(file)
        onChange(dataUrl)
      } catch {
        setUploadError('Could not read the selected file. Try another image.')
      }
    },
    [onChange],
  )

  const fieldHelper =
    uploadError ?? (value ? 'Image saved with this record (mock storage).' : helperText)

  return (
    <FormField
      label={label}
      helperText={fieldHelper}
      error={Boolean(uploadError)}
    >
      <FileUpload
        accept="image/*"
        preview
        maxSize={DEFAULT_MAX_BYTES}
        maxFiles={1}
        dropzoneTitle={dropzoneTitle}
        dropzoneCaption={dropzoneCaption}
        browseLabel="Browse image"
        onUpload={(files) => void handleUpload(files)}
        onError={setUploadError}
        disabled={disabled}
      />
    </FormField>
  )
}
