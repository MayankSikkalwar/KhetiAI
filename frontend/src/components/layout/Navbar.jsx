import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { Button } from '../common/Button'
import { cn } from '../../utils/cn'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-green-100" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-green-900">KHETI-AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-green-100/50">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/schemes">Schemes</NavLink>
            <NavLink to="/news">Ag News</NavLink>
            <NavLink to="/about">About Us</NavLink>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="hidden lg:inline-flex">Log In</Button>
          <Button>Analyze Crop</Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-green-900" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-green-100 p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-4">
          <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/schemes" onClick={() => setMobileMenuOpen(false)}>Schemes</MobileNavLink>
          <MobileNavLink to="/news" onClick={() => setMobileMenuOpen(false)}>Ag News</MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
          <Button className="w-full mt-4">Analyze Crop</Button>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="px-4 py-2 text-sm font-medium text-green-800 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="block px-4 py-3 text-base font-medium text-green-900 hover:bg-green-50 rounded-xl transition-colors"
    >
      {children}
    </Link>
  )
}
