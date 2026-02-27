import api from './api'
import type { MoodType, MoodReport } from '../types'

export const moodService = {
  log: async (mood: MoodType) => {
    const res = await api.post('/mood', { mood })
    return res.data
  },

  getReport: async () => {
    const res = await api.get<MoodReport>('/mood/report')
    return res.data
  },
}
