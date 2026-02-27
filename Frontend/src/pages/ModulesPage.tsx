import { useEffect, useState } from 'react'
import { modulesService } from '../services/modulesService'
import type { Module } from '../types'
import { useTranslation } from '../hooks/useTranslation'

export default function ModulesPage() {
  const { t } = useTranslation()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    modulesService.getAll()
      .then(setModules)
      .catch(() => setError('Failed to load modules.'))
      .finally(() => setLoading(false))
  }, [])

  const handleComplete = async (moduleId: string) => {
    setCompleting(moduleId)
    try {
      await modulesService.markComplete(moduleId)
      setModules((prev) =>
        prev.map((m) => m.id === moduleId ? { ...m, completed: true } : m)
      )
    } catch {
      setError('Failed to mark module as complete.')
    } finally {
      setCompleting(null)
    }
  }

  const completedCount = modules.filter((m) => m.completed).length
  const progress = modules.length > 0 ? (completedCount / modules.length) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">{t('modules.title')}</h1>
        <p className="text-muted font-body text-sm">Expand your knowledge. Improve your life.</p>
      </div>

      {/* Progress */}
      {modules.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-semibold text-white text-sm">Overall Progress</p>
            <p className="font-mono text-accent text-sm">{completedCount}/{modules.length}</p>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-teal to-accent rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted text-xs font-body mt-2">{Math.round(progress)}% complete</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm font-body">{error}</p>
        </div>
      )}

      {modules.length === 0 && !error && (
        <div className="card text-center py-16">
          <p className="text-4xl mb-4">📚</p>
          <p className="font-display text-lg font-semibold text-white mb-2">No modules yet</p>
          <p className="text-muted text-sm font-body">Check back soon for new learning content.</p>
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`card transition-all duration-200 ${
              module.completed ? 'border-teal/20' : 'hover:border-accent/20'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === module.id ? null : module.id)}
            >
              <div className="flex items-center gap-4">
                {/* Completion indicator */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  module.completed
                    ? 'bg-teal/10 border border-teal/30'
                    : 'bg-surface border border-border'
                }`}>
                  {module.completed ? (
                    <span className="text-teal text-sm">✓</span>
                  ) : (
                    <span className="font-mono text-muted text-xs font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-semibold text-white text-sm">{module.title}</h3>
                    {module.completed && (
                      <span className="badge bg-teal/10 text-teal border border-teal/20">
                        {t('modules.completed')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-xs font-body">{module.category}</span>
                    <span className="text-muted text-xs font-body">·</span>
                    <span className="text-muted text-xs font-body">
                      {t('modules.duration')}: {module.duration}
                    </span>
                  </div>
                </div>
              </div>

              <span className={`text-muted transition-transform duration-200 ${
                expandedId === module.id ? 'rotate-180' : ''
              }`}>
                ↓
              </span>
            </div>

            {/* Expanded content */}
            {expandedId === module.id && (
              <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                <p className="text-white/70 font-body text-sm leading-relaxed mb-4">
                  {module.description}
                </p>
                {module.content && (
                  <div className="bg-surface rounded-xl p-4 mb-4 border border-border">
                    <p className="text-white/60 font-body text-sm leading-relaxed">{module.content}</p>
                  </div>
                )}
                {!module.completed && (
                  <button
                    onClick={() => handleComplete(module.id)}
                    disabled={completing === module.id}
                    className="btn-secondary text-sm py-2.5 px-5 disabled:opacity-50"
                  >
                    {completing === module.id ? 'Saving...' : `✓ ${t('modules.markComplete')}`}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
