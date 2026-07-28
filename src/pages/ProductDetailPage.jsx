import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link, useLocation } from 'react-router-dom'
import {
  ShoppingCart,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  Truck,
  Search
} from 'lucide-react'
import { categories, findMainCategoryBySlug } from '../data/categories'
import { getLocalProductByCategoryAndId, getLocalProductsByCategorySlug } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { fetchCollectionProducts, fetchProductByHandle, isShopifyConfigured } from '../lib/shopifyStorefront'
import Breadcrumb from '../components/Breadcrumb'
import StarRating from '../components/StarRating'
import ImageZoom from '../components/ImageZoom'
import ProductSpecs from '../components/ProductSpecs'
import FitmentTable from '../components/FitmentTable'
import ProductNotes from '../components/ProductNotes'
import { useState, useMemo, useEffect, useLayoutEffect } from 'react'
import { a11yAction } from '../lib/controlHints'
import { extractDescriptionBlocks } from '../lib/productUtils'
import { useAuth } from '../context/AuthContext'
import { getCustomerPrice, getProductPartNumbers, getProductTitle } from '../lib/productPresentation'

const trustItems = [
  { label: 'Free Shipping over $75', icon: Truck },
  { label: '30-Day Returns', icon: ShieldCheck },
  { label: 'Secure checkout', icon: BadgeCheck }
]

const ProductDetailPage = () => {
  const { category, productId } = useParams()
  const location = useLocation()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [product, setProduct] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [productError, setProductError] = useState(null)
  const [cartError, setCartError] = useState(null)

  const categoryInfo = categories.find((cat) => cat.slug === category)
  const parentCategory = categoryInfo ? findMainCategoryBySlug(categoryInfo.parentSlug) : null
  const parentBreadcrumb = location.state?.parentBreadcrumb || {
    label: 'Shop by Category',
    href: '/products'
  }

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [category, productId])

  useEffect(() => {
    if (!categoryInfo) return

    if (!isShopifyConfigured()) {
      const localProduct = getLocalProductByCategoryAndId(category, productId)
      const localCategoryProducts = getLocalProductsByCategorySlug(category)
      setProduct(localProduct)
      setCategoryProducts(localCategoryProducts)
      setProductError(localProduct ? null : 'Product not found.')
      setLoadingProduct(false)
      return
    }

    setLoadingProduct(true)
    setProductError(null)
    setProduct(null)
    setCategoryProducts([])

    Promise.all([
      fetchProductByHandle({ handle: productId }),
      fetchCollectionProducts({ handle: categoryInfo.shopifyHandle || categoryInfo.id })
    ])
      .then(([loadedProduct, items]) => {
        if (loadedProduct) {
          setProduct(loadedProduct)
          setCategoryProducts(items || [])
          return
        }

        const localProduct = getLocalProductByCategoryAndId(category, productId)
        setProduct(localProduct)
        setCategoryProducts((items && items.length ? items : getLocalProductsByCategorySlug(category)) || [])
        if (!localProduct) {
          setProductError('Failed to load product')
        }
      })
      .catch((error) => {
        console.error('Failed to load Shopify product:', error)
        const localProduct = getLocalProductByCategoryAndId(category, productId)
        setProduct(localProduct)
        setCategoryProducts(getLocalProductsByCategorySlug(category))
        setProductError(localProduct ? null : (error.message || 'Failed to load product'))
      })
      .finally(() => setLoadingProduct(false))
  }, [categoryInfo?.id, category, productId])

  const productImages = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.images) && product.images.length) return product.images
    return product.image ? [product.image] : []
  }, [product])

  const descriptionBlocks = useMemo(() => extractDescriptionBlocks(product || {}), [product])
  const shortDescription = descriptionBlocks[0] || product?.description || ''
  const productTitle = getProductTitle(product)
  const partNumbers = getProductPartNumbers(product)
  const customerPrice = getCustomerPrice(product, user?.pricingTier)

  const compatibilitySummary = useMemo(() => {
    const fitment = product?.metafield?.value || product?.metafields?.custom?.fitment || ''
    if (fitment) return fitment

    const text = `${product?.name || ''} ${product?.description || ''}`
    const yearMatch = text.match(/\b(?:19|20)\d{2}(?:-\d{4})?\b/)
    const makeMatch = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'GMC', 'Dodge', 'Nissan', 'Mazda', 'Jeep', 'Ram', 'Cadillac', 'Subaru']
      .find((make) => text.includes(make))
    const modelMatch = ['Civic', 'Camry', 'Corolla', 'F-150', 'Silverado', 'Sierra', 'Prius', 'Accord', 'Tundra']
      .find((model) => text.includes(model))

    return [makeMatch, modelMatch, yearMatch?.[0]].filter(Boolean).join(' ') || 'Vehicle-specific fitment available'
  }, [product])

  const handleTouchStart = (event) => {
    setTouchStart(event.targetTouches[0].clientX)
  }

  const handleTouchMove = (event) => {
    setTouchEnd(event.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setSelectedImageIndex((prev) => Math.min(prev + 1, productImages.length - 1))
    }
    if (touchStart - touchEnd < -75) {
      setSelectedImageIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  if (loadingProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-24 pb-16">
        <p className="text-lg font-semibold text-gray-700">Loading product...</p>
      </div>
    )
  }

  if (productError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-24 pb-16">
        <div className="max-w-lg px-4 text-center">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">Could not load product</h1>
          <p className="mb-4 text-gray-600">{productError}</p>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Product Not Found</h1>
          <Link to={`/products/${category}`} className="text-blue-600 hover:underline">
            Back to {categoryInfo?.name}
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    setCartError(null)
    addToCart(product, quantity)
      .then((result) => {
        if (result?.success) {
          setAddedToCart(true)
          setTimeout(() => setAddedToCart(false), 2000)
        } else {
          setCartError(result?.error || 'Could not add to cart')
        }
      })
      .catch((error) => {
        console.error('Add to cart failed:', error)
        setCartError(error?.message || 'Could not add to cart')
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2">
          <Link
            to={`/products/${category}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to {parentCategory?.name || 'products'}
          </Link>
        </div>

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop by Category', href: '/products' },
            ...(parentCategory ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }] : []),
            { label: categoryInfo?.name || 'Products', href: `/products/${category}` },
            { label: productTitle, href: null }
          ]}
        />

        <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
              <div className="hidden md:flex md:flex-col md:gap-3">
                {productImages.map((img, index) => (
                  <button
                    type="button"
                    key={img}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`overflow-hidden rounded-2xl border-2 transition ${
                      selectedImageIndex === index ? 'border-blue-600 shadow-md' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    {...a11yAction(
                      selectedImageIndex === index
                        ? `Image ${index + 1} of ${productImages.length} selected`
                        : `Show image ${index + 1} of ${productImages.length}`
                    )}
                  >
                    <img src={img} alt={`${productTitle} view ${index + 1}`} className="aspect-square h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="rounded-[2rem] bg-white p-4 shadow-sm md:p-6">
                <div
                  className="relative overflow-hidden rounded-[1.5rem] bg-slate-50"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="hidden md:block">
                    <ImageZoom src={productImages[selectedImageIndex]} alt={productTitle} />
                  </div>

                  <div className="relative aspect-square md:hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedImageIndex}
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.28 }}
                        src={productImages[selectedImageIndex]}
                        alt={productTitle}
                        className="h-full w-full object-cover"
                      />
                    </AnimatePresence>
                  </div>

                  {productImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => Math.max(prev - 1, 0))}
                        className="absolute left-3 top-1/2 rounded-full bg-white/90 p-2 shadow-lg md:hidden"
                        {...a11yAction('Previous product image')}
                      >
                        <ChevronLeft size={18} className="text-slate-900" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex((prev) => Math.min(prev + 1, productImages.length - 1))}
                        className="absolute right-3 top-1/2 rounded-full bg-white/90 p-2 shadow-lg md:hidden"
                        {...a11yAction('Next product image')}
                      >
                        <ChevronRight size={18} className="text-slate-900" aria-hidden />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-3"
          >
            <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  In Stock - Ships Today
                </span>
                <span className="text-xs text-slate-500 truncate max-w-[180px]">Part #: {partNumbers.onePacificHub}</span>
              </div>

              <h1 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
                {productTitle}
              </h1>

              <div className="mt-1.5">
                <StarRating rating={product.rating || 4.7} reviews={product.reviews || 189} size={14} />
              </div>

              <p className="mt-3 text-4xl font-bold text-slate-950">${customerPrice.toFixed(2)}</p>
              {(partNumbers.keystone || partNumbers.oxGord) ? (
                <div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  {partNumbers.keystone ? (
                    <div>
                      <p className="text-xxs font-semibold uppercase tracking-[0.1em] text-slate-400">Keystone part number</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{partNumbers.keystone}</p>
                    </div>
                  ) : null}
                  {partNumbers.oxGord ? (
                    <div>
                      <p className="text-xxs font-semibold uppercase tracking-[0.1em] text-slate-400">OxGord part number</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{partNumbers.oxGord}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-3">
                <p className="text-xxs font-semibold uppercase tracking-[0.1em] text-slate-400">Description</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{shortDescription}</p>
              </div>

              <div className="mt-4 space-y-3">
                {/* Compatibility Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900">Compatibility</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                      <p className="text-xs font-medium text-slate-950">
                        <span className="font-bold">Fits:</span> {compatibilitySummary}
                      </p>
                      <Check size={16} className="text-emerald-600 flex-shrink-0" aria-hidden />
                    </div>

                    <button
                      type="button"
                      onClick={() => document.getElementById('fitment-details')?.scrollIntoView({ behavior: 'auto', block: 'start' })}
                      className="inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-left text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Search size={14} aria-hidden />
                        Check Your Vehicle
                      </span>
                      <span aria-hidden className="text-base">›</span>
                    </button>
                  </div>
                </div>

                {/* Purchase Row */}
                <div className="grid gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-900">Quantity</span>
                    <div className="flex h-12 items-center border border-slate-300 bg-white px-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
                        {...a11yAction('Decrease quantity')}
                      >
                        <Minus size={14} aria-hidden />
                      </button>
                      <span className="w-9 text-center text-base font-bold text-slate-950">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
                        {...a11yAction('Increase quantity')}
                      >
                        <Plus size={14} aria-hidden />
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`inline-flex h-14 w-full items-center justify-center gap-2 px-6 text-base font-bold text-white ${
                      addedToCart ? 'bg-emerald-600' : 'bg-[#0f172a] hover:bg-slate-800'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check size={16} aria-hidden />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} aria-hidden />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>
                {cartError ? <p className="mt-2 text-sm font-semibold text-red-600">{cartError}</p> : null}
              </div>

              <div className="mt-5 space-y-3">
                {trustItems.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Icon size={17} className="text-blue-600" aria-hidden />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <ProductSpecs product={product} />
          </motion.div>
        </div>

        <div id="fitment-details" className="mt-10 grid gap-8">
          <FitmentTable product={product} />
          <ProductNotes product={product} />
        </div>

        {categoryProducts.length > 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mt-16"
          >
            <h2 className="mb-8 text-3xl font-bold text-slate-950">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categoryProducts
                .filter((item) => item.id !== product.id)
                .slice(0, 4)
                .map((similarProduct) => (
                  <Link
                    key={similarProduct.id}
                    to={`/products/${category}/${similarProduct.id}`}
                    className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="h-48 bg-white p-4">
                      <img src={similarProduct.image} alt={similarProduct.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-sm font-bold text-slate-950">{similarProduct.name}</h3>
                      <div className="mt-3">
                        <StarRating rating={similarProduct.rating || 4.5} reviews={similarProduct.reviews || 0} size={12} />
                      </div>
                      <p className="mt-4 text-xl font-bold text-blue-600">${Number(similarProduct.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductDetailPage
