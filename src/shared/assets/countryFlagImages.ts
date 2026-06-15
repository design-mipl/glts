import australiaFlag from '@/assets/flags/australia.png'
import belgiumFlag from '@/assets/flags/belgium.png'
import canadaFlag from '@/assets/flags/canada.png'
import chinaFlag from '@/assets/flags/china.png'
import franceFlag from '@/assets/flags/france.png'
import japanFlag from '@/assets/flags/japan.png'
import kenyaFlag from '@/assets/flags/kenya.png'
import moroccoFlag from '@/assets/flags/morocco.png'
import netherlandsFlag from '@/assets/flags/netherlands.png'
import philippinesFlag from '@/assets/flags/philippines.png'
import singaporeFlag from '@/assets/flags/singapore.png'
import southKoreaFlag from '@/assets/flags/south korea.png'
import taiwanFlag from '@/assets/flags/taiwan.png'
import unitedKingdomFlag from '@/assets/flags/united kingdom.png'
import unitedStatesFlag from '@/assets/flags/united states.png'

const COUNTRY_FLAG_IMAGES_BY_CODE: Partial<Record<string, string>> = {
  AU: australiaFlag,
  BE: belgiumFlag,
  CA: canadaFlag,
  CN: chinaFlag,
  FR: franceFlag,
  GB: unitedKingdomFlag,
  JP: japanFlag,
  KE: kenyaFlag,
  KR: southKoreaFlag,
  MA: moroccoFlag,
  NL: netherlandsFlag,
  PH: philippinesFlag,
  SG: singaporeFlag,
  TW: taiwanFlag,
  US: unitedStatesFlag,
}

export function getLocalCountryFlagImageUrl(code: string): string | undefined {
  return COUNTRY_FLAG_IMAGES_BY_CODE[code.toUpperCase()]
}
