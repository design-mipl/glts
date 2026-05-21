import type { User } from '../types/user'

const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'retail',
  createdAt: '2026-01-15',
}

export function mockLogin(_email: string, _password: string): User {
  return MOCK_USER
}

export function mockLogout(): void {
  localStorage.removeItem('currentUser')
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem('currentUser')
  return stored ? (JSON.parse(stored) as User) : null
}

export function setCurrentUser(user: User): void {
  localStorage.setItem('currentUser', JSON.stringify(user))
}
