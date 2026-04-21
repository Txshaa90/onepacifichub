import { useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Package, RotateCcw, ArrowLeft } from 'lucide-react'

/** Fixed nav offset + retries so footer hash links land in view (not under navbar / after motion). */
function getNavOffset() {
  const nav = document.querySelector('nav')
  return (nav?.getBoundingClientRect().height ?? 80) + 16
}

function scrollToSectionId(id) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'auto' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const offset = getNavOffset()
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

const HelpPage = () => {
  const location = useLocation()
  const timersRef = useRef([])

  useLayoutEffect(() => {
    const id = location.hash.replace(/^#/, '')

    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    const schedule = (fn, ms) => {
      const t = window.setTimeout(fn, ms)
      timersRef.current.push(t)
    }

    // Run multiple times: after first paint, after layout, after Framer Motion settles
    scrollToSectionId(id)
    schedule(() => scrollToSectionId(id), 0)
    schedule(() => scrollToSectionId(id), 100)
    schedule(() => scrollToSectionId(id), 450)

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [location.pathname, location.hash])

  const hasHash = Boolean(location.hash.replace(/^#/, ''))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 sm:px-6 md:px-16 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={hasHash ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Help Center</h1>

          <section id="support" className="mb-12 [scroll-margin-top:7rem]">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="text-blue-600" size={22} aria-hidden />
              <h2 className="text-xl font-semibold text-gray-900">Email support</h2>
            </div>
            <p className="text-gray-600 mb-3">
              Need help with your order or product? Our support team is here to assist you.
            </p>
            <a
              href="mailto:info@onepacifichub.com"
              className="text-blue-600 font-medium hover:underline"
            >
              info@onepacifichub.com
            </a>
            <p className="text-sm text-gray-500 mt-3">Mon–Fri, 9am–6pm (Pacific)</p>
          </section>

          <section id="delivery" className="mb-12 [scroll-margin-top:7rem]">
            <div className="flex items-center gap-2 mb-3">
              <Package className="text-blue-600" size={22} aria-hidden />
              <h2 className="text-xl font-semibold text-gray-900">Delivery information</h2>
            </div>
            <p className="text-gray-600 mb-2">Orders are processed within 1–2 business days.</p>
            <p className="text-gray-600 mb-2">
              Shipping typically takes 3–7 business days depending on your location.
            </p>
            <p className="text-gray-600">
              You will receive a tracking number once your order has shipped.
            </p>
          </section>

          <section id="returns" className="mb-4 [scroll-margin-top:7rem]">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw className="text-blue-600" size={22} aria-hidden />
              <h2 className="text-xl font-semibold text-gray-900">Returns & refunds</h2>
            </div>
            <p className="text-gray-600 mb-2">
              We offer a 30-day return policy for unused items in original packaging.
            </p>
            <p className="text-gray-600 mb-2">
              To request a return, please contact us via email with your order number.
            </p>
            <p className="text-gray-600 mb-4">
              Refunds are processed within 5–7 business days after inspection.
            </p>
            <Link
              to="/legal/refund-policy"
              className="text-blue-600 font-medium hover:underline text-sm"
            >
              Read full refund policy →
            </Link>
          </section>
        </motion.div>
      </div>
    </div>
  )
}

export default HelpPage
