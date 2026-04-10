import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { FinanceDashboard } from '../features/finance/components/FinanceDashboard'
import { Card, CardContent } from '../components/common/Card'
import { IndianRupee, Landmark, TrendingUp } from 'lucide-react'

export function Schemes() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-green-50/50 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-green-950 mb-4">Schemes & Finance</h1>
            <p className="text-green-800/70 max-w-2xl">
              Access government agricultural schemes and use our smart financial tools to calculate EMI and plan your cultivation budget efficiently.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Schemes List (Placeholder) */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Latest Schemes
              </h2>
              <SchemeItem 
                title="PM-Kisan Samman Nidhi" 
                desc="Direct income support of ₹6,000 per year to farmer families."
                url="https://pmkisan.gov.in/"
              />
              <SchemeItem 
                title="Pradhan Mantri Fasal Bima Yojana" 
                desc="Low premium crop insurance for all food & oilseed crops."
                url="https://pmfby.gov.in/"
              />
              <SchemeItem 
                title="Soil Health Card Scheme" 
                desc="Helps farmers understand soil nutrient status and fertilizer needs."
                url="https://soilhealth.dac.gov.in/"
              />
            </div>

            {/* Right Column: Finance Tools */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Financial Decision Tools
                  </h2>
               </div>
               <FinanceDashboard />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SchemeItem({ title, desc, url }) {
  return (
    <Card className="hover:border-green-300 transition-all cursor-pointer group">
      <CardContent className="p-5">
        <h3 className="font-bold text-green-900 mb-1 group-hover:text-green-600 transition-colors">{title}</h3>
        <p className="text-sm text-green-800/60 leading-relaxed">{desc}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1 inline-flex"
        >
          Apply Now
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </CardContent>
    </Card>
  )
}
