import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, ChevronDown, LogOut, Package, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { a11yAction } from '../lib/controlHints'
import { mainCategories, getSubcategoriesForMainCategory } from '../data/categories'

const Navbar = () => {
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openDesktopMenu, setOpenDesktopMenu] = useState(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
      if (!event.target.closest('[data-desktop-nav]')) {
        setOpenDesktopMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async (event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    await logout()
    setUserMenuOpen(false)
    setIsOpen(false)
    navigate('/', { replace: true })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  const navigationGroups = mainCategories.map((category) => ({
    ...category,
    href: `/category/${category.slug}`,
    subcategories: getSubcategoriesForMainCategory(category.slug)
  }))

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 ${
        scrolled ? 'bg-white/96 backdrop-blur-md' : 'bg-white'
      }`}
    >
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center gap-4 py-3">
            <div className="shrink-0">
              <Logo size="small" className="gap-2" splitNavigation />
            </div>

            <div className="hidden items-center gap-9 lg:flex">
              {navigationGroups.map((group) => (
                <div
                  key={group.slug}
                  className="relative"
                  data-desktop-nav
                  onMouseEnter={() => setOpenDesktopMenu(group.slug)}
                  onMouseLeave={() => setOpenDesktopMenu(null)}
                >
                  <Link
                    to={group.href}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-slate-950"
                  >
                    {group.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openDesktopMenu === group.slug ? 'rotate-180' : ''}`}
                    />
                  </Link>

                  {openDesktopMenu === group.slug && (
                    <div className="absolute left-0 top-full w-72 pt-3">
                      <div className="border border-slate-200 bg-white p-3 text-slate-900">
                        <Link
                          to={group.href}
                          className="mb-2 block px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50"
                        >
                          {group.name}
                        </Link>
                        {group.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.slug}
                            to={`/products/${subcategory.slug}`}
                            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link to="/products" className="text-sm font-medium text-[#ef4444] hover:text-[#dc2626]">
                Sale
              </Link>
            </div>

            <div className="ml-4 hidden min-w-0 flex-1 justify-end md:flex xl:ml-10">
              <form onSubmit={handleSearchSubmit} className="w-full max-w-xs xl:max-w-sm">
                <div className="flex border border-slate-300 focus-within:border-slate-950">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by SKU..."
                      className="w-full bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex min-w-[64px] items-center justify-center bg-slate-950 text-white hover:bg-slate-800"
                      title="Search by SKU"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <div className="relative hidden md:block" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((value) => !value)}
                      className="flex items-center gap-2 px-2 py-2 font-medium text-slate-900 hover:bg-slate-100"
                      aria-expanded={userMenuOpen}
                    >
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                      <span className="hidden lg:inline">Account</span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <div className="absolute right-0 z-[60] mt-2 w-52 border border-slate-200 bg-white py-1">
                          <Link
                            to="/account"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={16} className="text-slate-500" />
                            Profile
                          </Link>
                          <Link
                            to="/account#orders"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Package size={16} className="text-slate-500" />
                            Orders
                          </Link>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                            title="Log out"
                          >
                            <LogOut size={16} />
                            Log out
                          </button>
                        </div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link to="/login" className="rounded-xl px-2 py-2 text-slate-900 transition hover:bg-slate-100" {...a11yAction('Sign in')}>
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <User size={16} aria-hidden />
                      Account
                    </span>
                  </Link>
                )}
              </div>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="rounded-xl p-3 text-slate-900 transition hover:bg-slate-100 md:hidden"
                {...a11yAction(isAuthenticated ? 'Open account' : 'Sign in')}
              >
                <User size={20} aria-hidden />
              </Link>

              <Link
                to="/cart"
                {...a11yAction(
                  getCartCount() > 0 ? `Shopping cart, ${getCartCount()} items` : 'Shopping cart'
                )}
                className="relative hidden rounded-xl px-2 py-2 text-slate-900 transition hover:bg-slate-100 md:flex md:items-center md:gap-2"
              >
                <ShoppingCart size={18} aria-hidden />
                <span className="text-sm font-medium">Cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                {...a11yAction(
                  getCartCount() > 0 ? `Shopping cart, ${getCartCount()} items` : 'Shopping cart'
                )}
                className="relative rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3 text-white shadow-sm transition hover:shadow-md md:hidden"
              >
                <ShoppingCart size={20} aria-hidden />
                {getCartCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="p-3 text-slate-900 hover:bg-slate-100 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-menu"
                {...a11yAction(isOpen ? 'Close navigation menu' : 'Open navigation menu')}
              >
                {isOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div
            id="mobile-navigation-menu"
            className="border-b border-slate-200 bg-white md:hidden"
          >
            <div className="space-y-5 px-4 py-5">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex overflow-hidden rounded-2xl border border-slate-900 shadow-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by SKU"
                      className="w-full bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-white"
                    title="Search by SKU"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {navigationGroups.map((group) => (
                <div key={group.slug} className="rounded-2xl border border-slate-200 p-4">
                  <Link
                    to={group.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-semibold text-slate-950"
                  >
                    {group.name}
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        to={`/products/${subcategory.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {isAuthenticated ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    to="/account#orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700"
                  >
                    <Package size={18} />
                    Orders
                  </Link>
                  <button
                    type="button"
                    className="flex items-center gap-2 py-2 text-sm font-medium text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
