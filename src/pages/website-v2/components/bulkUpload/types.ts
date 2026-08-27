export type TravellerUploadStatus = 'pending' | 'uploading' | 'processing' | 'uploaded' | 'needs_attention'

export interface TravellerUploadQuality {
  /** OCR confidence / match score, 0–100. */
  confidence: number
  /** Short human-readable note, e.g. "Passport details matched". */
  note?: string
}

export interface TravellerUploadStatusItem {
  id: string
  name: string
  status: TravellerUploadStatus
  fileName?: string
  quality?: TravellerUploadQuality
  /** Shown when status is 'needs_attention', e.g. "Photo page not clearly visible". */
  attentionReason?: string
}
