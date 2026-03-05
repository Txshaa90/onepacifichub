import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Check, Minus, Plus, Package, Palette, Building2, Wrench, ChevronLeft, ChevronRight } from 'lucide-react'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'
import Breadcrumb from '../components/Breadcrumb'
import StarRating from '../components/StarRating'
import ImageZoom from '../components/ImageZoom'
import { useState, useMemo, useEffect } from 'react'

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
  
  // Get all products for this category
  const categoryProducts = products[categoryInfo?.id] || []
  
  // Find the specific product
  const product = categoryProducts.find(p => p.id === productId)

  const productImages = useMemo(() => {
    if (!product) return []
    return [product.image, product.image, product.image]
  }, [product])

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
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
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
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-600 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
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
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-900" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Indicators */}
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        selectedImageIndex === index
                          ? 'w-8 bg-blue-600'
                          : 'w-2 bg-gray-300'
                      }`}
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
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQuantity}
                    className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
            <button className="bg-blue-600 text-white px-8 py-3 font-semibold">
              Write a Review
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetailPage
