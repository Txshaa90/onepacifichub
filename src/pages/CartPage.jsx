import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { a11yAction } from '../lib/controlHints'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, checkoutUrl, currencyCode } = useCart()
  const currency = currencyCode || 'USD'
  const fmt = (amount) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-36 md:pt-44 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Add some products to get started!
            </p>
            <Link
              to="/"
              className="inline-flex bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all motion-safe:hover:scale-105 motion-safe:active:scale-95"
              title="Continue shopping"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              type="button"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-semibold text-sm underline"
              title="Remove all items from cart"
            >
              Clear Cart
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-xl"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {item.productTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">Variant: {item.title || item.productHandle}</p>
                      </div>
                      {/* Remove Button - Mobile Top Right */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.lineId)}
                        className="text-red-500 hover:text-red-700 transition-colors sm:hidden"
                        {...a11yAction(`Remove ${item.productTitle} from cart`)}
                      >
                        <Trash2 size={20} aria-hidden />
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          {...a11yAction(`Decrease quantity of ${item.productTitle}`)}
                        >
                          <Minus size={16} aria-hidden />
                        </button>
                        <span className="text-lg font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          {...a11yAction(`Increase quantity of ${item.productTitle}`)}
                        >
                          <Plus size={16} aria-hidden />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {fmt(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">{fmt(item.price)} each</p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button - Desktop */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.lineId)}
                    className="hidden sm:block text-red-500 hover:text-red-700 transition-colors"
                    {...a11yAction(`Remove ${item.productTitle} from cart`)}
                  >
                    <Trash2 size={24} aria-hidden />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{fmt(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">{fmt(0)}</span>
                </div>
                <p className="text-xs text-gray-500">Final tax and shipping are set on Shopify checkout.</p>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">{fmt(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all mb-4 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
                  title="Proceed to secure checkout"
                >
                  Proceed to Checkout
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-busy="true"
                  aria-label="Loading checkout"
                  title="Loading checkout"
                  className="w-full bg-gray-200 text-gray-600 py-4 rounded-xl font-bold text-lg shadow-xl transition-all mb-4 cursor-wait"
                >
                  Loading Checkout...
                </button>
              )}

              <Link
                to="/"
                className="block w-full text-center border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all"
                title="Continue shopping"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
