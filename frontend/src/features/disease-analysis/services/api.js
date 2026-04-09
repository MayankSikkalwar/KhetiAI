export const API_BASE_URL = '' // Empty string defaults to current host (handled by Vite proxy)

export const analyzeCropImage = async (base64Image) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, crop_type: 'unknown' })
    })
    
    if (!response.ok) throw new Error('Analysis failed. Please try again.')
    return await response.json()
  } catch (error) {
    throw error
  }
}
