import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { getFeaturedLocalProducts } from '../data/catalog'
import { fetchCollectionProducts, isShopifyConfigured } from '../lib/shopifyStorefront'
import { categories } from '../data/categories'

const featuredCollectionConfigs = [
  { categorySlug: 'hubcaps', handle: 'hubcaps' },
  { categorySlug: 'wheelskins', handle: 'wheelskins' },
  { categorySlug: 'wheel-simulator', handle: 'wheel-simulators' },
  { categorySlug: 'trim-rings', handle: 'trim-rings' }
]

const localFeaturedProducts = getFeaturedLocalProducts()

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState(localFeaturedProducts)
  const [loadingLiveProducts, setLoadingLiveProducts] = useState(true)

  useEffect(() => {
    if (!isShopifyConfigured()) {
      setLoadingLiveProducts(false)
      return
    }

    let isCancelled = false

    Promise.all(
      featuredCollectionConfigs.map(async ({ categorySlug, handle }) => {
        const categoryInfo = categories.find((category) => category.slug === categorySlug)
        const products = await fetchCollectionProducts({
          handle: categoryInfo?.shopifyHandle || handle,
          first: 3
        })

        return products.map((product) => ({
          ...product,
          categorySlug,
          rating: product.rating || 4.8,
          reviews: product.reviews || 24
        }))
      })
    )
      .then((collections) => {
        if (isCancelled) return

        const seen = new Set()
        const flattened = collections
          .flat()
          .filter((product) => {
            const key = `${product.categorySlug}:${product.id}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          .slice(0, 4)

        if (flattened.length > 0) {
          setFeaturedProducts(flattened)
        }
      })
      .catch((error) => {
        console.error('Failed to load homepage featured Shopify products:', error)
      })
      .finally(() => {
        if (!isCancelled) {
          setLoadingLiveProducts(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Best Sellers
          </p>
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Popular picks ready to shop
          </h2>
        </div>

        {loadingLiveProducts && featuredProducts.length === 0 ? (
          <div className="border border-slate-200 bg-white p-10 text-center text-slate-600">
            Loading featured products...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={`${product.categorySlug}-${product.id}`}
                product={product}
                index={index}
                categorySlug={product.categorySlug}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center border border-slate-300 px-7 py-4 font-semibold text-slate-950 hover:border-slate-950"
          >
            View Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
