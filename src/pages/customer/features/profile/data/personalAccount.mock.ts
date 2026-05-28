import type { PersonalProfileData } from '../types/accountWorkspace'

export const mockPersonalAccountData: PersonalProfileData = {
  account: {
    id: 'user-1',
    name: 'Rajan Mehta',
    designation: 'Travel Operations Manager',
    email: 'rajan.mehta@glts.com',
    phone: '+91 98 2000 4422',
    username: 'rajan.mehta@glts.com',
    lastLogin: '27 May 2026, 09:42 IST',
    canEditDesignation: true,
  },
  sessions: [
    {
      id: 'sess-1',
      device: 'Chrome on Windows',
      location: 'Mumbai, IN',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone',
      location: 'Mumbai, IN',
      lastActive: '26 May 2026, 18:10',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'Edge on Windows',
      location: 'Pune, IN',
      lastActive: '22 May 2026, 11:05',
      isCurrent: false,
    },
  ],
}

export const mockBookerPersonalAccountData: PersonalProfileData = {
  account: {
    id: 'user-booker-1',
    name: 'Anita Desai',
    designation: 'Corporate Booker',
    email: 'anita.desai@glts.com',
    phone: '+91 98 2100 8811',
    username: 'anita.desai@glts.com',
    lastLogin: '26 May 2026, 16:20 IST',
    canEditDesignation: false,
  },
  sessions: [
    {
      id: 'sess-b1',
      device: 'Chrome on macOS',
      location: 'Mumbai, IN',
      lastActive: 'Active now',
      isCurrent: true,
    },
  ],
}
