import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { mainCategories, getSubcategoriesForMainCategory } from '../data/categories'

const Categories = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Shop Main Categories First
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with the main category, then drill into the exact subcategory and collection page you need.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {mainCategories.map((category, index) => {
            const subcategories = getSubcategoriesForMainCategory(category.slug)

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow hover:shadow-2xl"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-70`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                      Main Category
                    </p>
                    <h3 className="mt-3 text-3xl font-bold">{category.name}</h3>
                    <p className="mt-3 max-w-xl text-white/90">{category.description}</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-3">
                    {subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        to={`/products/${subcategory.slug}`}
                        className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={`/category/${category.slug}`}
                    className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Browse {category.name}
                    <span>→</span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories
