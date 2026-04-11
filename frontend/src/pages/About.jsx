import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Card, CardContent } from '../components/common/Card'
import { 
  Microscope, 
  MessageCircle, 
  Mic, 
  TrendingUp, 
  Newspaper, 
  Smartphone, 
  Languages,
  Landmark,
  Droplets
} from 'lucide-react'

export function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAF8] pt-32 pb-24 px-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Mission Section */}
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <Languages className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-green-950 tracking-tight">
              Empowering Indian Farmers <br /> through <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Accessible AI.</span>
            </h1>
            <p className="text-xl text-green-800 leading-relaxed">
              We are breaking the literacy and language barrier for every farmer in India.
              With our <strong className="text-green-900 font-bold">Bilingual (Hindi/English) Voice</strong> and <strong className="text-green-900 font-bold">WhatsApp-first</strong> approach, enterprise-grade AI is now as easy as making a phone call or sending a voice note.
            </p>
          </section>

          {/* USP Section */}
          <section>
            <div 
              className="rounded-3xl shadow-xl overflow-hidden text-white border-0 relative"
              style={{ background: 'linear-gradient(to bottom right, #166534, #052e16)' }}
            >
              <div className="p-12 md:p-16 text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                
                <h2 className="text-3xl md:text-4xl font-bold font-serif relative z-10">Our Unique Selling Proposition</h2>
                <div className="grid md:grid-cols-2 gap-8 relative z-10 mt-8">
                  <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/10">
                    <Smartphone className="w-10 h-10 text-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Omnichannel Access</h3>
                    <p className="text-green-100">Interact seamlessly via our Web app or native WhatsApp integration. High-end tech usable from the field.</p>
                  </div>
                  <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/10">
                    <Mic className="w-10 h-10 text-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Bilingual Voice-First</h3>
                    <p className="text-green-100">Speaks your language natively. Send voice notes in Hindi or English, and receive spoken conversational diagnosis.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ecosystem / Feature Cards Section */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-900 mb-4">The Kheti-AI Ecosystem</h2>
              <p className="text-green-700/80 text-lg">Integrated tools designed exclusively for localized agronomy.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'AI Crop Doctor', icon: Microscope, desc: 'Uses a YOLOv8 vision model and Llama-3.1-8b to provide instant organic and chemical treatment plans.' },
                { title: 'WhatsApp Bot', icon: MessageCircle, desc: 'Full diagnosis and chat support natively on WhatsApp via our Twilio integration. No app installs needed.' },
                { title: 'Voice Assistant', icon: Mic, desc: 'Interactive bilingual support that listens and speaks to the user. True hands-free agronomic advice.' },
                { title: 'Finance Hub', icon: TrendingUp, desc: 'Tools like EMI Calculators and Cultivation Budgeters to secure the farmer\'s financial future.' },
                { title: 'Ag News', icon: Newspaper, desc: 'Real-time localized news summaries specifically context-aware for the Indian agricultural landscape.' },
                { title: 'Government Schemes', icon: Landmark, desc: 'Easy access to agricultural subsidy information in scheme section.' },
                { title: 'Fertilizer Recommendation', icon: Droplets, desc: 'Smart fertilizer suggestions for maximum yield in report.' }
              ].map((obj, i) => (
                <Card key={i} className="hover:-translate-y-2 transition-transform duration-300 rounded-3xl border-green-100/50 shadow-lg shadow-green-900/5 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-4 text-center flex flex-col items-center">
                     <div className="p-4 bg-green-50 rounded-2xl text-green-600 mb-2 shadow-inner">
                       <obj.icon className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-green-900">{obj.title}</h3>
                     <p className="text-green-800/80 leading-relaxed text-sm">{obj.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>



        </div>
      </main>
    </>
  )
}
