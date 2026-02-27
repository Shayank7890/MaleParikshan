import { useState } from 'react'
import { adultService } from '../services/adultService'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../hooks/useTranslation'

export default function AdultModePage() {
  const { user, updateUser } = useAuth()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Age gate
  if (!user || user.age < 18) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="font-display text-2xl font-bold text-white mb-3">{t('adult.title')}</h1>
        <p className="text-muted font-body text-sm max-w-sm">{t('adult.ageRestricted')}</p>
      </div>
    )
  }

  const handleEnable = async () => {
    setLoading(true)
    setError('')
    try {
      await adultService.enable()
      updateUser({ adultModeEnabled: true })
      setShowModal(false)
    } catch {
      setError('Failed to enable adult mode. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">{t('adult.title')}</h1>
        <p className="text-muted font-body text-sm">Advanced health content for verified adults</p>
      </div>

      {user.adultModeEnabled ? (
        <div className="space-y-6">
          {/* Enabled state */}
          <div className="card border-gold/20 bg-gold/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="text-gold text-xl">✓</span>
              </div>
              <div>
                <p className="font-display font-semibold text-white">{t('adult.enabled')}</p>
                <p className="text-muted text-sm font-body">You have access to all adult health content</p>
              </div>
            </div>
          </div>

          {/* Content sections */}
          {[
            {
              icon: '🧬',
              title: 'Sexual Health Education',
              desc: 'Comprehensive guides on sexual wellness, STI prevention, and healthy intimacy.',
            },
            {
              icon: '💪',
              title: 'Advanced Fitness & Nutrition',
              desc: 'Detailed protocols for muscle building, hormone optimization, and performance.',
            },
            {
              icon: '🧠',
              title: 'Mental & Emotional Mastery',
              desc: 'Deep dives into emotional regulation, trauma healing, and relationship dynamics.',
            },
            {
              icon: '⚡',
              title: 'Energy & Hormonal Health',
              desc: 'Understanding testosterone, sleep, and lifestyle for peak performance.',
            },
          ].map((item) => (
            <div key={item.title} className="card hover:border-accent/20 transition-colors duration-200">
              <div className="flex gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-display font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-muted text-sm font-body leading-relaxed">{item.desc}</p>
                  <button className="text-accent text-sm font-display font-medium mt-3 hover:text-accent-dim transition-colors">
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card max-w-lg">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-3xl mx-auto mb-6">
              🔞
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-3">{t('adult.title')}</h2>
            <p className="text-muted font-body text-sm leading-relaxed mb-8">
              {t('adult.description')}
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary px-8 py-4">
              {t('adult.enable')}
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-elevated border border-border rounded-2xl p-8 max-w-md w-full animate-fade-up">
            <div className="text-center mb-6">
              <span className="text-4xl block mb-4">⚠️</span>
              <h3 className="font-display text-xl font-bold text-white mb-2">Age Verification</h3>
            </div>
            <p className="text-white/70 font-body text-sm leading-relaxed mb-6">
              {t('adult.disclaimer')}
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-sm font-body">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1 py-3"
              >
                {t('adult.cancel')}
              </button>
              <button
                onClick={handleEnable}
                disabled={loading}
                className="btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {loading ? 'Enabling...' : t('adult.accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
