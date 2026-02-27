import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const data = await authService.login(form.email, form.password)
      login(data.token, data.user)
      // Check onboarding
      try {
        const profile = await profileService.getMe()
        if (!profile || !profile.onboardingComplete) {
          navigate('/onboarding')
        } else {
          navigate('/dashboard')
        }
      } catch {
        navigate('/onboarding')
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setApiError(msg || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-surface border-r border-border p-16 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Link to="/" className="font-display text-3xl font-bold text-gradient block mb-4">
            Male Parikshan
          </Link>
          <p className="font-body text-muted text-lg leading-relaxed mb-12">
            Strong Body. Calm Mind.<br />Responsible Man.
          </p>
          <div className="space-y-4">
            {['Track daily streaks & habits', 'Monitor your emotional health', 'Learn through guided modules', 'Chat with AI health assistant'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="font-body text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8">
            <Link to="/" className="font-display text-xl font-bold text-gradient lg:hidden block mb-6">
              Male Parikshan
            </Link>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-muted font-body text-sm">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-body">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1 font-body">{errors.password}</p>}
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm font-body">{apiError}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted font-body text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-dim font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <p className="mt-3 text-center">
            <Link to="/" className="text-muted hover:text-white font-body text-sm transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
