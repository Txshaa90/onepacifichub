import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchCart,
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  isShopifyConfigured
} from '../lib/shopifyStorefront'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartId, setCartId] = useState(null)
  const [checkoutUrl, setCheckoutUrl] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [currencyCode, setCurrencyCode] = useState('USD')

  const refreshCart = useCallback(async (id) => {
    if (!id) return
    const cart = await fetchCart(id)
    if (!cart) {
      setCartId(null)
      setCartItems([])
      setCheckoutUrl(null)
      setTotalAmount(0)
      return
    }
    setCartId(cart.id)
    setCartItems(cart.items)
    setCheckoutUrl(cart.checkoutUrl)
    setTotalAmount(cart.totalAmount)
    setCurrencyCode(cart.currencyCode)
  }, [])

  useEffect(() => {
    // Shopify cart is session-based; we persist the cart id in localStorage.
    if (!isShopifyConfigured()) return
    const savedCartId = localStorage.getItem('shopifyCartId')
    if (savedCartId) {
      refreshCart(savedCartId).catch((e) => {
        console.warn('Failed to load Shopify cart:', e)
      })
    }
  }, [refreshCart])

  const addToCart = async (product, quantity = 1) => {
    if (!isShopifyConfigured()) {
      // Keep UI from breaking when Shopify isn't set up yet.
      return { success: false, error: 'Shopify is not configured.' }
    }
    if (!product?.variantId) {
      return { success: false, error: 'This product has no purchasable variant.' }
    }

    const lines = [{ merchandiseId: product.variantId, quantity }]

    const nextCart = cartId
      ? await cartLinesAdd({ cartId, lines })
      : await cartCreate({ lines })

    if (!nextCart) {
      return { success: false, error: 'Unable to create cart.' }
    }

    await refreshCart(nextCart.id)
    return { success: true }
  }

  const removeFromCart = async (lineId) => {
    if (!isShopifyConfigured()) return
    if (!cartId) return
    await cartLinesRemove({ cartId, lineIds: [lineId] })
    await refreshCart(cartId)
  }

  const updateQuantity = async (lineId, quantity) => {
    if (!isShopifyConfigured()) return
    if (!cartId) return
    if (quantity <= 0) {
      await removeFromCart(lineId)
      return
    }

    const lines = [{ lineId, quantity }]
    await cartLinesUpdate({ cartId, lines })
    await refreshCart(cartId)
  }

  const clearCart = async () => {
    if (!isShopifyConfigured()) return
    if (!cartId) return
    const lineIds = cartItems.map((i) => i.lineId)
    if (!lineIds.length) return
    await cartLinesRemove({ cartId, lineIds })
    localStorage.removeItem('shopifyCartId')
    setCartId(null)
    setCartItems([])
    setCheckoutUrl(null)
    setTotalAmount(0)
  }

  // When we create/load the cart, persist the cart id.
  useEffect(() => {
    if (!isShopifyConfigured()) return
    if (cartId) localStorage.setItem('shopifyCartId', cartId)
  }, [cartId])

  const getCartTotal = () => totalAmount
  const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        checkoutUrl,
        currencyCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
