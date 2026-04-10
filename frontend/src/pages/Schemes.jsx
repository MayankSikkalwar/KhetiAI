import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { FinanceDashboard } from '../features/finance/components/FinanceDashboard'
import { Card, CardContent } from '../components/common/Card'
import { 
  Landmark, 
  TrendingUp, 
  ChevronDown, 
  Sprout, 
  Wheat, 
  Apple, 
  Carrot, 
  ExternalLink 
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const SCHEMES_DATA = {
  General: [
    {
      title: "PM-Kisan Samman Nidhi",
      desc: "Direct income support of ₹6,000 per year to all landholding farmer families in three equal installments.",
      url: "https://pmkisan.gov.in/"
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      desc: "Comprehensive crop insurance to provide financial support to farmers suffering crop loss/damage.",
      url: "https://pmfby.gov.in/"
    },
    {
      title: "Kisan Credit Card (KCC)",
      desc: "Provides farmers with timely access to credit for cultivation and other needs at subsidized interest rates.",
      url: "https://www.myscheme.gov.in/schemes/kcc"
    }
  ],
  Rice: [
    {
      title: "NFSM - Rice",
      desc: "National Food Security Mission focused on increasing rice productivity through area expansion.",
      url: "https://nfsm.gov.in/Default.aspx"
    },
    {
      title: "BGREI",
      desc: "Bringing Green Revolution to Eastern India - targetting rice-based cropping systems.",
      url: "https://rkvy.nic.in/"
    }
  ],
  Wheat: [
    {
      title: "NFSM - Wheat",
      desc: "Improving wheat production and productivity through technological interventions and soil health.",
      url: "https://nfsm.gov.in/Default.aspx"
    },
    {
      title: "Minimum Support Price (MSP)",
      desc: "Guaranteed price for wheat to ensure fair returns and encourage production.",
      url: "https://agriwelfare.gov.in/en/MSP"
    }
  ],
  Fruits: [
    {
      title: "MIDH - Horticulture",
      desc: "Mission for Integrated Development of Horticulture covering all fruits and nursery management.",
      url: "https://midh.gov.in/"
    },
    {
      title: "National Horticulture Board",
      desc: "Financial assistance for high-tech horticulture and post-harvest infrastructure.",
      url: "https://nhb.gov.in/"
    }
  ],
  Vegetables: [
    {
      title: "Operation Greens",
      desc: "Special focus on Tomato, Onion, and Potato (TOP) crops to stabilize supply and prices.",
      url: "https://www.mofpi.gov.in/Schemes/operation-greens"
    },
    {
      title: "Market Intervention Scheme",
      desc: "Protects growers of perishable commodities from distress sales during peak harvest.",
      url: "https://agriwelfare.gov.in/"
    }
  ]
}

const CATEGORIES = [
  { id: 'General', icon: Landmark },
  { id: 'Rice', icon: Sprout },
  { id: 'Wheat', icon: Wheat },
  { id: 'Fruits', icon: Apple },
  { id: 'Vegetables', icon: Carrot },
]

export function Schemes() {
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-green-50/50 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-green-950 mb-4">Schemes & Finance</h1>
              <p className="text-green-800/70 max-w-2xl">
                Access government agricultural schemes and use our smart financial tools to calculate EMI and plan your cultivation budget efficiently.
              </p>
            </div>

            {/* Premium Category Dropdown */}
            <div className="relative w-full md:w-64">
              <label className="block text-xs font-bold text-green-900/40 uppercase tracking-widest mb-2 px-1">
                Select Category
              </label>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-green-100 rounded-2xl shadow-sm hover:border-green-300 transition-all text-green-900 font-medium group"
              >
                <div className="flex items-center gap-3">
                  {React.createElement(CATEGORIES.find(c => c.id === selectedCategory)?.icon || Landmark, { className: "w-5 h-5 text-green-600" })}
                  {selectedCategory}
                </div>
                <ChevronDown className={cn("w-4 h-4 text-green-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-green-50 rounded-2xl shadow-xl shadow-green-900/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setIsDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-green-50",
                        selectedCategory === cat.id ? "text-green-700 bg-green-50/50 font-bold" : "text-green-900/70"
                      )}
                    >
                      <cat.icon className={cn("w-4 h-4", selectedCategory === cat.id ? "text-green-600" : "text-green-400")} />
                      {cat.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Schemes List */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-2">
                <Landmark className="w-5 h-5" />
                {selectedCategory} Schemes
              </h2>
              
              <div className="space-y-4">
                {SCHEMES_DATA[selectedCategory].map((scheme, idx) => (
                  <SchemeItem 
                    key={idx}
                    title={scheme.title} 
                    desc={scheme.desc}
                    url={scheme.url}
                  />
                ))}
              </div>

              {/* Info Card */}
              <div className="p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl text-white shadow-lg shadow-green-900/20">
                <p className="text-sm font-medium opacity-90 leading-relaxed mb-4">
                  Need help with applications? Our AI assistant can guide you through the eligibility criteria for these schemes.
                </p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors">
                  Ask Kheti-AI
                </button>
              </div>
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
    <Card className="hover:border-green-300 transition-all cursor-pointer group hover:shadow-md hover:-translate-y-0.5 border-green-50 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-green-900 group-hover:text-green-600 transition-colors leading-tight">
            {title}
          </h3>
          <ExternalLink className="w-4 h-4 text-green-300 group-hover:text-green-500 transition-colors shrink-0 mt-1" />
        </div>
        <p className="text-sm text-green-800/60 leading-relaxed line-clamp-2 mb-4">{desc}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1 inline-flex hover:underline underline-offset-4"
        >
          Official Website
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </CardContent>
    </Card>
  )
}
