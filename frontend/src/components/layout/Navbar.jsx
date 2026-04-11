import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '../common/Button'
import { cn } from '../../utils/cn'
import { useLanguage } from '../../context/LanguageContext'
import translations from '../../i18n/translations'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी' },
  ]

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
            <NavLink to="/">{t.nav_home}</NavLink>
            <NavLink to="/schemes">{t.nav_schemes}</NavLink>
            <NavLink to="/news">{t.nav_news}</NavLink>
            <NavLink to="/marketplace">{t.nav_marketplace}</NavLink>
            <NavLink to="/about">{t.nav_about}</NavLink>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1.5 text-sm font-semibold text-green-800 px-3 py-2 rounded-full border border-green-200 bg-white/70 backdrop-blur hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <Globe className="w-4 h-4 text-green-600" />
              {LANGUAGES.find(l => l.id === language)?.label}
              <ChevronDown className={cn("w-3.5 h-3.5 text-green-500 transition-transform duration-200", langOpen && "rotate-180")} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl shadow-green-900/10 border border-green-50 overflow-hidden z-50 min-w-[130px]">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => { setLanguage(lang.id); setLangOpen(false) }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-green-50",
                      language === lang.id ? "text-green-700 bg-green-50/80 font-bold" : "text-green-900/70"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" className="hidden lg:inline-flex">{t.nav_login}</Button>
          <Button>{t.nav_analyze}</Button>
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
          <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>{t.nav_home}</MobileNavLink>
          <MobileNavLink to="/schemes" onClick={() => setMobileMenuOpen(false)}>{t.nav_schemes}</MobileNavLink>
          <MobileNavLink to="/news" onClick={() => setMobileMenuOpen(false)}>{t.nav_news}</MobileNavLink>
          <MobileNavLink to="/marketplace" onClick={() => setMobileMenuOpen(false)}>{t.nav_marketplace}</MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>{t.nav_about}</MobileNavLink>
          {/* Mobile Language Buttons */}
          <div className="flex gap-2 pt-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => { setLanguage(lang.id); setMobileMenuOpen(false) }}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors",
                  language === lang.id
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <Button className="w-full mt-2">{t.nav_analyze}</Button>
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
