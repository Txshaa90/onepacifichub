import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import StarRating from './StarRating'

const ProductCard = ({ product, index }) => {
  const { category } = useParams()
  
  return (
    <Link to={`/products/${category}/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white border border-gray-200 overflow-hidden cursor-pointer h-full flex flex-col"
      >
        {/* Product Image */}
        <div className="relative h-56 overflow-hidden bg-white p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="mb-3">
            <StarRating rating={4.5} reviews={127} size={14} />
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
            }}
            className="w-full bg-blue-600 text-white px-4 py-3 font-semibold flex items-center justify-center gap-2"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard
