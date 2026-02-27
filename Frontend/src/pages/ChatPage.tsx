import { useState, useRef, useEffect } from 'react'
import { chatService } from '../services/chatService'
import type { ChatMessage } from '../types'
import { useTranslation } from '../hooks/useTranslation'

const SUGGESTIONS = [
  'How to improve sleep quality?',
  'What is NoFap and its benefits?',
  'Tips for managing stress and anxiety',
  'How to build a morning routine?',
]

export default function ChatPage() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await chatService.send(text)
      const assistantMsg: ChatMessage = {
        id: res.id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.message,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white mb-2">{t('chat.title')}</h1>
        <p className="text-muted font-body text-sm">Ask anything about men's health, wellness, and habits</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-gold/20 border border-accent/20 flex items-center justify-center text-3xl">
              ◐
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-semibold text-white mb-2">AI Health Assistant</p>
              <p className="text-muted font-body text-sm max-w-sm">
                Ask me anything about men's health, nutrition, mental wellness, habits, and more.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 rounded-xl bg-elevated border border-border hover:border-accent/30 text-muted hover:text-white text-xs font-body transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-gold/20 border border-accent/20 flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-1">
                ◐
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 font-body text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-tr-sm'
                  : 'bg-elevated border border-border text-white/85 rounded-tl-sm'
              }`}
            >
              {msg.content}
              <p className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-white/50' : 'text-muted'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-gold/20 border border-accent/20 flex items-center justify-center text-xs mr-3 flex-shrink-0">
              ◐
            </div>
            <div className="bg-elevated border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-muted rounded-full animate-pulse2"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-elevated border border-border rounded-2xl p-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-muted font-body text-sm focus:outline-none"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('chat.send')}
        </button>
      </div>
    </div>
  )
}
