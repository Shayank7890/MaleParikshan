import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import type { DashboardData, MoodType } from '../types'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../hooks/useTranslation'

const MOOD_EMOJI: Record<MoodType, string> = {
  happy: '😊',
  calm: '😌',
  anxious: '😰',
  sad: '😢',
  angry: '😠',
  focused: '🎯',
  tired: '😴',
}

const quickLinks = [
  { to: '/modules', icon: '◈', label: 'Modules', desc: 'Continue learning', color: 'text-teal' },
  { to: '/streak', icon: '◉', label: 'Streak', desc: 'Daily check-in', color: 'text-accent' },
  { to: '/mood', icon: '◎', label: 'Mood', desc: 'Log your mood', color: 'text-gold' },
  { to: '/chat', icon: '◐', label: 'AI Chat', desc: 'Ask anything', color: 'text-purple-400' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardService.get()
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <p className="text-muted font-body text-sm mb-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-display text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
          <span className="text-gradient">{user?.email?.split('@')[0] || 'Champion'}</span>
        </h1>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-yellow-400 text-sm font-body">{error} — showing demo data</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card border-gradient glow-accent">
          <p className="text-muted font-body text-xs uppercase tracking-widest mb-3">{t('dashboard.healthScore')}</p>
          <p className="font-display text-5xl font-extrabold text-gradient mb-1">
            {data?.healthScore ?? '—'}
          </p>
          <p className="text-muted text-xs font-body">out of 100</p>
        </div>

        <div className="card">
          <p className="text-muted font-body text-xs uppercase tracking-widest mb-3">{t('dashboard.currentStreak')}</p>
          <div className="flex items-end gap-2 mb-1">
            <p className="font-display text-5xl font-extrabold text-white">
              {data?.currentStreak ?? 0}
            </p>
            <p className="text-muted text-sm font-body mb-2">{t('dashboard.days')}</p>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i < (data?.currentStreak ?? 0) % 7 ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <p className="text-muted font-body text-xs uppercase tracking-widest mb-3">{t('dashboard.todayMood')}</p>
          {data?.todayMood ? (
            <>
              <p className="text-4xl mb-1">{MOOD_EMOJI[data.todayMood]}</p>
              <p className="font-display text-sm font-medium text-white capitalize">{data.todayMood}</p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-1 opacity-30">😐</p>
              <p className="font-body text-xs text-muted">{t('dashboard.notLogged')}</p>
            </>
          )}
        </div>
      </div>

      {/* Quick navigation */}
      <div>
        <h2 className="font-display text-lg font-semibold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="card hover:border-accent/30 transition-all duration-200 group cursor-pointer"
            >
              <span className={`text-2xl block mb-3 group-hover:scale-110 transition-transform duration-200 ${link.color}`}>
                {link.icon}
              </span>
              <p className="font-display font-semibold text-white text-sm mb-1">{link.label}</p>
              <p className="font-body text-muted text-xs">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Profile summary */}
      {data?.profile && (
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Health Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'BMI', value: data.profile.bmi?.toFixed(1) },
              { label: 'Activity', value: data.profile.activityLevel },
              { label: 'Sleep', value: data.profile.sleepHours ? `${data.profile.sleepHours}h` : '—' },
              { label: 'Risk Score', value: data.profile.riskScore },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-4 rounded-xl bg-surface border border-border">
                <p className="font-display text-xl font-bold text-white mb-1">{stat.value ?? '—'}</p>
                <p className="font-body text-xs text-muted uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
