/** Professional portrait crops for testimonial avatars (Unsplash). */
const portrait = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&h=200&q=85&crop=faces`

export const testimonialPortraits = {
  priyaSharma: portrait('photo-1580489944761-15a19d654956'),
  hiroshiKondo: portrait('photo-1519085368933-9d8a662002f6'),
  amaraOkafor: portrait('photo-1589156281-c5380c4b4f4e'),
  elenaVasquez: portrait('photo-1573496359142-b8d87734a5a2'),
  rajeshMehta: portrait('photo-1507003211169-0a1dd7228f2d'),
  sarahChen: portrait('photo-1438761681033-6461ffad8d80'),
  mariaSantos: portrait('photo-1544005313-94ddf0286df2'),
  larsEriksson: portrait('photo-1560250097-0b93528c311a'),
  ananyaDesai: portrait('photo-1487412720507-e7ab37603c6f'),
  jamesWhitfield: portrait('photo-1472099645785-5658abf4ff4e'),
  fatimaAlHassan: portrait('photo-1594744802529-6c654f2ab992'),
  davidOkonkwo: portrait('photo-1506794778202-cad84cf45f1d'),
  sophieLaurent: portrait('photo-1494790108377-be9c29b29330'),
  michaelChen: portrait('photo-1519345182560-3f2917c472ef'),
  priyaNair: portrait('photo-1489424731084-a5108cff013f'),
} as const
