import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { mainCategories, getSubcategoriesForMainCategory } from '../data/categories'
import Breadcrumb from '../components/Breadcrumb'
import PageBackLink from '../components/PageBackLink'

const CategoriesOverviewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBackLink to="/" label="Back to home" />
        <Breadcrumb items={[{ label: 'Shop by Category', href: null }]} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">
            Shop by Category
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start with the main product families
          </h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Browse by top-level category first, then move into the exact subcategory and product collection you need.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {mainCategories.map((mainCategory, index) => {
            const subcategories = getSubcategoriesForMainCategory(mainCategory.slug)

            return (
              <motion.div
                key={mainCategory.slug}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200"
              >
                <div className="grid h-full md:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[280px]">
                    <img
                      src={mainCategory.image}
                      alt={mainCategory.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${mainCategory.accent} opacity-75`} />
                    <div className="relative flex h-full flex-col justify-end p-8 text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                        Main Category
                      </p>
                      <h2 className="mt-3 text-3xl font-bold">{mainCategory.name}</h2>
                      <p className="mt-3 max-w-md text-white/90">{mainCategory.description}</p>
                      <Link
                        to={`/category/${mainCategory.slug}`}
                        className="mt-6 inline-flex w-fit items-center rounded-full bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
                      >
                        Explore {mainCategory.name}
                      </Link>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Subcategories
                    </p>
                    <div className="mt-6 space-y-3">
                      {subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.slug}
                          to={`/products/${subcategory.slug}`}
                          className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 text-gray-900 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          <div>
                            <p className="font-semibold">{subcategory.name}</p>
                            <p className="text-sm text-gray-500">Open collection</p>
                          </div>
                          <span className="text-blue-600">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoriesOverviewPage
