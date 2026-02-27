import api from './api'
import type { AuthResponse } from '../types'

export const authService = {
  register: async (email: string, password: string, age: number, language: 'English' | 'Hindi' = 'English') => {
    const res = await api.post<AuthResponse>('/auth/register', { email, password, age, language })
    return res.data
  },

  login: async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password })
    return res.data
  },

  guestLogin: async () => {
    const res = await api.post<AuthResponse>('/auth/guest')
    return res.data
  },
}
