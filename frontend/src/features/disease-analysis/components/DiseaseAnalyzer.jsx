import React, { useRef, useState, useEffect } from 'react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { useImageAnalysis } from '../hooks/useImageAnalysis'
import { cn } from '../../../utils/cn'
import { useNavigate } from 'react-router-dom'

export function DiseaseAnalyzer() {
  const { status, result, error, performAnalysis, reset } = useImageAnalysis()
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const processFile = (file) => {
    if (!file || !file.type.match('image.*')) return
    const reader = new FileReader()
    reader.onload = (e) => setSelectedImage(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleAnalyze = () => {
    if (selectedImage) performAnalysis(selectedImage)
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'success' && result) {
      navigate('/report', { state: { result } })
    }
  }, [status, result, navigate])

  const handleReset = () => {
    setSelectedImage(null)
    reset()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl" glass>
      <CardContent className="p-8 flex flex-col items-center">
        {!selectedImage ? (
          // Upload Area
          <div
            className={cn(
              "w-full border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer",
              dragActive ? "border-green-500 bg-green-50" : "border-green-200 hover:border-green-400 hover:bg-green-50/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleChange} 
            />
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">Upload Crop Image</h3>
            <p className="text-sm text-green-700/70">Drag and drop or click to browse</p>
            <p className="text-xs text-green-700/50 mt-1">PNG, JPG up to 10MB</p>
          </div>
        ) : (
          // Preview & Status Area
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-inner mb-6">
              <img src={selectedImage} alt="Crop preview" className="w-full h-full object-cover" />
              {status === 'loading' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-green-900 font-medium">Analyzing Crop...</p>
                </div>
              )}
            </div>

            {status === 'idle' && (
              <div className="flex gap-4 w-full justify-center">
                <Button variant="outline" onClick={handleReset}>Cancel</Button>
                <Button onClick={handleAnalyze}>Analyze Crop Status</Button>
              </div>
            )}

            {status === 'error' && (
              <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="font-semibold text-red-900 mb-4">{error}</p>
                <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700">Try Again</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
