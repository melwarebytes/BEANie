// frontend/src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute: Wrap routes that require authentication.
 * Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/auth" replace />
  }
  return children
}