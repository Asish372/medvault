import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Demo users data
const DEMO_USERS = {
  admin: {
    id: 'demo-admin-001',
    name: 'Dr. Admin Smith',
    email: 'admin@medvault.com',
    role: 'admin',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    specialization: 'Healthcare Administration',
    licenseNumber: 'ADM-2024-001',
    dateOfBirth: '1980-05-15',
    bio: 'Experienced healthcare administrator with 15+ years in medical facility management.'
  },
  doctor: {
    id: 'demo-doctor-001',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@medvault.com',
    role: 'doctor',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    specialization: 'Cardiology',
    licenseNumber: 'MD-2024-001',
    dateOfBirth: '1985-08-22',
    bio: 'Board-certified cardiologist specializing in preventive cardiology and heart disease management.'
  },
  patient: {
    id: 'demo-patient-001',
    name: 'John Doe',
    email: 'patient@medvault.com',
    role: 'patient',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1990-12-10',
    bio: 'Regular patient focused on maintaining good health through preventive care.'
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('token')
      const demoUser = localStorage.getItem('demoUser')
      
      if (demoUser) {
        // Handle demo user
        const userData = JSON.parse(demoUser)
        setUser(userData)
      } else if (token) {
        // Handle real authentication
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Auth check failed:', error)
          Cookies.remove('token')
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      
      // Check if it's a demo login
      const demoUser = Object.values(DEMO_USERS).find(
        user => user.email === credentials.email
      )
      
      if (demoUser && credentials.password === 'demo123') {
        // Demo login
        localStorage.setItem('demoUser', JSON.stringify(demoUser))
        setUser(demoUser)
        toast.success(`Welcome back, ${demoUser.name}!`)
        return { success: true, user: demoUser }
      }
      
      // Real authentication
      const response = await authService.login(credentials)
      
      if (response.token) {
        Cookies.set('token', response.token, { expires: 7 })
        setUser(response.user)
        toast.success(`Welcome back, ${response.user.name}!`)
        return { success: true, user: response.user }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async (role) => {
    try {
      setLoading(true)
      const demoUser = DEMO_USERS[role]
      
      if (demoUser) {
        localStorage.setItem('demoUser', JSON.stringify(demoUser))
        setUser(demoUser)
        toast.success(`Demo login successful! Welcome, ${demoUser.name}`)
        return { success: true, user: demoUser }
      } else {
        toast.error('Demo user not found')
        return { success: false, message: 'Demo user not found' }
      }
    } catch (error) {
      toast.error('Demo login failed')
      return { success: false, message: 'Demo login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      
      if (response.token) {
        Cookies.set('token', response.token, { expires: 7 })
        setUser(response.user)
        toast.success(`Welcome to MedVault, ${response.user.name}!`)
        return { success: true, user: response.user }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    localStorage.removeItem('demoUser')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    // Update demo user in localStorage if it's a demo user
    if (localStorage.getItem('demoUser')) {
      localStorage.setItem('demoUser', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    loading,
    login,
    demoLogin,
    register,
    logout,
    updateUser,
    checkAuthStatus,
    DEMO_USERS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
