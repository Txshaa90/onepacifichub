import { useState } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Mail, Phone, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)
  const [newsletterSending, setNewsletterSending] = useState(false)

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email.' })
      return
    }
    setNewsletterSending(true)
    setNewsletterStatus(null)
    window.setTimeout(() => {
      setNewsletterSending(false)
      setNewsletterStatus({ type: 'ok', message: "Thanks — you're on the list." })
      setEmail('')
    }, 600)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const headingClass = 'text-white font-semibold mb-4'
  const linkClass = 'footer-link text-gray-400 inline-block'

  return (
    <footer className="bg-[#0b1a2b] text-gray-300 px-6 md:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          <motion.div
            className="md:col-span-1 sm:col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <Logo size="small" variant="dark" />
            <p className="text-sm mb-6 mt-4 leading-relaxed text-gray-400">
              Premium hubcaps, wheel skins, and auto accessories — quality parts with fast shipping.
            </p>

            <h4 className={`${headingClass} text-xs tracking-wide uppercase`}>Stay in the loop</h4>

            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 mb-6">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email for newsletter
              </label>
              <input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="bg-[#16263d] px-3 py-2.5 rounded-md w-full text-sm text-gray-200 placeholder:text-gray-500 outline-none border border-transparent focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
              />
              <button
                type="submit"
                disabled={newsletterSending}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 rounded-md text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2 shrink-0"
              >
                {newsletterSending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Subscribe
              </button>
            </form>
            {newsletterStatus?.type === 'ok' && (
              <p className="mb-4 text-sm text-green-400">{newsletterStatus.message}</p>
            )}
            {newsletterStatus?.type === 'error' && (
              <p className="mb-4 text-sm text-red-400">{newsletterStatus.message}</p>
            )}

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/onepacifichub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#16263d] flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/onepacifichub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#16263d] flex items-center justify-center text-gray-300 hover:text-white hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <h4 className={headingClass}>Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products/hubcaps" className={linkClass}>
                  Hub caps
                </Link>
              </li>
              <li>
                <Link to="/products/wheelskins" className={linkClass}>
                  Wheelskins
                </Link>
              </li>
              <li>
                <a
                  href="https://onepacifichub.com/collections/wheel-simulators"
                  className={linkClass}
                >
                  Wheel Simulator
                </a>
              </li>
              <li>
                <Link to="/products/trim-rings" className={linkClass}>
                  Trim Rings
                </Link>
              </li>
              <li>
                <Link to="/products" className={linkClass}>
                  Shop by Category
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <h4 className={headingClass}>Customer service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help#support" className={linkClass}>
                  Email support
                </Link>
              </li>
              <li>
                <Link to="/help#delivery" className={linkClass}>
                  Delivery
                </Link>
              </li>
              <li>
                <Link to="/help#returns" className={linkClass}>
                  Returns & refunds
                </Link>
              </li>
            </ul>

            <h4 className={`${headingClass} mt-6`}>Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className={linkClass}>
                  Refund Policy
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <h4 className={headingClass}>Account</h4>
            {!isAuthenticated ? (
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className={linkClass}>
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={linkClass}>
                    Create account
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Link to="/account" className={linkClass}>
                    My account
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={linkClass}>
                    Orders
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${linkClass} text-left bg-transparent border-0 p-0 font-inherit cursor-pointer`}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <h4 className={headingClass}>Contact</h4>
            <p className="text-sm mb-2 font-semibold text-gray-200">Support hours</p>
            <p className="text-sm mb-4 text-gray-400">Mon–Fri, 9am–6pm (Pacific)</p>

            <a
              href="mailto:info@onepacifichub.com"
              className={`${linkClass} inline-flex items-center gap-2 mb-3`}
            >
              <Mail size={16} className="text-cyan-400 shrink-0" />
              info@onepacifichub.com
            </a>

            <a href="tel:+12132688273" className={`${linkClass} inline-flex items-start gap-2`}>
              <Phone size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <span>
                US: +1 (213) 268-8273
                <span className="block text-xs mt-1 text-gray-500">Voicemail & callbacks</span>
              </span>
            </a>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} OnePacificHub. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="footer-link text-gray-400">
              Privacy
            </Link>
            <Link to="/terms" className="footer-link text-gray-400">
              Terms
            </Link>
            <Link to="/refund-policy" className="footer-link text-gray-400">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
