import { motion } from 'framer-motion'
import { useParams, Link, useLocation } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import { categories, findMainCategoryBySlug, getSubcategoriesForMainCategory } from '../data/categories'
import ProductCard from '../components/ProductCard'
import Breadcrumb from '../components/Breadcrumb'
import Pagination from '../components/Pagination'
import { useState, useMemo, useEffect } from 'react'
import hubcapsBanner from '../../OPH/Hubcaps.jpg'
import wheelSkinsBanner from '../../OPH/Wheel Skins.jpg'
import wheelSimulatorsBanner from '../../OPH/Wheel Simulators.jpg'
import trimRingsBanner from '../../OPH/Trim rings.jpg'
import { fetchCollectionProducts, isShopifyConfigured } from '../lib/shopifyStorefront'
import { a11yAction } from '../lib/controlHints'
import { getFitmentOptions, getLocalProductsByCategorySlug, getProductFitment } from '../data/catalog'

const ProductsPage = () => {
  const { category } = useParams()
  const location = useLocation()
  const categoryInfo = categories.find((cat) => cat.slug === category)
  const parentCategory = categoryInfo ? findMainCategoryBySlug(categoryInfo.parentSlug) : null
  const siblingSubcategories = parentCategory ? getSubcategoriesForMainCategory(parentCategory.slug) : []
  const parentBreadcrumb = location.state?.parentBreadcrumb || {
    label: 'Shop by Category',
    href: '/products'
  }

  const bannerImages = {
    hubcaps: hubcapsBanner,
    wheelskins: wheelSkinsBanner,
    'wheel-simulator': wheelSimulatorsBanner,
    'trim-rings': trimRingsBanner
  }

  const [categoryProducts, setCategoryProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState(null)
  const [sortBy, setSortBy] = useState('featured')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedTrim, setSelectedTrim] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    if (!categoryInfo) return

    if (!isShopifyConfigured()) {
      setCategoryProducts(getLocalProductsByCategorySlug(categoryInfo.slug))
      setProductsError(null)
      setLoadingProducts(false)
      return
    }

    setLoadingProducts(true)
    setProductsError(null)
    setCategoryProducts([])

    fetchCollectionProducts({ handle: categoryInfo.shopifyHandle || categoryInfo.id })
      .then((items) => setCategoryProducts(items))
      .catch((error) => {
        console.error('Failed to load Shopify collection products:', error)
        setProductsError(error.message || 'Failed to load products')
      })
      .finally(() => setLoadingProducts(false))
  }, [categoryInfo?.id])

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
    setSortBy('featured')
    setSelectedYear('')
    setSelectedMake('')
    setSelectedModel('')
    setSelectedTrim('')
  }, [categoryInfo?.id])

  const fitmentOptions = useMemo(
    () => getFitmentOptions(categoryProducts, {
      year: selectedYear,
      make: selectedMake,
      model: selectedModel
    }),
    [categoryProducts, selectedMake, selectedModel, selectedYear]
  )
  const models = selectedMake ? fitmentOptions.modelsByMake[selectedMake] || [] : []
  const trims = selectedMake && selectedModel
    ? fitmentOptions.trimsByMakeModel[`${selectedMake}::${selectedModel}`] || []
    : []

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      const fitment = getProductFitment(product)
      const matchesYear = !selectedYear || fitment.years.includes(selectedYear)
      const matchesMake = !selectedMake || fitment.make.toLowerCase() === selectedMake.toLowerCase()
      const matchesModel = !selectedModel || fitment.model.toLowerCase() === selectedModel.toLowerCase()
      const matchesTrim = !selectedTrim || fitment.trim.toLowerCase() === selectedTrim.toLowerCase()

      return matchesYear && matchesMake && matchesModel && matchesTrim
    })
  }, [categoryProducts, selectedMake, selectedModel, selectedTrim, selectedYear])

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts]
    if (sortBy === 'price-asc') return products.sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === 'price-desc') return products.sort((a, b) => Number(b.price) - Number(a.price))
    if (sortBy === 'rating-desc') return products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    if (sortBy === 'name-asc') return products.sort((a, b) => a.name.localeCompare(b.name))
    return products
  }, [filteredProducts, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear, selectedMake, selectedModel, selectedTrim, sortBy])

  const clearFilters = () => {
    setSelectedYear('')
    setSelectedMake('')
    setSelectedModel('')
    setSelectedTrim('')
    setCurrentPage(1)
  }

  const itemsPerPage = isMobile ? 8 : 12
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (!categoryInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Category Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  if (loadingProducts) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-24 pb-16">
        <p className="text-lg font-semibold text-gray-700">Loading products...</p>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-24 pb-16">
        <div className="max-w-lg px-4 text-center">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">Could not load products</h1>
          <p className="mb-4 text-gray-600">{productsError}</p>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  const filterControls = (
    <>
      <div className="grid gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Year</span>
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
          >
            <option value="">All years</option>
            {fitmentOptions.years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Make</span>
          <select
            value={selectedMake}
            onChange={(event) => {
              setSelectedMake(event.target.value)
              setSelectedModel('')
              setSelectedTrim('')
            }}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
          >
            <option value="">All makes</option>
            {fitmentOptions.makes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Model</span>
          <select
            value={selectedModel}
            onChange={(event) => {
              setSelectedModel(event.target.value)
              setSelectedTrim('')
            }}
            disabled={!selectedMake}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">All models</option>
            {models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Submodel / Trim</span>
          <select
            value={selectedTrim}
            onChange={(event) => setSelectedTrim(event.target.value)}
            disabled={!selectedModel || trims.length === 0}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">All trims</option>
            {trims.map((trim) => (
              <option key={trim} value={trim}>{trim}</option>
            ))}
          </select>
        </label>
      </div>

      {(selectedYear || selectedMake || selectedModel || selectedTrim) ? (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
        >
          Clear filters
        </button>
      ) : null}
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 md:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            parentBreadcrumb,
            ...(parentCategory ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}`, state: { parentBreadcrumb } }] : []),
            { label: categoryInfo.name, href: null }
          ]}
        />

        {bannerImages[categoryInfo.id] ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 overflow-hidden rounded-[1.75rem] bg-white shadow-md"
          >
            <img
              src={bannerImages[categoryInfo.id]}
              alt={`${categoryInfo.name} banner`}
              className="h-48 w-full object-cover md:h-60"
            />
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-8"
        >
          {parentCategory ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              {parentCategory.name}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold text-slate-950">{categoryInfo.name}</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">{categoryInfo.description}</p>
        </motion.div>

        {siblingSubcategories.length > 1 ? (
          <div className="mb-8 rounded-[1.75rem] bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
              Browse {parentCategory?.name}
            </p>
            <div className="flex flex-wrap gap-3">
              {siblingSubcategories.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  to={`/products/${subcategory.slug}`}
                  state={{ parentBreadcrumb }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    subcategory.slug === categoryInfo.slug
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-4 md:hidden">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm"
          >
            <Filter size={18} aria-hidden />
            Filters
          </button>
        </div>

        {showMobileFilters ? (
          <div className="fixed inset-0 z-50 bg-slate-950/40 md:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-x-0 bottom-0 rounded-t-[2rem] bg-white p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-950">Filters</h2>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  {...a11yAction('Close filters')}
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
              <div className="space-y-4">
                {filterControls}
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  Show {filteredProducts.length} products
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <div className="sticky top-36 space-y-4 rounded-[1.75rem] bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Filters</h2>
                <p className="mt-1 text-sm text-slate-500">Clean fitment-first filtering for this category.</p>
              </div>
              {filterControls}
            </div>
          </aside>

          <div>
            <div className="mb-6 rounded-[1.75rem] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-950">
                    {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  Sort By
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-950"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Rating</option>
                    <option value="name-asc">Name</option>
                  </select>
                </label>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
                {totalPages > 1 ? (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isMobile={isMobile}
                  />
                ) : null}
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
                {categoryProducts.length === 0 ? (
                  <>
                    <p className="mb-3 text-2xl font-bold text-slate-950">Products coming soon</p>
                    <p className="mb-6 text-slate-600">
                      This collection is ready and will fill in as inventory is published.
                    </p>
                    {parentCategory ? (
                      <Link to={`/category/${parentCategory.slug}`} className="font-semibold text-blue-600 underline">
                        Back to {parentCategory.name}
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="mb-3 text-2xl font-bold text-slate-950">No products match these filters</p>
                    <button type="button" onClick={clearFilters} className="font-semibold text-blue-600 underline">
                      Clear filters
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
