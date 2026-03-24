import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, ChevronDown, LogOut, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { getCartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    setIsOpen(false)
  }

  const navItems = [
    { name: 'Hub caps', href: '/products/hubcaps' },
    { name: 'Wheelskins', href: '/products/wheelskins' },
    { name: 'Wheel Simulator', href: '/products/wheel-simulator' },
    { name: 'Trim Rings', href: '/products/trim-rings' },
    { name: 'Shop by Category', href: '/products' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="small" />
          </Link>

          {/* Desktop: nav links + account cluster (extra space between) */}
          <div className="hidden md:flex items-center flex-1 min-w-0 justify-end gap-6 lg:gap-10">
            <div className="flex items-center flex-wrap justify-end gap-x-5 gap-y-2 lg:gap-x-7">
              {navItems.map((item, index) => (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    className="font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0 pl-4 lg:pl-6 border-l border-gray-200/90">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full font-bold text-gray-900 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <User size={18} />
                    )}
                    <span className="hidden sm:inline max-w-[120px] truncate">
                      {user?.firstName || user?.email?.split('@')[0] || 'Account'}
                    </span>
                    <span className="sm:hidden">Account</span>
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
                        className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-gray-100 py-1 z-[60] overflow-hidden"
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
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100"
                          onClick={handleLogout}
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
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-gray-900 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User size={18} />
                    Sign In
                  </motion.div>
                </Link>
              )}

              <Link to="/cart">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition-shadow flex items-center gap-2 relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={18} />
                  Cart
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden text-gray-900 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-6 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="block text-gray-900 hover:text-blue-600 font-semibold py-2"
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
                      className="flex items-center gap-2 text-gray-700 font-medium py-2 border-t border-gray-100 mt-2 pt-3"
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
                      className="flex items-center gap-2 text-gray-700 font-medium py-2"
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
                    className="flex w-full items-center gap-2 text-red-600 font-medium py-2"
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
                    className="flex w-full items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2 border-t border-gray-100 mt-2 pt-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <User size={18} />
                    Sign In
                  </motion.div>
                </Link>
              )}

              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <motion.button
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={18} />
                  Cart
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
