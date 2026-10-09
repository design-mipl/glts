import type { TrustedCompanyLogo } from '../components/TrustedCompaniesSection'

import maersk from './company-logos/marine/Maersk.jpg'
import vGroup from './company-logos/marine/V_Group.jpg'
import wilhelmsen from './company-logos/marine/Wilhelmsen.jpg'
import hapagLloyd from './company-logos/marine/Hapag_Lloyd.jpg'
import msc from './company-logos/marine/MSC.jpg'
import bernhardSchulte from './company-logos/marine/Bernhard_Schulte_Shipmanagement.jpg'
import cmaCgm from './company-logos/marine/CMA_CGM.jpg'
import angloEastern from './company-logos/marine/Anglo_Eastern.jpg'

import accenture from './company-logos/corporate/accenture.webp'
import capgemini from './company-logos/corporate/capgemini.jpg'
import deloitte from './company-logos/corporate/deloitte.webp'
import ibm from './company-logos/corporate/ibm.webp'
import infosys from './company-logos/corporate/infosys.jpg'
import siemens from './company-logos/corporate/siemens.jpg'
import tcs from './company-logos/corporate/tcs.jpg'
import wipro from './company-logos/corporate/wipro.webp'

import easeMyTrip from './company-logos/travel-agents/ease-my-trip.webp'
import makeMyTrip from './company-logos/travel-agents/make-my-trip.webp'
import yatra from './company-logos/travel-agents/yatra.webp'
import sotc from './company-logos/travel-agents/sotc.jpg'
import thomasCook from './company-logos/travel-agents/thomas-cook.jpg'
import akbarTravels from './company-logos/travel-agents/akbar-travels.jpg'
import riya from './company-logos/travel-agents/riya.jpg'
import tbo from './company-logos/travel-agents/tbo.jpg'

export const marineCompanyLogos: readonly TrustedCompanyLogo[] = [
  { name: 'Maersk', src: maersk, alt: 'Maersk logo', width: 220, crop: true },
  { name: 'V.Group', src: vGroup, alt: 'V.Group logo', width: 220, crop: true },
  { name: 'Wilhelmsen', src: wilhelmsen, alt: 'Wilhelmsen logo', width: 220, crop: true },
  { name: 'Hapag-Lloyd', src: hapagLloyd, alt: 'Hapag-Lloyd logo', width: 220, crop: true },
  { name: 'MSC', src: msc, alt: 'MSC logo' },
  { name: 'Bernhard Schulte Shipmanagement', src: bernhardSchulte, alt: 'Bernhard Schulte Shipmanagement logo', width: 180, height: 96, crop: true },
  { name: 'CMA CGM', src: cmaCgm, alt: 'CMA CGM logo', width: 180, height: 96, crop: true },
  { name: 'Anglo-Eastern', src: angloEastern, alt: 'Anglo-Eastern logo', width: 300, crop: true },
]

export const corporateCompanyLogos: readonly TrustedCompanyLogo[] = [
  { name: 'Infosys', src: infosys, width: 180, crop: true },
  { name: 'Tata Consultancy Services (TCS)', src: tcs, width: 220, crop: true },
  { name: 'Wipro', src: wipro, height: 72 },
  { name: 'Accenture', src: accenture, height: 58 },
  { name: 'Deloitte', src: deloitte, height: 50 },
  { name: 'IBM', src: ibm, height: 62 },
  { name: 'Capgemini', src: capgemini, width: 220, crop: true },
  { name: 'Siemens', src: siemens, width: 210, crop: true },
]

export const travelAgentCompanyLogos: readonly TrustedCompanyLogo[] = [
  { name: 'EaseMyTrip', src: easeMyTrip, height: 76 },
  { name: 'MakeMyTrip', src: makeMyTrip, height: 68 },
  { name: 'Yatra', src: yatra, height: 70 },
  { name: 'SOTC', src: sotc, width: 220 },
  { name: 'Thomas Cook', src: thomasCook, width: 190 },
  { name: 'Akbar Travels', src: akbarTravels, width: 160 },
  { name: 'Riya', src: riya, width: 180 },
  { name: 'TBO', src: tbo, width: 210 },
]
