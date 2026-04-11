import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/layout/Hero'
import { DiseaseAnalyzer } from '../features/disease-analysis/components/DiseaseAnalyzer'
import { Card, CardContent } from '../components/common/Card'
import { Leaf, Sprout, ShieldCheck } from 'lucide-react'
import { VoiceAssistant } from '../features/voice-assistant/components/VoiceAssistant'
import { useLanguage } from '../context/LanguageContext'
import translations from '../i18n/translations'

export function Home() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-green-50/50 pb-24">
        <Hero />
        
        {/* Core AI Section */}
        <section id="analyzer" className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-950 mb-4">{t.home_ai_title}</h2>
            <p className="text-green-800/70 max-w-2xl mx-auto">{t.home_ai_desc}</p>
          </div>
          
          <DiseaseAnalyzer />
        </section>

        {/* Features / Value Props Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sprout />}
              title={t.home_feat1_title}
              desc={t.home_feat1_desc}
            />
            <FeatureCard 
              icon={<Leaf />}
              title={t.home_feat2_title}
              desc={t.home_feat2_desc}
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title={t.home_feat3_title}
              desc={t.home_feat3_desc}
            />
          </div>
        </section>
      </main>
      <VoiceAssistant />
    </>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <Card className="hover:border-green-300 transition-colors cursor-default">
      <CardContent className="p-8">
        <div className="bg-green-100 text-green-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
          {React.cloneElement(icon, { className: "w-7 h-7" })}
        </div>
        <h3 className="text-xl font-bold text-green-950 mb-3">{title}</h3>
        <p className="text-green-800/70 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}
