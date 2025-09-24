"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

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
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Login failed: ${response.status}`)
      }

      const data = await response.json()
      const { token: authToken, user: userData } = data

      // Store in state and localStorage
      setUser(userData)
      setToken(authToken)
      localStorage.setItem('bizpilot_user', JSON.stringify(userData))
      localStorage.setItem('auth_token', authToken)

    } catch (error) {
      console.error('Login error:', error)
      
      // Fallback to mock data for development
      const mockUser = { email, name: 'User', plan: 'free' as const }
      const mockToken = 'demo-token'
      
      setUser(mockUser)
      setToken(mockToken)
      localStorage.setItem('bizpilot_user', JSON.stringify(mockUser))
      localStorage.setItem('auth_token', mockToken)
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Signup failed: ${response.status}`)
      }

      const data = await response.json()
      const { token: authToken, user: newUser } = data

      // Store in state and localStorage
      setUser(newUser)
      setToken(authToken)
      localStorage.setItem('bizpilot_user', JSON.stringify(newUser))
      localStorage.setItem('auth_token', authToken)

    } catch (error) {
      console.error('Signup error:', error)
      
      // Fallback to mock data for development
      const mockUser = { 
        email: userData.email, 
        name: userData.name, 
        plan: 'free' as const,
        location: userData.location,
        businessStage: userData.businessStage,
        language: userData.language
      }
      const mockToken = 'demo-token'
      
      setUser(mockUser)
      setToken(mockToken)
      localStorage.setItem('bizpilot_user', JSON.stringify(mockUser))
      localStorage.setItem('auth_token', mockToken)
      
      throw error
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