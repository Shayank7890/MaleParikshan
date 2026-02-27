export interface User {
  id: string
  email?: string
  age: number
  language: 'English' | 'Hindi'
  adultModeEnabled: boolean
}

export interface Profile {
  id: string
  userId: string
  height: number
  weight: number
  bmi: number
  sleepHours: number
  activityLevel: 'Low' | 'Moderate' | 'High'
  goals: string[]
  riskScore: number
  onboardingComplete: boolean
}

export interface Streak {
  currentStreak: number
  longestStreak: number
  targetDays: number
  lastCheckinDate?: string
}

export type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'focused' | 'tired'

export interface MoodEntry {
  id: string
  mood: MoodType
  createdAt: string
}

export interface MoodReport {
  distribution: Record<MoodType, number>
  weeklyTrend: { date: string; mood: MoodType }[]
  dominantMood: MoodType
}

export interface Module {
  id: string
  title: string
  description: string
  content?: string
  completed: boolean
  category: string
  duration: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface DashboardData {
  healthScore: number
  currentStreak: number
  todayMood?: MoodType
  profile?: Partial<Profile>
  user?: User
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  statusCode?: number
}
