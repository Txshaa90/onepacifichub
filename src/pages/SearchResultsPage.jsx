import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import { getCategoriesForFitment, getSearchableProducts, searchLocalProducts, searchProductsByFitment } from '../data/catalog'
import { categories } from '../data/categories'
import PageBackLink from '../components/PageBackLink'
import { fetchProductsBySku, isShopifyConfigured } from '../lib/shopifyStorefront'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const year = (searchParams.get('year') || '').trim()
  const make = (searchParams.get('make') || '').trim()
  const model = (searchParams.get('model') || '').trim()
  const trim = (searchParams.get('trim') || '').trim()
  const selectedCategory = (searchParams.get('category') || '').trim()
  const [shopifyResults, setShopifyResults] = useState([])
  const [searching, setSearching] = useState(false)

  const fitmentActive = Boolean(year || make || model || trim)
  useEffect(() => {
    if (fitmentActive || !query || !isShopifyConfigured()) {
      setShopifyResults([])
      setSearching(false)
      return
    }

    let active = true
    setSearching(true)

    fetchProductsBySku({ sku: query })
      .then((products) => {
        if (!active) return

        const localProducts = getSearchableProducts()
        setShopifyResults(products.map((product) => {
          const localMatch = localProducts.find((item) => item.id === product.id || item.sku === product.sku)
          const matchedCategory = categories.find((category) =>
            product.collectionHandles.includes(category.shopifyHandle || category.slug)
          )

          return {
            ...product,
            categorySlug: matchedCategory?.slug || localMatch?.categorySlug || 'hubcaps'
          }
        }))
      })
      .catch((error) => {
        console.error('Failed to search Shopify products by SKU:', error)
        if (active) setShopifyResults(searchLocalProducts(query))
      })
      .finally(() => {
        if (active) setSearching(false)
      })

    return () => {
      active = false
    }
  }, [fitmentActive, query])

  const results = useMemo(() => {
    if (fitmentActive) {
      return searchProductsByFitment({ year, make, model, trim })
        .filter((product) => !selectedCategory || product.categorySlug === selectedCategory)
    }
    return isShopifyConfigured() ? shopifyResults : searchLocalProducts(query)
  }, [fitmentActive, make, model, query, selectedCategory, shopifyResults, trim, year])
  const compatibleCategories = useMemo(
    () => fitmentActive
      ? getCategoriesForFitment({ year, make, model, trim })
        .map((entry) => ({
          ...entry,
          category: categories.find((item) => item.slug === entry.categorySlug)
        }))
        .filter((entry) => entry.category)
      : [],
    [fitmentActive, make, model, trim, year]
  )

  const categoryHref = (categorySlug) => {
    const params = new URLSearchParams({ year, make, model })
    if (trim) params.set('trim', trim)
    params.set('category', categorySlug)
    return `/search?${params.toString()}`
  }

  const heading = fitmentActive
    ? [year, make, model, trim].filter(Boolean).join(' / ')
    : query

  return (
    <div className="min-h-screen bg-gray-50 pt-44 pb-16 md:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageBackLink to="/" label="Back to home" />
        <Breadcrumb items={[{ label: 'Search', href: null }]} />

        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Search Results
          </p>
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            {heading ? `Results for ${heading}` : 'Search products'}
          </h1>
          <p className="text-lg text-gray-600">
            Search by SKU, or use the fitment selector to narrow matching products.
          </p>
        </div>

        {(query || fitmentActive) ? (
          <>
            {fitmentActive && !selectedCategory ? (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Choose a category for your vehicle</h2>
                {compatibleCategories.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {compatibleCategories.map(({ category, categorySlug, productCount }) => (
                      <Link key={categorySlug} to={categoryHref(categorySlug)} className="border border-slate-200 bg-white p-5 transition hover:border-blue-500 hover:shadow-md">
                        <p className="text-lg font-bold text-slate-950">{category.name}</p>
                        <p className="mt-2 text-sm text-slate-600">{category.description}</p>
                        <p className="mt-4 text-sm font-semibold text-blue-700">{productCount} compatible {productCount === 1 ? 'product' : 'products'} →</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="border border-slate-200 bg-white p-6 text-slate-600">No product categories are currently mapped to this vehicle.</div>
                )}
              </div>
            ) : null}

            <div className="mb-6 rounded-2xl bg-white p-5 shadow-md">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-lg font-semibold text-gray-900">
                  {searching
                    ? 'Searching Shopify by SKU…'
                    : selectedCategory
                    ? `${results.length} compatible ${results.length === 1 ? 'product' : 'products'}`
                    : `${compatibleCategories.length || results.length} ${fitmentActive ? 'available categories' : (results.length === 1 ? 'result' : 'results')}`}
                </p>
                {fitmentActive ? (
                  <div className="flex flex-wrap gap-2">
                    {[year, make, model, trim].filter(Boolean).map((value) => (
                      <span key={value} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {!searching && results.length > 0 && (!fitmentActive || selectedCategory) ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((product, index) => (
                  <ProductCard
                    key={`${product.categorySlug}-${product.id}`}
                    product={product}
                    index={index}
                    categorySlug={product.categorySlug}
                  />
                ))}
              </div>
            ) : !searching && (!fitmentActive || selectedCategory) ? (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-md">
                <p className="mb-3 text-2xl font-bold text-gray-900">No matching products found</p>
                <p className="mb-6 text-gray-600">
                  Check the SKU and try again.
                </p>
                <Link to="/products" className="font-semibold text-blue-600 underline transition hover:text-blue-700">
                  Browse all categories
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-md">
            <p className="mb-3 text-2xl font-bold text-gray-900">Enter a search term</p>
            <p className="text-gray-600">
              Enter a SKU in the navbar search, or use the homepage fitment selector.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage
