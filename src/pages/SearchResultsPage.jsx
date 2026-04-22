import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import { searchLocalProducts } from '../data/catalog'
import PageBackLink from '../components/PageBackLink'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()

  const results = useMemo(() => searchLocalProducts(query), [query])

  return (
    <div className="min-h-screen bg-gray-50 pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBackLink to="/" label="Back to home" />
        <Breadcrumb items={[{ label: 'Search', href: null }]} />

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">
            Search Results
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {query ? `Results for "${query}"` : 'Search products'}
          </h1>
          <p className="text-lg text-gray-600">
            Search by brand ID, part number, or product name to find matching items faster.
          </p>
        </div>

        {query ? (
          <>
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <p className="text-lg font-semibold text-gray-900">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    categorySlug={product.categorySlug}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-10 shadow-md text-center">
                <p className="text-2xl font-bold text-gray-900 mb-3">No matching products found</p>
                <p className="text-gray-600 mb-6">
                  Try a part number, brand ID, or a simpler product keyword.
                </p>
                <Link to="/products" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Browse all products
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl bg-white p-10 shadow-md text-center">
            <p className="text-2xl font-bold text-gray-900 mb-3">Enter a search term</p>
            <p className="text-gray-600">
              Use the search bar in the navbar to look up a brand ID, part number, or product.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage
