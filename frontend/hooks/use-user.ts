"use client"

import { useAuth } from "@/contexts/auth-context"

/**
 * Convenience hook to access current user data
 */
export function useUser() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth()
  
  return {
    user,
    isAuthenticated,
    isLoading,
    updateUser,
    // Convenience getters
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPlan: user?.plan || 'free',
    userId: user?.id || '',
    userAvatar: user?.avatarUrl || '',
  }
}

/**
 * Convenience hook to check authentication status
 */
export function useAuthStatus() {
  const { isAuthenticated, isLoading } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated && !isLoading,
  }
}