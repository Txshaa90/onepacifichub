import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { getFeaturedLocalProducts } from '../data/catalog'

const featuredProducts = getFeaturedLocalProducts()

const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">
              Featured Products
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular picks ready to shop
            </h2>
            <p className="max-w-3xl text-lg text-gray-600">
              A quick starting point for top wheel cover and trim products that customers browse most often.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 font-semibold text-gray-900 transition hover:border-blue-300 hover:text-blue-600"
          >
            View all products
            <span>→</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              categorySlug={product.categorySlug}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
