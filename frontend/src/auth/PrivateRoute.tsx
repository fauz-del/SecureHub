import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function PrivateRoute({ children, adminOnly = false }: PrivateRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#13131a]">
        <div className="w-6 h-6 border-2 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
