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
import { useLanguage } from '../context/LanguageContext'
import translations from '../i18n/translations'
import { useChat } from '../context/ChatContext'

// Utility for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const SCHEMES_DATA = {
  General: [
    {
      title: "PM-Kisan Samman Nidhi",
      desc: "Direct income support of ₹6,000 per year to all landholding farmer families in three equal installments.",
      url: "https://pmkisan.gov.in/",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      desc: "Comprehensive crop insurance to provide financial support to farmers suffering crop loss/damage.",
      url: "https://pmfby.gov.in/",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    },
    {
      title: "Kisan Credit Card (KCC)",
      desc: "Provides farmers with timely access to credit for cultivation and other needs at subsidized interest rates.",
      url: "https://www.myscheme.gov.in/schemes/kcc",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    }
  ],
  Rice: [
    {
      title: "NFSM - Rice",
      desc: "National Food Security Mission focused on increasing rice productivity through area expansion.",
      url: "https://nfsm.gov.in/Default.aspx",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    },
    {
      title: "BGREI",
      desc: "Bringing Green Revolution to Eastern India - targetting rice-based cropping systems.",
      url: "https://rkvy.nic.in/",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Chhattisgarh", "Assam", "Uttar Pradesh"] }
    }
  ],
  Wheat: [
    {
      title: "NFSM - Wheat",
      desc: "Improving wheat production and productivity through technological interventions and soil health.",
      url: "https://nfsm.gov.in/Default.aspx",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    },
    {
      title: "Minimum Support Price (MSP)",
      desc: "Guaranteed price for wheat to ensure fair returns and encourage production.",
      url: "https://agriwelfare.gov.in/en/MSP",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    }
  ],
  Fruits: [
    {
      title: "MIDH - Horticulture",
      desc: "Mission for Integrated Development of Horticulture covering all fruits and nursery management.",
      url: "https://midh.gov.in/",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    },
    {
      title: "National Horticulture Board",
      desc: "Financial assistance for high-tech horticulture and post-harvest infrastructure.",
      url: "https://nhb.gov.in/",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    }
  ],
  Vegetables: [
    {
      title: "Operation Greens",
      desc: "Special focus on Tomato, Onion, and Potato (TOP) crops to stabilize supply and prices.",
      url: "https://www.mofpi.gov.in/Schemes/operation-greens",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
    },
    {
      title: "Market Intervention Scheme",
      desc: "Protects growers of perishable commodities from distress sales during peak harvest.",
      url: "https://agriwelfare.gov.in/",
      rules: { minAge: 18, maxIncome: null, requiresIndian: true, requiresAadhar: true, requiresActiveFarmer: true, states: ["All"] }
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

import { SchemeEligibilityForm } from '../features/schemes/components/SchemeEligibilityForm'
import { RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react'

export function Schemes() {
  const { language } = useLanguage()
  const { toggleChat } = useChat()
  const t = translations[language]

  // --- State for Profile & Filtering ---
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('kheti_farmer_profile')
    return saved ? JSON.parse(saved) : {
      age: '',
      income: '',
      isIndian: true,
      isAadharLinked: true,
      isActiveFarmer: true,
      state: ''
    }
  })
  
  const [showResults, setShowResults] = useState(() => {
    return !!localStorage.getItem('kheti_farmer_profile')
  })

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // --- Logic ---
  const handleProfileChange = (newProfile) => {
    setUserProfile(newProfile)
  }

  const handleCheckEligibility = () => {
    if (!userProfile.age || !userProfile.state) {
      alert("Please enter your age and state.")
      return
    }
    localStorage.setItem('kheti_farmer_profile', JSON.stringify(userProfile))
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setShowResults(false)
  }

  const checkEligibility = (scheme) => {
    const r = scheme.rules
    if (!r) return true

    if (userProfile.age < r.minAge) return false
    if (r.maxIncome && userProfile.income > r.maxIncome) return false
    if (r.requiresIndian && !userProfile.isIndian) return false
    if (r.requiresAadhar && !userProfile.isAadharLinked) return false
    if (r.requiresActiveFarmer && !userProfile.isActiveFarmer) return false
    
    if (r.states[0] !== "All") {
      if (!r.states.includes(userProfile.state)) return false
    }

    return true
  }

  // Get filtered schemes
  const eligibleSchemes = SCHEMES_DATA[selectedCategory].filter(checkEligibility)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-green-50/50 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Section 1: Form or Results Header */}
          {!showResults ? (
            <div className="max-w-3xl mx-auto mb-16 px-4">
               <SchemeEligibilityForm 
                  profile={userProfile} 
                  onChange={handleProfileChange} 
                  onCheck={handleCheckEligibility}
               />
            </div>
          ) : (
            <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-green-100 shadow-sm mb-12">
                  <div className="flex items-start gap-5">
                    <div className="bg-green-100 p-4 rounded-3xl shrink-0">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-extrabold text-green-950 mb-2">{t.elig_results_for}</h1>
                      <div className="flex flex-wrap gap-2 text-sm text-green-800/60 font-medium uppercase tracking-wider">
                         <span>Age: {userProfile.age}</span> • 
                         <span>{userProfile.state}</span> • 
                         <span>Income: ₹{userProfile.income || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl font-bold transition-all text-sm border border-green-100 active:scale-95"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    {t.elig_reset_btn}
                  </button>
               </div>

               {/* Category Header (Same as old layout but appears after check) */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mx-4">
                  <div>
                    <h2 className="text-4xl font-bold text-green-950 mb-4">{t.schemes_title}</h2>
                    <p className="text-green-800/70 max-w-2xl">{t.schemes_subtitle}</p>
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative w-full md:w-64">
                    <label className="block text-xs font-bold text-green-900/40 uppercase tracking-widest mb-2 px-1">
                      {t.schemes_select_label}
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
            </div>
          )}

          {showResults && (
            <div className="grid lg:grid-cols-3 gap-8 px-4 animate-in fade-in duration-700 delay-150">
              {/* Left Column: Schemes List */}
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5" />
                  {selectedCategory} {t.schemes_section_label}
                </h2>
                
                <div className="space-y-4">
                  {eligibleSchemes.length > 0 ? (
                    eligibleSchemes.map((scheme, idx) => (
                      <SchemeItem 
                        key={idx}
                        title={scheme.title} 
                        desc={scheme.desc}
                        url={scheme.url}
                      />
                    ))
                  ) : (
                    <div className="p-8 bg-white border border-dashed border-green-200 rounded-3xl text-center">
                       <AlertCircle className="w-8 h-8 text-green-300 mx-auto mb-3" />
                       <p className="text-sm text-green-900/50 font-medium">{t.elig_no_results}</p>
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl text-white shadow-lg shadow-green-900/20">
                  <p className="text-sm font-medium opacity-90 leading-relaxed mb-4">
                    {t.schemes_cta_text}
                  </p>
                  <button 
                    onClick={() => toggleChat(true)}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors"
                  >
                    {t.schemes_cta_btn}
                  </button>
                </div>
              </div>

              {/* Right Column: Finance Tools */}
              <div className="lg:col-span-2 space-y-8">
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {t.schemes_finance_title}
                    </h2>
                 </div>
                 <FinanceDashboard />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function SchemeItem({ title, desc, url }) {
  const { language } = useLanguage()
  const t = translations[language]
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
          {t.schemes_official}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </CardContent>
    </Card>
  )
}

