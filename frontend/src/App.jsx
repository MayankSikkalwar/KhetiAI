import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Report } from './pages/Report'
import { AgNews } from './pages/AgNews'
import { Marketplace } from './pages/Marketplace'
import { Schemes } from './pages/Schemes'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/news" element={<AgNews />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/schemes" element={<Schemes />} />
        </Routes>
      </div>
    </Router>
  )
}


export default App
