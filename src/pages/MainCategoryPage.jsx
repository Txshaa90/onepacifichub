import { motion } from 'framer-motion'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import {
  findMainCategoryBySlug,
  getSubcategoriesForMainCategory
} from '../data/categories'

const MainCategoryPage = () => {
  const { mainCategory } = useParams()
  const location = useLocation()
  const category = findMainCategoryBySlug(mainCategory)

  if (!category) {
    return <Navigate to="/products" replace />
  }

  const subcategories = getSubcategoriesForMainCategory(category.slug)

  // Use state if available, otherwise determine the best label
  const parentBreadcrumb = location.state?.parentBreadcrumb || {
    label: 'Shop by Category',
    href: '/products'
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            parentBreadcrumb,
            { label: category.name, href: null }
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[240px] md:min-h-[280px]">
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-80`} />
              <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  Main Category
                </p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">{category.name}</h1>
                <p className="mt-3 max-w-2xl text-base md:text-lg text-white/90">{category.description}</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900">Choose a subcategory</h2>
              <p className="mt-3 text-gray-600">
                Each subcategory opens its own collection page so products stay organized and easier to browse.
              </p>

              <div className="mt-6 grid gap-4">
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    to={`/products/${subcategory.slug}`}
                    state={{ parentBreadcrumb }}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 transition hover:border-blue-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{subcategory.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {subcategory.description}
                        </p>
                      </div>
                      <span className="text-xl text-blue-600">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainCategoryPage
