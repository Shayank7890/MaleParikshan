import api from "./api"

export const chatService = {
  async send(
    message: string,
    mode: "normal" | "adult" = "normal"
  ) {
    const res = await api.post("/chat", {
      message,
      mode,
    })

    // Backend returns:
    // {
    //   success: true,
    //   data: { message, response, timestamp }
    // }

    return res.data.data
  },
}