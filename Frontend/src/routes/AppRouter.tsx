import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import OnboardingPage from '../pages/OnboardingPage'
import DashboardPage from '../pages/DashboardPage'
import StreakPage from '../pages/StreakPage'
import MoodPage from '../pages/MoodPage'
import ModulesPage from '../pages/ModulesPage'
import ChatPage from '../pages/ChatPage'
import AdultModePage from '../pages/AdultModePage'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../layouts/AppLayout'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Onboarding (requires auth) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* App pages (requires auth + layout) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/streak"
        element={
          <ProtectedRoute>
            <AppLayout>
              <StreakPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mood"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MoodPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ModulesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChatPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adult"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdultModePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
