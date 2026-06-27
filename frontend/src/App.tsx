import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import PrivateRoute from './auth/PrivateRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Records from './pages/Records'
import Behavior from './pages/Behavior'
import { startTracker, stopTracker } from './tracker/behaviorTracker'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    startTracker()
    return () => stopTracker()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#13131a] overflow-hidden">
      <Sidebar role={user?.role || 'standard'} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route
            path="/behavior"
            element={
              <PrivateRoute adminOnly>
                <Behavior />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
