import api from './api'
import type { Streak } from '../types'

export const streakService = {
  setup: async (targetDays: number) => {
    const res = await api.post<Streak>('/streak/setup', { targetDays })
    return res.data
  },

  checkin: async (status: 'stayed_consistent' | 'resisted_urges' | 'relapsed') => {
    const res = await api.post<Streak>('/streak/checkin', { status })
    return res.data
  },

  get: async () => {
    const res = await api.get<Streak>('/streak')
    return res.data
  },
}
