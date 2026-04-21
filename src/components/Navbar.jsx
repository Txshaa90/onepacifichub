import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, ChevronDown, LogOut, Package, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { a11yAction } from '../lib/controlHints'

const Navbar = () => {
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    await logout()
    setUserMenuOpen(false)
    setIsOpen(false)
    navigate('/', { replace: true })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  const secondaryNavItems = [
    { name: 'Wheel Covers', href: '/category/wheel-covers' },
    { name: 'Restyling Accessories', href: '/category/restyling-accessories' },
    { name: 'About', href: '/#upgrade-your-ride' },
    { name: 'Contact Us', href: '/help#support' },
    { name: 'Shop by Category', href: '/products' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
      }`}
    >
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[88px] items-center gap-4 py-4">
            <Link to="/" className="shrink-0">
              <Logo size="small" />
            </Link>

            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 min-w-0">
              <div className="flex w-full overflow-hidden rounded-2xl border border-slate-900 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <div className="hidden lg:flex items-center border-r border-gray-200 bg-gray-100 px-4 text-sm font-semibold text-gray-600">
                  All
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by brand ID, part number, or product"
                    className="w-full bg-white py-4 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-white transition hover:brightness-105"
                  title="Search products"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-gray-900 transition-colors hover:bg-gray-100"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    title={userMenuOpen ? 'Close account menu' : 'Open account menu'}
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                      />
                    ) : (
                      <User size={18} />
                    )}
                    <span className="hidden xl:flex flex-col items-start leading-tight">
                      <span className="text-xs font-medium text-gray-500">Hello, sign in</span>
                      <span className="max-w-[140px] truncate">
                        {user?.firstName || user?.email?.split('@')[0] || 'Account'}
                      </span>
                    </span>
                    <span className="xl:hidden">Account</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-[60] mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <Link
                          to="/account"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={16} className="text-gray-500" />
                          Profile
                        </Link>
                        <Link
                          to="/account#orders"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={16} className="text-gray-500" />
                          Orders
                        </Link>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                          title="Log out"
                        >
                          <LogOut size={16} />
                          Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <motion.div
                    className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-gray-900 transition-colors hover:bg-gray-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User size={18} />
                    <span className="hidden xl:inline">Hello, sign in</span>
                    <span className="xl:hidden">Sign In</span>
                  </motion.div>
                </Link>
              )}

              <Link
                to="/cart"
                {...a11yAction(
                  getCartCount() > 0
                    ? `Shopping cart, ${getCartCount()} items`
                    : 'Shopping cart'
                )}
                className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium text-white transition-shadow hover:shadow-lg motion-safe:transition-transform active:scale-95 hover:scale-105"
              >
                <ShoppingCart size={18} aria-hidden />
                Cart
                {getCartCount() > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>

            <motion.button
              type="button"
              className="ml-auto md:hidden text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              {...a11yAction(isOpen ? 'Close navigation menu' : 'Open navigation menu')}
            >
              {isOpen ? <X size={28} aria-hidden /> : <Menu size={28} aria-hidden />}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="hidden md:block border-b border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between gap-6">
            <div className="flex items-center gap-6 lg:gap-8">
              {secondaryNavItems.map((item, index) => (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    className="whitespace-nowrap text-sm font-semibold text-white/95 transition-colors hover:text-slate-100"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 + 0.2 }}
                    whileHover={{ y: -1 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
            </div>

            <p className="hidden lg:block text-sm font-medium text-white/70">
              Search by brand ID, part number, or product
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="space-y-1 px-4 py-6">
              <form onSubmit={handleSearchSubmit} className="mb-5">
                <div className="flex overflow-hidden rounded-2xl border border-slate-900 shadow-sm">
                  <div className="flex items-center border-r border-gray-200 bg-gray-100 px-4 text-sm font-semibold text-gray-600">
                    All
                  </div>
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by brand ID, part number, or product"
                      className="w-full bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-white"
                    title="Search products"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {secondaryNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="block py-2 font-semibold text-gray-900 hover:text-blue-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link to="/account" onClick={() => setIsOpen(false)}>
                    <motion.div
                      className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-3 font-medium text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <User size={18} />
                      Profile
                    </motion.div>
                  </Link>
                  <Link to="/account#orders" onClick={() => setIsOpen(false)}>
                    <motion.div
                      className="flex items-center gap-2 py-2 font-medium text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Package size={18} />
                      Orders
                    </motion.div>
                  </Link>
                  <button
                    type="button"
                    title="Log out"
                    className="flex w-full items-center gap-2 py-2 font-medium text-red-600"
                    onClick={() => {
                      handleLogout()
                    }}
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <motion.div
                    className="mt-2 flex w-full items-center gap-2 border-t border-gray-100 pt-3 font-medium text-gray-700 hover:text-blue-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <User size={18} />
                    Sign In
                  </motion.div>
                </Link>
              )}

              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                {...a11yAction(
                  getCartCount() > 0
                    ? `Shopping cart, ${getCartCount()} items`
                    : 'Shopping cart'
                )}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-medium text-white motion-safe:active:scale-95"
              >
                <ShoppingCart size={18} aria-hidden />
                Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
