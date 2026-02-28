import api from './api'
import type { AuthResponse } from '../types'

export const authService = {
  register: async (email: string, password: string, age: number, language: 'English' | 'Hindi' = 'English') => {
    const res = await api.post('/auth/register', { email, password, age, language })
    return res.data.data as AuthResponse  // ← changed from res.data to res.data.data
  },

  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data.data as AuthResponse  // ← changed from res.data to res.data.data
  },

  guestLogin: async () => {
    const res = await api.post('/auth/guest')
    return res.data.data as AuthResponse  // ← changed from res.data to res.data.data
  },
}