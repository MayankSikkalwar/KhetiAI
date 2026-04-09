import React from 'react'
import { Button } from '../common/Button'
import { ArrowRight, Activity, Droplets } from 'lucide-react'

// Wide smart agriculture image
const HERO_BG = "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2671&auto=format&fit=crop"

export function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 -z-10">
        <img src={HERO_BG} alt="Smart Agriculture" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Content */}
        <div className="md:w-1/2 text-white drop-shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6 text-sm drop-shadow-lg shadow-black/50 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            AI-Powered Crop Detection v2.0
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            Bring <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Growth</span> to<br/>
            Fresh Agriculture.
          </h1>
          
          <p className="text-lg text-white font-medium mb-8 max-w-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Empower your farming with AI-driven insights. Detect diseases early, increase crop yield, and make data-backed decisions.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gap-2">
              Start Scanning <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm">
              View Demo
            </Button>
          </div>
        </div>

        {/* Right Floating Dashboard (Glassmorphism feature) */}
        <div className="md:w-5/12 mt-12 md:mt-0 w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl relative">
            {/* Fake Dashboard Elements */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-medium">Farm Overview</h3>
              <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-md">Live</div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl text-blue-300">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Soil Moisture</p>
                  <p className="text-white font-bold text-xl">42% <span className="text-sm font-normal text-green-400">Optimal</span></p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl text-amber-300">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Crop Health</p>
                  <p className="text-white font-bold text-xl">98% <span className="text-sm font-normal text-green-400">+2%</span></p>
                </div>
              </div>
            </div>
            
            {/* Diagnostic UI Element Overlap */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-green-100 flex items-center gap-3">
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <p className="text-xs text-green-800/60 font-medium">System Status</p>
                <p className="text-sm font-bold text-green-900">Secure & Active</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
