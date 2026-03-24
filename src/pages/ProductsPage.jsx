import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Search, Filter, X, ChevronDown } from 'lucide-react'
import { categories } from '../data/categories'
import ProductCard from '../components/ProductCard'
import Breadcrumb from '../components/Breadcrumb'
import Pagination from '../components/Pagination'
import { useState, useMemo, useEffect } from 'react'
import hubcapsBanner from '../../OPH/Hubcaps.jpg'
import wheelSkinsBanner from '../../OPH/Wheel Skins.jpg'
import wheelSimulatorsBanner from '../../OPH/Wheel Simulators.jpg'
import trimRingsBanner from '../../OPH/Trim rings.jpg'
import { fetchCollectionProducts, isShopifyConfigured } from '../lib/shopifyStorefront'

const ProductsPage = () => {
  const { category } = useParams()
  
  // Find the category info
  const categoryInfo = categories.find(cat => cat.slug === category)

  // Banner images for each category
  const bannerImages = {
    'hubcaps': hubcapsBanner,
    'wheelskins': wheelSkinsBanner,
    'wheel-simulator': wheelSimulatorsBanner,
    'trim-rings': trimRingsBanner
  }

  // Shopify products for this category
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState(null)

  useEffect(() => {
    if (!categoryInfo) return

    if (!isShopifyConfigured()) {
      setProductsError('Shopify is not configured.')
      setCategoryProducts([])
      setLoadingProducts(false)
      return
    }

    setLoadingProducts(true)
    setProductsError(null)
    setCategoryProducts([])

    fetchCollectionProducts({ handle: categoryInfo.id })
      .then((items) => {
        setCategoryProducts(items)
      })
      .catch((e) => {
        console.error('Failed to load Shopify collection products:', e)
        setProductsError(e.message || 'Failed to load products')
      })
      .finally(() => setLoadingProducts(false))
  }, [categoryInfo?.id])

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    setSearchQuery('')
    setSelectedBrand('')
    setSelectedYear('')
    setSelectedMake('')
    setSelectedModel('')
  }, [categoryInfo?.id])

  const itemsPerPage = isMobile ? 12 : 24

  // Define popular car makes
  const carMakes = [
    { name: 'Cadillac' },
    { name: 'Chevrolet' },
    { name: 'Chrysler' },
    { name: 'Dodge' },
    { name: 'Ford' },
    { name: 'GMC' },
    { name: 'Honda' },
    { name: 'Jeep' },
    { name: 'Mazda' },
    { name: 'Nissan' },
    { name: 'Ram' },
    { name: 'Toyota' }
  ]

  // Filter makes that have products
  const availableMakes = useMemo(() => {
    return carMakes.filter(make => 
      categoryProducts.some(product => 
        product.name.includes(make.name) || product.description.includes(make.name)
      )
    )
  }, [categoryProducts])

  // Extract unique years, makes, models from product names/descriptions
  const years = useMemo(() => {
    const yearSet = new Set()
    categoryProducts.forEach(product => {
      // Check both name and description for years
      const text = `${product.name} ${product.description}`
      const yearMatches = text.match(/\b(19|20)\d{2}\b/g)
      if (yearMatches) {
        yearMatches.forEach(year => yearSet.add(year))
      }
    })
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [categoryProducts])

  const makes = useMemo(() => {
    const makeSet = new Set()
    const commonMakes = ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'GMC', 'Dodge', 'Nissan', 'Mazda', 'Cadillac', 'Jeep', 'Ram']
    categoryProducts.forEach(product => {
      commonMakes.forEach(make => {
        if (product.name.includes(make) || product.description.includes(make)) {
          makeSet.add(make)
        }
      })
    })
    return Array.from(makeSet).sort()
  }, [categoryProducts])

  const models = useMemo(() => {
    const modelSet = new Set()
    const commonModels = ['F-150', 'Silverado', 'Sierra', 'Camry', 'Corolla', 'Accord', 'Civic', 'Tundra', 'Cruze', 'Challenger', 'Charger', 'Prius', 'SRX', 'XT5', 'Colorado', 'Equinox']
    categoryProducts.forEach(product => {
      commonModels.forEach(model => {
        if (product.name.includes(model) || product.description.includes(model)) {
          modelSet.add(model)
        }
      })
    })
    return Array.from(modelSet).sort()
  }, [categoryProducts])

  // Filter products
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
      
      const matchesBrand = selectedBrand === '' || 
        product.name.includes(selectedBrand) || 
        product.description.includes(selectedBrand)
      
      const matchesYear = selectedYear === '' || 
        product.name.includes(selectedYear) || 
        product.description.includes(selectedYear)
      
      const matchesMake = selectedMake === '' || 
        product.name.includes(selectedMake) || 
        product.description.includes(selectedMake)
      
      const matchesModel = selectedModel === '' || 
        product.name.includes(selectedModel) || 
        product.description.includes(selectedModel)
      
      return matchesSearch && matchesBrand && matchesYear && matchesMake && matchesModel
    })
  }, [categoryProducts, searchQuery, selectedBrand, selectedYear, selectedMake, selectedModel])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedBrand('')
    setSelectedYear('')
    setSelectedMake('')
    setSelectedModel('')
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedBrand, selectedYear, selectedMake, selectedModel])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  if (loadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 text-lg font-semibold">Loading products...</p>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Could not load products</h1>
          <p className="text-gray-600 mb-4">{productsError}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: categoryInfo.name, href: null }
          ]}
        />

        {/* Category Banner Image */}
        {bannerImages[categoryInfo.id] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={bannerImages[categoryInfo.id]}
              alt={`${categoryInfo.name} banner`}
              className="w-full h-auto max-h-80 md:max-h-96 object-contain bg-white"
            />
          </motion.div>
        )}

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            {categoryInfo.name}
          </h1>
          <p className="text-lg text-gray-600">
            {categoryInfo.description}
          </p>
        </motion.div>

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Filters (Desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Make Filter */}
              {availableMakes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Vehicle Make</label>
                  <div className="space-y-2">
                    {availableMakes.map((make) => (
                      <label key={make.name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="radio"
                          name="make"
                          checked={selectedBrand === make.name}
                          onChange={() => setSelectedBrand(selectedBrand === make.name ? '' : make.name)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{make.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Year Filter */}
              {years.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Make Dropdown Filter */}
              {makes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Model Filter */}
              {models.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  >
                    <option value="">All Models</option>
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              {(searchQuery || selectedBrand || selectedYear || selectedMake || selectedModel) && (
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.aside>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              Filters & Search
            </button>
          </div>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Make Filter */}
                  {availableMakes.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Vehicle Make</label>
                      <div className="space-y-2">
                        {availableMakes.map((make) => (
                          <label key={make.name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                            <input
                              type="radio"
                              name="make"
                              checked={selectedBrand === make.name}
                              onChange={() => setSelectedBrand(selectedBrand === make.name ? '' : make.name)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{make.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Year, Make, Model Filters */}
                  {years.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {makes.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
                      <select
                        value={selectedMake}
                        onChange={(e) => setSelectedMake(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">All Makes</option>
                        {makes.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {models.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">All Models</option>
                        {models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {(searchQuery || selectedBrand || selectedYear || selectedMake || selectedModel) && (
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                      >
                        Clear All Filters
                      </button>
                    )}
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Show {filteredProducts.length} Results
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Main Content - Products */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
                  </p>
                </div>
                
                {/* Active Filter Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedBrand && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      {selectedBrand}
                      <button onClick={() => setSelectedBrand('')} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedYear && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      {selectedYear}
                      <button onClick={() => setSelectedYear('')} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedMake && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      {selectedMake}
                      <button onClick={() => setSelectedMake('')} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedModel && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      {selectedModel}
                      <button onClick={() => setSelectedModel('')} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-lg mb-4">No products match your search criteria.</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Clear filters to see all products
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
