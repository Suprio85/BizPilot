"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

// Central API base (FastAPI running on 8000)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface User {
  id?: string
  email: string
  name: string
  avatarUrl?: string
  plan?: 'free' | 'pro' | 'enterprise'
  location?: string
  businessStage?: string
  language?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export interface SignupData {
  name: string
  email: string
  password: string
  location?: string
  businessStage?: string
  language?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bizpilot_user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setToken(storedToken)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('bizpilot_user')
        localStorage.removeItem('auth_token')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // FastAPI login returns: { access_token, token_type }
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let message = `Login failed: ${response.status}`
        console.log(message)
        try {
          const err = await response.json()
          message = err.detail || err.error?.message || message
        } catch { /* ignore */ }
        throw new Error(message)
      }

      const { access_token } = await response.json()
      if (!access_token) throw new Error('No access token returned')

      // Fetch user profile separately
      const meRes = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      if (!meRes.ok) {
        throw new Error('Failed to load user profile')
      }
      const profile = await meRes.json()

      // Normalize profile to User shape
      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        plan: (profile.plan as any) || 'free',
      }

      setUser(userData)
      setToken(access_token)
      localStorage.setItem('bizpilot_user', JSON.stringify(userData))
      localStorage.setItem('auth_token', access_token)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, role: 'user', auth_provider: 'email' }),
      })
      if (!response.ok) {
        let message = `Signup failed: ${response.status}`
        try {
          const err = await response.json()
            message = err.detail || err.error?.message || message
        } catch { /* ignore */ }
        throw new Error(message)
      }

      // Backend returns the created user (no token). Auto-login with same credentials.
      await login(userData.email, userData.password)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('bizpilot_user')
    localStorage.removeItem('auth_token')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('bizpilot_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}