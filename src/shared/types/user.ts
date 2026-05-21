export interface User {
  id: string
  email: string
  name: string
  role: 'retail' | 'b2b' | 'admin'
  createdAt: string
}

export interface B2BUser {
  id: string
  email: string
  name: string
  companyName: string
  companyId: string
  role: 'admin' | 'booker' | 'viewer'
  createdAt: string
}
