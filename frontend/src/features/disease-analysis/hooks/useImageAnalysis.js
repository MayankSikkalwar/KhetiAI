import { useState } from 'react'
import { analyzeCropImage } from '../services/api'

export const useImageAnalysis = () => {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const performAnalysis = async (base64Str) => {
    setStatus('loading')
    setError(null)
    try {
      const data = await analyzeCropImage(base64Str)
      if (data.success) {
        setResult(data)
        setStatus('success')
      } else {
        throw new Error(data.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setResult(null)
    setError(null)
  }

  return { status, result, error, performAnalysis, reset }
}
