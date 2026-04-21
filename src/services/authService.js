// Authentication Service
// This is a mock service for development. Replace with real API calls in production.

import { getMirroredAuthToken } from '../lib/authStorage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user database (replace with real database)
const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')

const saveMockUsers = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users))
}

// Generate mock JWT token
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
  return btoa(JSON.stringify(payload))
}

// Decode token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Register new user
export const register = async (userData) => {
  await delay(800) // Simulate network delay
  
  const { firstName, lastName, email, password } = userData
  
  // Validation
  if (!firstName || !lastName || !email || !password) {
    throw new Error('All fields are required')
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email address')
  }
  
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors[0])
  }
  
  // Check if user exists
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (existingUser) {
    throw new Error('User with this email already exists')
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: btoa(password), // In production, use proper hashing (bcrypt)
    createdAt: new Date().toISOString(),
    orders: [],
    addresses: []
  }
  
  users.push(newUser)
  saveMockUsers(users)
  
  // Generate token
  const token = generateToken(newUser)
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  
  return {
    token,
    user: userWithoutPassword
  }
}

// Login user
export const login = async (email, password, rememberMe = false) => {
  await delay(800) // Simulate network delay
  
  if (!email || !password) {
    throw new Error('Email and password are required')
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email address')
  }
  
  // Find user
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    throw new Error('Invalid email or password')
  }
  
  // Check password
  const decodedPassword = atob(user.password)
  if (decodedPassword !== password) {
    throw new Error('Invalid email or password')
  }
  
  // Generate token
  const token = generateToken(user)
  
  // Store remember me preference
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true')
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  
  return {
    token,
    user: userWithoutPassword
  }
}

// Logout user
export const logout = async () => {
  await delay(300)
  localStorage.removeItem('authToken')
  try {
    sessionStorage.removeItem('authToken')
  } catch {
    /* ignore */
  }
  localStorage.removeItem('rememberMe')
  return { success: true }
}

// Verify token
export const verifyToken = async (token) => {
  await delay(300)
  
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = decodeToken(token)
  
  if (!decoded) {
    throw new Error('Invalid token')
  }
  
  // Check if token expired
  if (decoded.exp < Date.now()) {
    throw new Error('Token expired')
  }
  
  // Find user
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
  const user = users.find(u => u.id === decoded.userId)
  
  if (!user) {
    throw new Error('User not found')
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  
  return {
    user: userWithoutPassword
  }
}

// Get current user
export const getCurrentUser = async () => {
  const token = getMirroredAuthToken()
  
  if (!token) {
    throw new Error('Not authenticated')
  }
  
  return verifyToken(token)
}

// Update user profile
export const updateProfile = async (userId, updates) => {
  await delay(500)
  
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    password: users[userIndex].password // Don't update password here
  }
  
  saveMockUsers(users)
  
  const { password: _, ...userWithoutPassword } = users[userIndex]
  
  return {
    user: userWithoutPassword
  }
}

// Change password
export const changePassword = async (userId, currentPassword, newPassword) => {
  await delay(500)
  
  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors[0])
  }
  
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]')
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  // Verify current password
  const decodedPassword = atob(users[userIndex].password)
  if (decodedPassword !== currentPassword) {
    throw new Error('Current password is incorrect')
  }
  
  // Update password
  users[userIndex].password = btoa(newPassword)
  saveMockUsers(users)
  
  return { success: true }
}

export default {
  register,
  login,
  logout,
  verifyToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  validatePassword,
  isValidEmail
}
