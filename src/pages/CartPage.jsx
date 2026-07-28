import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { a11yAction } from '../lib/controlHints'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, checkoutUrl, currencyCode } = useCart()
  const currency = currencyCode || 'USD'
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const fmt = (amount) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-44 pb-16 md:pt-48">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] bg-white p-12 text-center shadow-sm"
          >
            <ShoppingBag className="mx-auto mb-6 text-slate-300" size={78} />
            <h1 className="mb-4 text-4xl font-bold text-slate-950">Your cart is empty</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
              Add some amazing auto parts to get started.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 text-lg font-semibold text-white transition hover:bg-slate-900"
            >
              Start Shopping
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-44 pb-16 md:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-slate-600 transition hover:text-blue-600">
            <ArrowLeft size={18} aria-hidden />
            Continue shopping
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Cart</p>
              <h1 className="text-4xl font-bold text-slate-950">My Cart</h1>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="bg-white p-6">
            <div className="mb-4 hidden grid-cols-[120px_minmax(0,1fr)_140px_140px_120px] gap-6 border-b border-slate-200 pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid">
              <span>Product</span>
              <span />
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="space-y-5">
              {cartItems.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="border-b border-slate-200 p-4 md:grid md:grid-cols-[120px_minmax(0,1fr)_140px_140px_120px] md:items-start md:gap-6"
                >
                  <div className="flex h-28 w-full items-center justify-center rounded-[1.25rem] bg-slate-50 p-3">
                    <img src={item.image} alt={item.productTitle} className="h-full w-full object-contain" />
                  </div>

                  <div className="mt-4 md:mt-0">
                    <h2 className="text-lg font-bold text-slate-950">{item.productTitle}</h2>
                    <p className="mt-1 text-sm text-slate-500">{item.title || item.productHandle}</p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.lineId)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700"
                      {...a11yAction(`Remove ${item.productTitle} from cart`)}
                    >
                      <Trash2 size={16} aria-hidden />
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:hidden">Price</p>
                    <p className="mt-1 font-semibold text-slate-950">{fmt(item.price)}</p>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:hidden">Quantity</p>
                    <div className="mt-2 inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        className="flex h-10 w-10 items-center justify-center bg-white text-slate-900 transition hover:bg-slate-50"
                        {...a11yAction(`Decrease quantity of ${item.productTitle}`)}
                      >
                        <Minus size={16} aria-hidden />
                      </button>
                      <span className="flex h-10 w-12 items-center justify-center border-x border-slate-200 font-semibold text-slate-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center bg-white text-slate-900 transition hover:bg-slate-50"
                        {...a11yAction(`Increase quantity of ${item.productTitle}`)}
                      >
                        <Plus size={16} aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:hidden">Total</p>
                    <p className="mt-1 text-xl font-bold text-slate-950">{fmt(item.price * item.quantity)}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-36 overflow-hidden border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-bold text-slate-950">Order Summary</h2>
              </div>

              <div className="space-y-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})</span>
                    <span className="font-semibold">{fmt(getCartTotal())}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Taxes</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between text-xl font-bold text-slate-950">
                      <span>Estimated Total</span>
                      <span>{fmt(getCartTotal())}</span>
                    </div>
                  </div>
                </div>

                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    className="inline-flex w-full items-center justify-center gap-3 bg-[#ffc439] px-4 py-4 text-base font-bold text-slate-950 hover:bg-[#f3ba2f]"
                  >
                    <span className="rounded bg-white px-2 py-1 text-sm font-black text-[#003087]">PayPal</span>
                    Checkout with PayPal
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-wait rounded-2xl bg-slate-200 px-4 py-4 text-base font-bold text-slate-600"
                  >
                    Loading Checkout...
                  </button>
                )}

                <p className="text-center text-sm font-medium text-slate-600">
                  PayPal is the only payment option enabled for launch testing.
                </p>

                <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <ShieldCheck size={16} className="text-emerald-600" aria-hidden />
                    Secure checkout
                  </div>
                  Final taxes, shipping, and payment options are confirmed inside Shopify checkout.
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

export default CartPage
