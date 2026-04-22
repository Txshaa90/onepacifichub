import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import StarRating from './StarRating'
import { extractDescriptionBlocks } from '../lib/productUtils'
import { useMemo } from 'react'

const ProductCard = ({ product, index, categorySlug: categorySlugProp }) => {
  const { category } = useParams()
  const targetCategory = categorySlugProp || category

  const cleanDescription = useMemo(() => {
    const blocks = extractDescriptionBlocks(product)
    return blocks.length > 0 ? blocks[0] : product.description
  }, [product])

  return (
    <Link
      to={`/products/${targetCategory}/${product.id}`}
      aria-label={`${product.name}, view product details`}
      title={`View ${product.name}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white border border-gray-200 overflow-hidden cursor-pointer h-full flex flex-col group hover:shadow-lg transition-all"
      >
        {/* Product Image */}
        <div className="relative h-56 overflow-hidden bg-white p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-12">
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
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {cleanDescription}
          </p>

          {/* CTA matches behavior: whole card opens the product (no nested interactive control). */}
          <div className="mt-auto">
            <span className="w-full bg-blue-600 text-white px-4 py-3 font-semibold flex items-center justify-center gap-2 group-hover:bg-blue-700 transition-colors">
              View product
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard
