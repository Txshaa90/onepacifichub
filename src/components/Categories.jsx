import { Link } from 'react-router-dom'
import { mainCategories, getSubcategoriesForMainCategory } from '../data/categories'

const Categories = ({ compact = false }) => {
  return (
    <section className={compact ? 'bg-white py-14 md:py-20' : 'bg-white py-24'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Shop Categories
          </p>
          <h2 className={`${compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight text-slate-950`}>
            Browse by collection
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {mainCategories.map((category) => {
            const subcategories = getSubcategoriesForMainCategory(category.slug)

            return (
              <div key={category.slug} className="border-t border-slate-200 pt-6">
                <Link to={`/category/${category.slug}`} className="group block">
                  <div className={`relative overflow-hidden ${compact ? 'h-64' : 'h-72'}`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/35" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                      <h3 className="text-3xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                </Link>

                <div className="mt-5 flex flex-wrap gap-3">
                  {subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/products/${subcategory.slug}`}
                      className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-950 hover:text-slate-950"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories
