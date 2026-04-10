import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Card, CardContent } from '../components/common/Card'
import { Newspaper, ExternalLink, AlertTriangle } from 'lucide-react'

export function AgNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/news')
        const data = await response.json()
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch news')
        }
        
        setNews(data.articles || [])
      } catch (err) {
        console.error("News Fetch Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-green-50/50 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-green-600 text-white p-3 rounded-2xl shadow-md">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-900 tracking-tight">Agricultural News</h1>
              <p className="text-green-700 mt-2">The latest global updates in agriculture and agritech.</p>
            </div>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="rounded-3xl overflow-hidden shadow-lg animate-pulse" glass>
                  <div className="h-48 bg-green-100 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-green-50 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-green-50 rounded w-full" />
                      <div className="h-4 bg-green-50 rounded w-5/6" />
                      <div className="h-4 bg-green-50 rounded w-4/6" />
                    </div>
                    <div className="h-10 bg-green-100 rounded-xl mt-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card className="w-full max-w-2xl mx-auto shadow-xl border-red-200">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h3 className="text-2xl font-bold text-red-900 mb-4">Temporarily Unavailable</h3>
                <p className="text-red-700/80 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-red-100 text-red-700 hover:bg-red-200 font-semibold rounded-xl transition-colors"
                >
                  Retry Connection
                </button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && news.length === 0 && (
             <div className="text-center py-20 text-green-800 text-lg">
                No recent agricultural news could be found at this time.
             </div>
          )}

          {!loading && !error && news.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-default">
              {news.map((article, index) => (
                <Card key={index} className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full bg-white/80" glass>
                  {article.image ? (
                    <img 
                       src={article.image} 
                       alt={article.title} 
                       className="h-52 w-full object-cover"
                       onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="h-52 w-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                       <Newspaper className="w-12 h-12 text-green-500/50" />
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                         {article.source}
                       </span>
                    </div>
                    <h2 className="text-xl font-bold text-green-950 mb-3 line-clamp-2">
                       {article.title}
                    </h2>
                    
                    {article.ai_insight && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 my-2 shadow-sm">
                        <h4 className="text-sm font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                          💡 Farmer's Insight
                        </h4>
                        <p className="text-emerald-800 text-sm leading-relaxed italic">
                          {article.ai_insight}
                        </p>
                      </div>
                    )}

                    <p className="text-green-800/70 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed mt-2">
                       <span className="font-semibold text-green-900">Context:</span> {article.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-green-50">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full bg-green-50 hover:bg-green-100 text-green-800 font-semibold py-3 rounded-xl transition-colors"
                      >
                        Read Full Article <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
