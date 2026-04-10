import React, { useState, useEffect } from 'react'
import { Phone, Tag, IndianRupee, Image as ImageIcon, X } from 'lucide-react'
import { Card, CardContent } from '../components/common/Card'
import { Button } from '../components/common/Button'

export function Marketplace() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds',
    price: '',
    description: '',
    image: null
  })

  const categories = ['All', 'Seeds', 'Fertilizers', 'Tools', 'Pesticides']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/products/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      if (result.success) {
        setIsModalOpen(false)
        fetchProducts() // Refresh the list
        setFormData({ name: '', category: 'Seeds', price: '', description: '', image: null })
      } else {
        alert('Failed to list product: ' + result.error)
      }
    } catch (error) {
      console.error('Error listing product:', error)
      alert('Error listing product')
    }
  }

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter)

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-green-900 mb-4">
            Kheti-AI Farmer's Market
          </h1>
          <p className="text-lg text-green-800/80 max-w-2xl">
            Browse and buy quality agricultural products directly from trusted sellers or list your own products to sell.
          </p>
        </div>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          List Your Product
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat 
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20' 
                : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div className="h-48 bg-green-50 relative overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-green-200" />
                  )}
                  {product.isBulk && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm z-10 flex items-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                      Bulk Deal
                    </div>
                  )}
                  <div className={`absolute top-3 ${product.isBulk ? 'right-3' : 'left-3'} bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-green-800 flex items-center shadow-sm`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {product.category}
                  </div>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-green-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-green-700/70 mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-green-100">
                    <div className="flex items-center font-bold text-xl text-green-800">
                      <IndianRupee className="w-5 h-5 mr-0.5" />
                      {product.price}
                    </div>
                    <a href="tel:+910000000000" className="inline-block" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" className="gap-2 hover:bg-green-600 hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">Contact</span>
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-green-800/60 bg-green-50/50 rounded-3xl border border-green-100 border-dashed border-2">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">No products found</p>
              <p>Try selecting a different category or list your own product.</p>
            </div>
          )}
        </div>
      )}

      {/* List Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h2 className="text-xl font-bold text-green-900">List Your Product</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-green-800/60 hover:text-green-900 transition-colors bg-green-50 hover:bg-green-100 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 bg-green-50/30 transition-all"
                    placeholder="e.g. Organic Neem Oil"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 bg-green-50/30 text-green-900 transition-all"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 bg-green-50/30 transition-all"
                      placeholder="e.g. 450"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 bg-green-50/30 transition-all resize-none"
                    placeholder="Describe your product, quantity, quality etc."
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full h-12 text-base">
                    Publish Listing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
