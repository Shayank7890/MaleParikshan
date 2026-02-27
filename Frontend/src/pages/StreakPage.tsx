import { useEffect, useState } from 'react'
import { streakService } from '../services/streakService'
import type { Streak } from '../types'
import { useTranslation } from '../hooks/useTranslation'

type CheckinStatus = 'stayed_consistent' | 'resisted_urges' | 'relapsed'

export default function StreakPage() {
  const { t } = useTranslation()
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)
  const [setupMode, setSetupMode] = useState(false)
  const [targetDays, setTargetDays] = useState('30')
  const [checkinLoading, setCheckinLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    streakService.get()
      .then(setStreak)
      .catch(() => setSetupMode(true))
      .finally(() => setLoading(false))
  }, [])

  const handleSetup = async () => {
    setError('')
    setLoading(true)
    try {
      const s = await streakService.setup(Number(targetDays))
      setStreak(s)
      setSetupMode(false)
    } catch {
      setError('Failed to setup streak. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async (status: CheckinStatus) => {
    setCheckinLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const updated = await streakService.checkin(status)
      setStreak(updated)
      setSuccessMsg(
        status === 'relapsed'
          ? "It happens. Reset and restart stronger. 💪"
          : "Great job! Keep going! 🔥"
      )
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setError('Failed to record check-in.')
    } finally {
      setCheckinLoading(false)
    }
  }

  const progress = streak ? Math.min((streak.currentStreak / streak.targetDays) * 100, 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (setupMode) {
    return (
      <div className="max-w-md mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">{t('streak.setup')}</h1>
          <p className="text-muted font-body text-sm">Set your commitment target to get started</p>
        </div>

        <div className="card">
          <label className="label">{t('streak.targetDays')}</label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['7', '21', '30', '60', '90', '365'].map((d) => (
              <button
                key={d}
                onClick={() => setTargetDays(d)}
                className={`py-3 rounded-xl font-mono font-bold text-sm transition-all duration-200 border ${
                  targetDays === d
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-surface border-border text-muted hover:border-subtle hover:text-white'
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
          <input
            type="number"
            value={targetDays}
            onChange={(e) => setTargetDays(e.target.value)}
            placeholder="Custom days"
            className="input-field mb-4"
            min="1"
            max="365"
          />
          {error && <p className="text-red-400 text-sm font-body mb-4">{error}</p>}
          <button onClick={handleSetup} className="btn-primary w-full py-4">
            {t('streak.start')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">{t('streak.title')}</h1>
        <p className="text-muted font-body text-sm">Stay consistent. Build discipline.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-muted text-xs uppercase tracking-widest font-body mb-3">{t('streak.current')}</p>
          <p className="font-display text-6xl font-extrabold text-gradient mb-1">
            {streak?.currentStreak ?? 0}
          </p>
          <p className="text-muted text-xs font-body">days</p>
        </div>
        <div className="card text-center">
          <p className="text-muted text-xs uppercase tracking-widest font-body mb-3">{t('streak.longest')}</p>
          <p className="font-display text-6xl font-extrabold text-white mb-1">
            {streak?.longestStreak ?? 0}
          </p>
          <p className="text-muted text-xs font-body">days</p>
        </div>
        <div className="card text-center">
          <p className="text-muted text-xs uppercase tracking-widest font-body mb-3">{t('streak.target')}</p>
          <p className="font-display text-6xl font-extrabold text-gold mb-1">
            {streak?.targetDays ?? 30}
          </p>
          <p className="text-muted text-xs font-body">days</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-semibold text-white text-sm">Progress to Goal</p>
          <p className="font-mono text-accent text-sm">{Math.round(progress)}%</p>
        </div>
        <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-accent to-gold rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted text-xs font-body mt-2">
          {(streak?.targetDays ?? 30) - (streak?.currentStreak ?? 0)} days remaining
        </p>
      </div>

      {/* Daily check-in */}
      <div className="card">
        <h2 className="font-display text-lg font-semibold text-white mb-2">{t('streak.checkin')}</h2>
        <p className="text-muted text-sm font-body mb-6">How did you do today?</p>

        {successMsg && (
          <div className="bg-teal/10 border border-teal/20 rounded-xl p-3 mb-4">
            <p className="text-teal text-sm font-body">{successMsg}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-sm font-body">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleCheckin('stayed_consistent')}
            disabled={checkinLoading}
            className="py-5 rounded-xl border border-teal/30 bg-teal/5 hover:bg-teal/10 text-teal font-display font-semibold text-sm transition-all duration-200 disabled:opacity-50 active:scale-95"
          >
            <span className="text-2xl block mb-2">✓</span>
            {t('streak.consistent')}
          </button>
          <button
            onClick={() => handleCheckin('resisted_urges')}
            disabled={checkinLoading}
            className="py-5 rounded-xl border border-gold/30 bg-gold/5 hover:bg-gold/10 text-gold font-display font-semibold text-sm transition-all duration-200 disabled:opacity-50 active:scale-95"
          >
            <span className="text-2xl block mb-2">🛡</span>
            {t('streak.resisted')}
          </button>
          <button
            onClick={() => handleCheckin('relapsed')}
            disabled={checkinLoading}
            className="py-5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-display font-semibold text-sm transition-all duration-200 disabled:opacity-50 active:scale-95"
          >
            <span className="text-2xl block mb-2">↩</span>
            {t('streak.relapsed')}
          </button>
        </div>
      </div>

      {/* Streak calendar dots */}
      <div className="card">
        <h2 className="font-display text-sm font-semibold text-muted uppercase tracking-widest mb-4">
          Last 30 days
        </h2>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const daysAgo = 29 - i
            const isActive = daysAgo < (streak?.currentStreak ?? 0)
            return (
              <div
                key={i}
                title={`${daysAgo} days ago`}
                className={`aspect-square rounded-md transition-all duration-200 ${
                  isActive ? 'bg-accent' : 'bg-surface border border-border'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
