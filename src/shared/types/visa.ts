export type VisaCategory = 'e-Visa' | 'Sticker' | 'Visa on arrival' | 'No Visa Required'

export interface Country {
  id: string
  name: string
  code: string
  region: string
  visaTypes: VisaType[]
  processingTime: string
  price: number
  rating: number
  flags: string
  trending: boolean
  trendingPercent: number
  /** Atlys-style card metadata */
  visaCategory: VisaCategory
  validity: string
  documentsNeeded: string[]
  /** Unsplash slug, e.g. photo-1512453979798-5ea266f8880c */
  heroPhotoId: string
  fastMinutes?: number
  /** e.g. "Dubai · Abu Dhabi" */
  cities: string
}

export interface VisaType {
  id: string
  name: string
  type: string
  duration: string
  validity: string
  processingDays: string
  entries: string
  requirements: Requirement[]
  price: number
  embassyInfo: EmbassyInfo
}

export interface Requirement {
  id: string
  name: string
  type: string
  mandatory: boolean
  description: string
}

export interface EmbassyInfo {
  name: string
  location: string
  hours: string
  phone?: string
  openDays?: string
  slotsAvailable?: number
  nextAvailable?: string
}

export interface ApplicationStep {
  id: number
  name: string
  duration: string
  status: 'completed' | 'current' | 'upcoming'
  details?: string
}
