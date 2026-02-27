import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  age: z.number().min(13, 'Must be at least 13').max(100, 'Invalid age'),
  language: z.enum(['English', 'Hindi']),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', age: '', language: 'English' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const result = registerSchema.safeParse({
      ...form,
      age: Number(form.age),
    })
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
      const data = await authService.register(
        form.email,
        form.password,
        Number(form.age),
        form.language as 'English' | 'Hindi'
      )
      login(data.token, data.user)
      navigate('/onboarding')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setApiError(msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex">
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-surface border-r border-border p-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal/10 border border-teal/20 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-teal rounded-full" />
            <span className="text-teal font-mono text-xs font-medium tracking-widest uppercase">Free Account</span>
          </div>
          <h3 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Start your<br />
            <span className="text-gradient">wellness journey</span>
          </h3>
          <p className="text-muted font-body leading-relaxed">
            Join thousands of men taking control of their physical and mental health.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-fade-up">
          <div className="mb-8">
            <Link to="/" className="font-display text-xl font-bold text-gradient lg:hidden block mb-6">
              Male Parikshan
            </Link>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Create account</h2>
            <p className="text-muted font-body text-sm">Your journey to better health starts here</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="25"
                  min="13"
                  max="100"
                  className={`input-field ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="label">Language</label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="input-field appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm font-body">{apiError}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-muted font-body text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-dim font-medium transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
