import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Check, Minus, Plus, Package, Palette, Building2, Wrench, ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '../data/categories'
import { getLocalProductByCategoryAndId, getLocalProductsByCategorySlug } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { fetchCollectionProducts, fetchProductByHandle, isShopifyConfigured } from '../lib/shopifyStorefront'
import Breadcrumb from '../components/Breadcrumb'
import StarRating from '../components/StarRating'
import ImageZoom from '../components/ImageZoom'
import { useState, useMemo, useEffect, useLayoutEffect } from 'react'
import { a11yAction } from '../lib/controlHints'

const decodeEntities = (text) => (
  text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
)

const splitLongDescriptionBlock = (block) => {
  const markers = [
    'Attention!',
    'ATTENTION:',
    'These are',
    'These Wheel Covers',
    'Compatible with:',
    'Use Amazon',
    'For ',
    'Factory ',
    'Stylish ',
    'Important:'
  ]

  let next = block
  markers.forEach((marker) => {
    // Split before the marker if there's a space or if it's at the start of a line/block
    const pattern = new RegExp(`(?:\\s+|^)(?=${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
    next = next.replace(pattern, '\n')
  })

  return next
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

const collapseDuplicateDescriptionBlocks = (blocks) => {
  // 1. Remove consecutive exact duplicates
  let deduped = blocks.filter((block, index) => index === 0 || block !== blocks[index - 1])
  
  // 2. Filter out "junk" blocks that are just a single dot or non-alphanumeric junk
  deduped = deduped.filter(block => {
    const cleaned = block.replace(/[.\-\s]/g, '')
    return cleaned.length > 0
  })

  // 3. Check for the "perfect half" duplication
  const half = Math.floor(deduped.length / 2)
  if (half >= 2) {
    const firstHalf = deduped.slice(0, half)
    const secondHalf = deduped.slice(deduped.length - half)
    if (firstHalf.join('||') === secondHalf.join('||')) {
      return deduped.slice(0, deduped.length - half)
    }
  }

  // 4. More aggressive check: if the first few blocks repeat later
  if (deduped.length >= 4) {
    for (let i = 2; i <= Math.floor(deduped.length / 2); i++) {
      const pattern = deduped.slice(0, i).join('||')
      const remaining = deduped.slice(i).join('||')
      if (remaining.includes(pattern)) {
        // We found a repeat. This is tricky because we don't want to cut off 
        // legitimate info. But if the repeat starts with "Attention!" or "These are",
        // it's likely a duplicate block.
        const firstBlock = deduped[0].toLowerCase()
        if (firstBlock.includes('attention') || firstBlock.includes('these are')) {
           // Return only the first occurrence of the repeating sequence
           return deduped.slice(0, i)
        }
      }
    }
  }

  return deduped
}

const stripListMarker = (block) => (
  block
    .replace(/^(?:[-*]\s+|â€¢\s*|âœ“\s*)/, '')
    .trim()
)

const isCompatibilityLine = (block) => {
  const cleaned = cleanDescriptionMarker(block).toLowerCase()
  if (cleaned.startsWith('compatible with:')) return true
  const normalized = block.replace(/^[•✓]\s*/, '').trim().toLowerCase()
  return normalized.startsWith('compatible with:')
}

const isLeadHighlightLine = (block) => {
  const normalized = block.trim()
  const lower = normalized.toLowerCase()
  if (normalized.length <= 220 && lower.includes('only compatible')) return true
  return (
    normalized.length <= 180 &&
    (lower.startsWith('these ') ||
      lower.startsWith('attention') ||
      lower.startsWith('important:') ||
      lower.startsWith('note:'))
  )
}

const cleanDescriptionMarker = (block) => (
  block
    .replace(/^(?:[-*]\s+|\u2022\s*|\u2713\s*|â€¢\s*|âœ“\s*)/, '')
    .trim()
)

const shouldRenderAsCheckLine = (block) => {
  const normalized = cleanDescriptionMarker(block).toLowerCase()
  return (
    /^(?:[-*]\s+|\u2022\s*|\u2713\s*|â€¢\s*|âœ“\s*)/.test(block) ||
    normalized.startsWith('compatible with:')
  )
}

const shouldRenderAsLeadLine = (block, index) => {
  const normalized = block.trim()
  return (
    normalized.length <= 220 &&
    (normalized.startsWith('These ') ||
      normalized.startsWith('Attention!') ||
      normalized.startsWith('Important:') ||
      normalized.includes('ONLY compatible') ||
      (index === 0 && !shouldRenderAsCheckLine(normalized) && normalized.length <= 180))
  )
}

const extractDescriptionBlocks = (product) => {
  const source = product?.descriptionHtml || product?.description || ''
  if (!source) return []

  const blocks = decodeEntities(
    source
      .replace(/\r/g, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|h[1-6]|li|ul|ol)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<[^>]+>/g, ' ')
  )
    .split(/\n+/)
    .flatMap((block) => splitLongDescriptionBlock(block))
    .map((block) => {
      let cleaned = block.replace(/\s+/g, ' ').trim()
      // Professional cleanup: Replace Amazon references with site-appropriate terms
      cleaned = cleaned.replace(/Amazon(?:'s)? fitment tool/gi, 'our fitment guide')
      return cleaned
    })
    .filter(Boolean)

  return collapseDuplicateDescriptionBlocks(blocks)
}

const ProductDetailPage = () => {
  const { category, productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Find the category info
  const categoryInfo = categories.find(cat => cat.slug === category)

  const [product, setProduct] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [productError, setProductError] = useState(null)
  const [cartError, setCartError] = useState(null)

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
      .then(([p, items]) => {
        if (p) {
          setProduct(p)
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
      .catch((e) => {
        console.error('Failed to load Shopify product:', e)
        const localProduct = getLocalProductByCategoryAndId(category, productId)
        const localCategoryProducts = getLocalProductsByCategorySlug(category)
        setProduct(localProduct)
        setCategoryProducts(localCategoryProducts)
        setProductError(localProduct ? null : (e.message || 'Failed to load product'))
      })
      .finally(() => setLoadingProduct(false))
  }, [categoryInfo?.id, category, productId])

  const productImages = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.images) && product.images.length) return product.images
    return product.image ? [product.image] : []
  }, [product])

  const descriptionBlocks = useMemo(() => extractDescriptionBlocks(product), [product])

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setSelectedImageIndex((prev) => Math.min(prev + 1, productImages.length - 1))
    }
    if (touchStart - touchEnd < -75) {
      setSelectedImageIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Extract product specifications from name and description
  const specifications = useMemo(() => {
    if (!product) return {}
    
    const specs = {
      dimensions: '',
      color: '',
      brand: '',
      installationType: 'Easy Installation'
    }

    // Extract dimensions (e.g., "15 inch", "16\"", etc.)
    const sizeMatch = product.name.match(/(\d+)\s*(inch|"|in)/i)
    if (sizeMatch) {
      specs.dimensions = `${sizeMatch[1]} inches`
    }

    // Extract color
    const colorKeywords = ['Chrome', 'Silver', 'Black', 'Matte', 'Polished', 'Gloss']
    colorKeywords.forEach(color => {
      if (product.name.includes(color) || product.description.includes(color)) {
        specs.color = color
      }
    })

    // Extract brand
    const brandKeywords = ['Fuel Rider', 'Premium', 'Universal', 'OEM']
    brandKeywords.forEach(brand => {
      if (product.name.includes(brand) || product.description.includes(brand)) {
        specs.brand = brand
      }
    })
    if (!specs.brand) specs.brand = 'OnePacificHub'

    // Installation type
    if (product.name.includes('Snap-On') || product.description.includes('snap')) {
      specs.installationType = 'Snap-On Installation'
    } else if (product.name.includes('Push-On') || product.description.includes('push')) {
      specs.installationType = 'Push-On Installation'
    }

    return specs
  }, [product])

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <p className="text-gray-700 text-lg font-semibold">Loading product...</p>
      </div>
    )
  }

  if (productError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Could not load product</h1>
          <p className="text-gray-600 mb-4">{productError}</p>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
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
      .then((res) => {
        if (res?.success) {
          setAddedToCart(true)
          setTimeout(() => setAddedToCart(false), 2000)
        } else {
          setCartError(res?.error || 'Could not add to cart')
        }
      })
      .catch((e) => {
        console.error('Add to cart failed:', e)
        setCartError(e?.message || 'Could not add to cart')
      })
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: categoryInfo?.name, href: `/products/${category}` },
            { label: product?.name, href: null }
          ]}
        />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images - Desktop: Vertical Layout */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Desktop: Vertical Image Gallery */}
            <div className="hidden md:flex gap-4">
              {/* Thumbnail Column */}
              <div className="flex flex-col gap-3 w-20">
                {productImages.map((img, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-600 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    {...a11yAction(
                      selectedImageIndex === index
                        ? `Image ${index + 1} of ${productImages.length} (selected)`
                        : `Show image ${index + 1} of ${productImages.length}`
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-xl">
                <ImageZoom
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                />
              </div>
            </div>

            {/* Mobile: Swipeable Gallery */}
            <div className="md:hidden relative bg-white rounded-2xl p-6 shadow-xl">
              <div
                className="relative aspect-square overflow-hidden rounded-xl"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      {...a11yAction('Previous product image')}
                    >
                      <ChevronLeft size={20} className="text-gray-900" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      {...a11yAction('Next product image')}
                    >
                      <ChevronRight size={20} className="text-gray-900" aria-hidden />
                    </button>
                  </>
                )}
              </div>

              {/* Image Indicators */}
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {productImages.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        selectedImageIndex === index
                          ? 'w-8 bg-blue-600'
                          : 'w-2 bg-gray-300'
                      }`}
                      {...a11yAction(
                        selectedImageIndex === index
                          ? `Slide ${index + 1} of ${productImages.length} (current)`
                          : `Go to slide ${index + 1} of ${productImages.length}`
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              {/* Star Rating */}
              <div className="mb-2">
                <StarRating rating={4.5} reviews={127} size={18} />
              </div>
              
              <p className="text-sm text-gray-500">Part #: {product.id}</p>
              {product.metafield?.value && (
                <p className="mt-3 text-gray-800">
                  <strong>Compatible with:</strong> {product.metafield.value}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-4xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Product Specifications */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {specifications.dimensions && (
                  <div className="flex items-start gap-3">
                    <Package className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="font-semibold text-gray-900">{specifications.dimensions}</p>
                    </div>
                  </div>
                )}
                {specifications.color && (
                  <div className="flex items-start gap-3">
                    <Palette className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-semibold text-gray-900">{specifications.color}</p>
                    </div>
                  </div>
                )}
                {specifications.brand && (
                  <div className="flex items-start gap-3">
                    <Building2 className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-semibold text-gray-900">{specifications.brand}</p>
                    </div>
                  </div>
                )}
                {specifications.installationType && (
                  <div className="flex items-start gap-3">
                    <Wrench className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Installation Type</p>
                      <p className="font-semibold text-gray-900">{specifications.installationType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About this item */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this item</h2>
              {descriptionBlocks.length > 0 ? (
                <div className="space-y-3">
                  {descriptionBlocks.map((block, index) => (
                    isCompatibilityLine(block) || block.startsWith('• ') ? (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">
                          {block.replace(/^[•✓]\s*/, '')}
                        </span>
                      </div>
                    ) : isLeadHighlightLine(block) ? (
                      <p key={index} className="text-gray-900 font-semibold leading-relaxed">
                        {block}
                      </p>
                    ) : (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {block}
                      </p>
                    )
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{product.description}</span>
                  </li>
                  {product.features && product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    {...a11yAction('Decrease quantity')}
                  >
                    <Minus size={20} aria-hidden />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    {...a11yAction('Increase quantity')}
                  >
                    <Plus size={20} aria-hidden />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={
                  addedToCart
                    ? 'Added to cart'
                    : `Add to cart, ${quantity} item(s), total ${(product.price * quantity).toFixed(2)} dollars`
                }
                title={addedToCart ? 'Added to cart' : 'Add this product to your cart'}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={24} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </motion.button>

              {cartError && (
                <p className="mt-3 text-sm text-red-600 font-semibold text-center">
                  {cartError}
                </p>
              )}
            </div>

            {/* View Cart Link */}
            {addedToCart && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Link
                  to="/cart"
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  View Cart & Checkout
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Similar Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((similarProduct, index) => (
                <Link key={similarProduct.id} to={`/products/${category}/${similarProduct.id}`}>
                  <div className="bg-white border border-gray-200 overflow-hidden cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-white p-4">
                      <img
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                        {similarProduct.name}
                      </h3>
                      <div className="mb-2">
                        <StarRating rating={4.5} reviews={127} size={12} />
                      </div>
                      <div className="mt-auto">
                        <span className="text-xl font-bold text-blue-600">
                          ${similarProduct.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>

        {/* Customer Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          {/* Review Summary */}
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">4.5</div>
                <StarRating rating={4.5} reviews={0} size={20} />
                <p className="text-sm text-gray-600 mt-2">Based on 127 reviews</p>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-12">{stars} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{stars === 5 ? 70 : stars === 4 ? 20 : 5}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {[
              { name: 'John D.', rating: 5, date: 'February 15, 2026', comment: 'Perfect fit for my truck! Quality is excellent and installation was a breeze. Highly recommend!' },
              { name: 'Sarah M.', rating: 5, date: 'February 10, 2026', comment: 'Great product at a great price. Looks amazing on my vehicle. Fast shipping too!' },
              { name: 'Mike R.', rating: 4, date: 'February 5, 2026', comment: 'Good quality hubcaps. Only 4 stars because shipping took a bit longer than expected, but product is solid.' }
            ].map((review, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} reviews={0} size={14} />
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Write a Review Button */}
          <div className="mt-8 text-center">
            <button
              type="button"
              className="bg-blue-600 text-white px-8 py-3 font-semibold"
              title="Write a product review"
            >
              Write a Review
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetailPage
