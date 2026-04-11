import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Report } from './pages/Report'
import { AgNews } from './pages/AgNews'
import { Marketplace } from './pages/Marketplace'
import { Schemes } from './pages/Schemes'
import { About } from './pages/About'
import { LanguageProvider } from './context/LanguageContext'

import { ChatProvider } from './context/ChatContext'
import { VoiceAssistant } from './features/voice-assistant/components/VoiceAssistant'

function App() {
  return (
    <LanguageProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<Report />} />
              <Route path="/news" element={<AgNews />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <VoiceAssistant />
          </div>
        </Router>
      </ChatProvider>
    </LanguageProvider>
  )
}


export default App
