import { useState } from 'react'
import { IconLock, IconMail, IconEye, IconEyeOff } from '@tabler/icons-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form
      })

      if (!res.ok) throw new Error('Invalid credentials')

      const data = await res.json()

      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
      })
      const user = await meRes.json()

      sessionStorage.setItem('token', data.access_token)
      sessionStorage.setItem('user', JSON.stringify(user))

      window.location.href = '/dashboard'
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#13131a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[#534AB7] rounded-xl flex items-center justify-center">
            <IconLock size={18} color="white" />
          </div>
          <span className="text-xl font-medium text-gray-900 dark:text-[#e8e6f8]">
            SecureHub
          </span>
        </div>

        <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-2xl p-8">
          <h1 className="text-lg font-medium text-gray-900 dark:text-[#e8e6f8] mb-1">
            Sign in
          </h1>
          <p className="text-sm text-gray-400 dark:text-[#555] mb-6">
            Enter your credentials to access your dashboard
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-[#555] block mb-1.5">
                Email
              </label>
              <div className="relative">
                <IconMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-[#333]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#13131a] border border-gray-200 dark:border-[#2a2a38] rounded-lg text-gray-900 dark:text-[#e8e6f8] placeholder-gray-300 dark:placeholder-[#333] focus:outline-none focus:border-[#534AB7] dark:focus:border-[#7F77DD]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-[#555] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <IconLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-[#333]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-[#13131a] border border-gray-200 dark:border-[#2a2a38] rounded-lg text-gray-900 dark:text-[#e8e6f8] placeholder-gray-300 dark:placeholder-[#333] focus:outline-none focus:border-[#534AB7] dark:focus:border-[#7F77DD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-[#333]"
                >
                  {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#534AB7] hover:bg-[#3B2F9E] text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#2a2a38]">
            <p className="text-xs text-gray-400 dark:text-[#444] text-center mb-2">Demo credentials</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-[#13131a] rounded-lg p-2.5 text-center">
                <p className="text-xs text-gray-400 dark:text-[#555] mb-0.5">Admin</p>
                <p className="text-xs font-medium text-gray-600 dark:text-[#777]">admin@securehub.com</p>
                <p className="text-xs text-gray-400 dark:text-[#555]">admin123</p>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-[#13131a] rounded-lg p-2.5 text-center">
                <p className="text-xs text-gray-400 dark:text-[#555] mb-0.5">Standard</p>
                <p className="text-xs font-medium text-gray-600 dark:text-[#777]">user@securehub.com</p>
                <p className="text-xs text-gray-400 dark:text-[#555]">user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
