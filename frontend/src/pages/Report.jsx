import React from 'react'
import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { AIReport } from '../components/Report/AIReport'

export function Report() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result

  // If a user navigates to /report without a result, send them home
  if (!result) {
    return <Navigate to="/" replace />
  }

  const handleReset = () => {
    navigate('/')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-green-50/50 pt-24 pb-24 px-6">
        <AIReport result={result} onReset={handleReset} />
      </main>
    </>
  )
}
