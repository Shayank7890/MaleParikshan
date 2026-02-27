import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGuest = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await authService.guestLogin()
      login(data.token, data.user)
      navigate('/onboarding')
    } catch {
      setError('Failed to start guest session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian overflow-hidden relative flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/3 rounded-full blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gradient">Male Parikshan</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="btn-ghost text-sm">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2 px-5">
            Register
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse2" />
            <span className="text-accent font-mono text-xs font-medium tracking-widest uppercase">
              Men's Health Platform
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-6xl font-extrabold leading-none mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}>
            <span className="text-white">Strong Body.</span>
            <br />
            <span className="text-gradient">Calm Mind.</span>
            <br />
            <span className="text-white opacity-60">Responsible Man.</span>
          </h2>

          {/* Subtext */}
          <p className="text-muted font-body text-lg leading-relaxed mb-12 max-w-xl mx-auto animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0 }}>
            A complete platform for men's wellness — track your streaks, monitor your mood,
            learn through guided modules, and chat with an AI health assistant.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-base px-8 py-4 glow-accent"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-base px-8 py-4"
            >
              Sign In
            </button>
            <button
              onClick={handleGuest}
              disabled={loading}
              className="btn-ghost text-base px-8 py-4 border border-border rounded-xl"
            >
              {loading ? 'Starting...' : 'Continue as Guest →'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-body">{error}</p>
          )}

          {/* Features grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}>
            {[
              { icon: '◉', label: 'Streak Tracker', desc: 'NoFap & habit tracking' },
              { icon: '◎', label: 'Mood Tracker', desc: 'Daily emotional health' },
              { icon: '◈', label: 'Modules', desc: 'Educational content' },
              { icon: '◐', label: 'AI Chat', desc: 'Personalized guidance' },
            ].map((f) => (
              <div key={f.label} className="card text-center p-4 hover:border-accent/30 transition-colors duration-200 cursor-default">
                <div className="text-accent text-2xl mb-2">{f.icon}</div>
                <div className="font-display text-sm font-semibold text-white mb-1">{f.label}</div>
                <div className="text-xs text-muted font-body">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-muted font-body text-xs border-t border-border">
        <p>Male Parikshan — Men's Health Education Platform</p>
      </footer>
    </div>
  )
}
