import client from './client'
import { AuthToken } from '../types'

export const login = async (email: string, password: string): Promise<AuthToken> => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await client.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}

export const register = async (email: string, password: string, role: string) => {
  const res = await client.post('/auth/register', { email, password, role })
  return res.data
}

export const getMe = async () => {
  const res = await client.get('/auth/me')
  return res.data
}