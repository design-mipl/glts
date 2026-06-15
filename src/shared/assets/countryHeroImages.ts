import belgiumImg from '@/assets/country/Belgium.png'
import canadaImg from '@/assets/country/Canada.png'
import franceImg from '@/assets/country/France.png'
import japanImg from '@/assets/country/Japan.png'
import kenyaImg from '@/assets/country/Kenya.png'
import moroccoImg from '@/assets/country/Morocco.png'
import netherlandsImg from '@/assets/country/Netherlands.png'
import philippinesImg from '@/assets/country/Philippines.png'
import singaporeImg from '@/assets/country/Singapore.png'
import southKoreaImg from '@/assets/country/South korea.png'
import taiwanImg from '@/assets/country/Taiwan.png'

const COUNTRY_HERO_IMAGES_BY_CODE: Partial<Record<string, string>> = {
  BE: belgiumImg,
  CA: canadaImg,
  FR: franceImg,
  JP: japanImg,
  KE: kenyaImg,
  KR: southKoreaImg,
  MA: moroccoImg,
  NL: netherlandsImg,
  PH: philippinesImg,
  SG: singaporeImg,
  TW: taiwanImg,
}

export function getLocalCountryHeroImageUrl(code: string): string | undefined {
  return COUNTRY_HERO_IMAGES_BY_CODE[code.toUpperCase()]
}
