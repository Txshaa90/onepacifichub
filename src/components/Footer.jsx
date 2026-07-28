import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const footerLink = 'text-sm text-slate-400 transition hover:text-white'

  return (
    <footer className="bg-slate-950 px-6 py-12 text-slate-300 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-md">
            <Logo size="small" variant="dark" />
            <p className="mt-4 text-sm leading-7 text-slate-400">
              OnePacificHub is focused on wheel covers and styling accessories, with a cleaner headless shopping flow built for launch.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/onepacifichub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/onepacifichub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/category/wheel-covers" className={footerLink}>Wheel Covers</Link></li>
              <li><Link to="/category/restyling-accessories" className={footerLink}>Styling Accessories</Link></li>
              <li><Link to="/products/hubcaps" className={footerLink}>Hubcaps</Link></li>
              <li><Link to="/products/wheelskins" className={footerLink}>Wheel Skins</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className={footerLink}>Contact us</Link></li>
              <li><Link to="/shipping" className={footerLink}>Shipping info</Link></li>
              <li><Link to="/returns" className={footerLink}>Returns & refunds</Link></li>
              <li><Link to="/order-tracking" className={footerLink}>Order tracking</Link></li>
              <li><Link to="/faq" className={footerLink}>FAQ</Link></li>
              <li><Link to="/privacy-policy" className={footerLink}>Privacy policy</Link></li>
              <li><Link to="/terms" className={footerLink}>Terms and conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Account</h4>
            <ul className="space-y-3">
              {!isAuthenticated ? (
                <>
                  <li><Link to="/login" className={footerLink}>Sign in</Link></li>
                  <li><Link to="/register" className={footerLink}>Create account</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/account" className={footerLink}>My account</Link></li>
                  <li><Link to="/orders" className={footerLink}>Orders</Link></li>
                  <li>
                    <button type="button" onClick={handleLogout} className={`${footerLink} bg-transparent p-0 text-left`}>
                      Log out
                    </button>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <a href="mailto:info@onepacifichub.com" className="flex items-center gap-2 transition hover:text-white">
                <Mail size={16} className="text-cyan-300" />
                info@onepacifichub.com
              </a>
              <a href="tel:+12132688273" className="flex items-center gap-2 transition hover:text-white">
                <Phone size={16} className="text-cyan-300" />
                +1 (213) 268-8273
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} OnePacificHub. All rights reserved.</p>
          <p>Current launch pricing is using Walmart selling price as the working benchmark.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
