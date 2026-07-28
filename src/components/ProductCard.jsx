import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getCustomerPrice, getProductTitle } from '../lib/productPresentation'

const ProductCard = ({ product, index, categorySlug: categorySlugProp }) => {
  const { category } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const targetCategory = categorySlugProp || category
  const productHref = `/products/${targetCategory}/${product.id}`
  const productTitle = getProductTitle(product)
  const customerPrice = getCustomerPrice(product, user?.pricingTier)

  const handleAddToCart = async () => {
    if (!product.variantId) return
    setIsAdding(true)
    setError('')

    try {
      const result = await addToCart(product, 1)
      if (result?.success) {
        setAdded(true)
        window.setTimeout(() => setAdded(false), 1600)
      } else {
        setError(result?.error || 'Could not add this product')
      }
    } catch (err) {
      setError(err?.message || 'Could not add this product')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <article
      className="flex h-full flex-col border-t border-slate-200 bg-white pt-4"
    >
      <Link to={productHref} aria-label={`${productTitle}, view product details`} title={`View ${productTitle}`}>
        <div className="relative flex h-80 items-center justify-center overflow-hidden bg-white p-0">
          <img
            src={product.image}
            alt={productTitle}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={productHref} className="hover:text-slate-600">
          <h3 className="min-h-[3.25rem] text-base font-bold text-slate-950 line-clamp-2">
            {productTitle}
          </h3>
        </Link>

        <div className="mt-3">
          <StarRating rating={product.rating || 4.5} reviews={product.reviews || 0} size={14} />
        </div>

        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-950">${customerPrice.toFixed(2)}</span>
        </div>

        <div className="mt-5 grid gap-3">
          {product.variantId ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white ${
                added ? 'bg-emerald-600' : 'bg-slate-950 hover:bg-slate-800'
              } disabled:cursor-wait disabled:opacity-70`}
            >
              <ShoppingCart size={16} aria-hidden />
              {added ? 'Added to cart' : isAdding ? 'Adding...' : 'Add to cart'}
            </button>
          ) : null}

          <Link
            to={productHref}
            className="inline-flex items-center justify-center border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-slate-950"
          >
            View details
          </Link>
        </div>

        {error ? (
          <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
        ) : null}
      </div>
    </article>
  )
}

export default ProductCard
