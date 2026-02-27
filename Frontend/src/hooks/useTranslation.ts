import { useAuth } from '../context/AuthContext'
import en from '../locales/en.json'
import hi from '../locales/hi.json'

type DeepKeys<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? DeepKeys<T[K], P extends '' ? string & K : `${P}.${string & K}`>
    : P extends '' ? string & K : `${P}.${string & K}`
}[keyof T]

const locales: Record<string, Record<string, unknown>> = { English: en, Hindi: hi }

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

export function useTranslation() {
  const { user } = useAuth()
  const lang = user?.language || 'English'
  const locale = locales[lang] || en

  const t = (key: string): string => {
    return getNestedValue(locale as Record<string, unknown>, key)
  }

  return { t, lang }
}
