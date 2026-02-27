import api from './api'

export const adultService = {
  enable: async () => {
    const res = await api.post('/adult/enable', { consentAccepted: true })
    return res.data
  },
}
