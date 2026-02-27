import api from './api'

export interface ChatResponse {
  message: string
  id: string
}

export const chatService = {
  send: async (message: string) => {
    const res = await api.post<ChatResponse>('/chat', { message })
    return res.data
  },
}
