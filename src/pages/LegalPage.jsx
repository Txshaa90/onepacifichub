import { useLayoutEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    body: (
      <>
        <p>
          OnePacificHub respects your privacy. This policy describes how we collect and use
          information when you browse or purchase from our store.
        </p>
        <p>
          We use trusted services (including Supabase for accounts and Shopify for checkout) to process
          orders and protect your data. We do not sell your personal information.
        </p>
        <p>
          For questions, contact{' '}
          <a href="mailto:info@onepacifichub.com" className="text-blue-600 hover:underline">
            info@onepacifichub.com
          </a>
          .
        </p>
      </>
    )
  },
  terms: {
    title: 'Terms & Conditions',
    body: (
      <>
        <p>
          By using onepacifichub.com you agree to these terms. Product availability, pricing, and
          shipping estimates may change without notice.
        </p>
        <p>
          You are responsible for providing accurate shipping and contact information. We reserve the
          right to refuse or cancel orders when necessary.
        </p>
        <p>
          For support, contact{' '}
          <a href="mailto:info@onepacifichub.com" className="text-blue-600 hover:underline">
            info@onepacifichub.com
          </a>
          .
        </p>
      </>
    )
  },
  'refund-policy': {
    title: 'Refund Policy',
    body: (
      <>
        <p>
          We want you to be satisfied with your purchase. If something arrives damaged or incorrect,
          contact us within a reasonable time with your order details and photos if applicable.
        </p>
        <p>
          Refunds or replacements are handled according to the nature of the issue and product type.
          Shipping costs may apply unless the error was ours.
        </p>
        <p>
          Reach us at{' '}
          <a href="mailto:info@onepacifichub.com" className="text-blue-600 hover:underline">
            info@onepacifichub.com
          </a>{' '}
          or call +1 (213) 268-8273 during support hours.
        </p>
      </>
    )
  }
}

const LegalPage = () => {
  const { slug } = useParams()
  const page = LEGAL[slug]

  // From footer (often at bottom of page): always start at top so the legal doc is visible.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!page) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to home
        </Link>
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>
          <div className="space-y-4 text-gray-700 leading-relaxed">{page.body}</div>
        </motion.article>
      </div>
    </div>
  )
}

export default LegalPage
