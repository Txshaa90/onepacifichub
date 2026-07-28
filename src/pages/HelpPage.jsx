import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  RotateCcw,
  Search,
  Truck,
} from 'lucide-react'

const supportPages = [
  {
    id: 'shipping',
    label: 'Shipping',
    path: '/shipping',
    icon: Truck,
    title: 'Shipping Info',
    description: 'Clear delivery options, timing, and shipping expectations before checkout.',
  },
  {
    id: 'returns',
    label: 'Returns',
    path: '/returns',
    icon: RotateCcw,
    title: 'Return & Refund',
    description: 'A straightforward return process for eligible unused items.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    path: '/faq',
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Quick answers for orders, fitment, shipping, returns, and account questions.',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: Mail,
    title: 'Contact Us',
    description: 'Send a support request and our team will respond as soon as possible.',
  },
  {
    id: 'tracking',
    label: 'Order Tracking',
    path: '/order-tracking',
    icon: Package,
    title: 'Order Tracking',
    description: 'Check the latest order status using your order number and email address.',
  },
]

const faqTopics = ['All', 'Orders', 'Shipping', 'Returns', 'Products']

const faqs = [
  {
    topic: 'Orders',
    question: 'Where can I find my order number?',
    answer: 'Your order number is included in the confirmation email sent after checkout.',
  },
  {
    topic: 'Shipping',
    question: 'How long does standard shipping take?',
    answer: 'Most orders ship within 1-2 business days and arrive in 3-7 business days.',
  },
  {
    topic: 'Shipping',
    question: 'Is expedited shipping available?',
    answer: 'Expedited options may be available at checkout depending on destination and item size.',
  },
  {
    topic: 'Returns',
    question: 'What items qualify for return?',
    answer: 'Unused items in original packaging can be reviewed for return within 30 days of delivery.',
  },
  {
    topic: 'Products',
    question: 'How do I confirm fitment?',
    answer: 'Review the product details and fitment notes, then contact support if you need a final check.',
  },
  {
    topic: 'Orders',
    question: 'Can I change an order after placing it?',
    answer: 'Contact support quickly with your order number. Changes depend on whether fulfillment has started.',
  },
]

function getCurrentPage(location, params) {
  if (params.topic) {
    return supportPages.find((page) => page.id === params.topic) || supportPages[0]
  }

  const pathMatch = supportPages.find((page) => location.pathname === page.path)
  if (pathMatch) return pathMatch

  const hash = location.hash.replace(/^#/, '')
  if (hash === 'delivery') return supportPages[0]
  if (hash === 'support') return supportPages.find((page) => page.id === 'contact')
  if (hash) {
    return supportPages.find((page) => page.id === hash) || supportPages[0]
  }

  return supportPages[0]
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
    {children}
  </label>
)

const textInputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'

function SupportSidebar({ currentPage }) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="border border-slate-200 bg-white p-3 shadow-sm">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Support
        </p>
        <nav className="space-y-1" aria-label="Support pages">
          {supportPages.map((page) => {
            const Icon = page.icon
            const active = currentPage.id === page.id
            return (
              <Link
                key={page.id}
                to={page.path}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                }`}
              >
                <Icon size={18} aria-hidden />
                {page.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

function SupportHero({ page }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <img
        src="/images/west motors.jpeg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-900/35" />
      <div className="relative px-6 py-12 sm:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
          OnePacificHub Support
        </p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">{page.description}</p>
      </div>
    </section>
  )
}

function ContactView() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input required type="text" className={textInputClass} placeholder="Your name" />
          </Field>
          <Field label="Email">
            <input required type="email" className={textInputClass} placeholder="you@example.com" />
          </Field>
        </div>
        <Field label="Phone number (optional)">
          <input type="tel" className={textInputClass} placeholder="+1 (555) 000-0000" />
        </Field>
        <Field label="Subject">
          <input required type="text" className={textInputClass} placeholder="Order, product, or account question" />
        </Field>
        <Field label="Message">
          <textarea
            required
            rows={7}
            className={textInputClass}
            placeholder="Tell us what you need help with."
          />
        </Field>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Mail size={18} />
          Send Message
        </button>
        {submitted && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Thanks. Your message is ready for the support team to review.
          </p>
        )}
      </form>

      <div className="space-y-4">
        <div className="border border-slate-200 bg-slate-50 p-5">
          <Mail className="mb-3 text-blue-600" size={22} />
          <h3 className="font-semibold text-slate-950">Email support</h3>
          <a href="mailto:info@onepacifichub.com" className="mt-2 block text-sm font-medium text-blue-700 hover:underline">
            info@onepacifichub.com
          </a>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-5">
          <MessageCircle className="mb-3 text-blue-600" size={22} />
          <h3 className="font-semibold text-slate-950">Live chat</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Live chat can be connected here when a chat provider is selected.
          </p>
        </div>
      </div>
    </div>
  )
}

function ShippingView() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[
        {
          title: 'Standard shipping',
          detail: 'Orders are processed within 1-2 business days. Delivery typically takes 3-7 business days after shipment.',
          note: 'Best for most wheel cover and restyling accessory orders.',
        },
        {
          title: 'Expedited shipping',
          detail: 'Faster delivery options may appear at checkout depending on product size, stock status, and destination.',
          note: 'Useful for time-sensitive replacements or vehicle prep.',
        },
      ].map((item) => (
        <section key={item.title} className="border border-slate-200 bg-white p-5">
          <Truck className="mb-4 text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
          <p className="mt-3 leading-7 text-slate-600">{item.detail}</p>
          <p className="mt-4 text-sm font-semibold text-slate-800">{item.note}</p>
        </section>
      ))}
      <section className="border border-slate-200 bg-slate-50 p-5 md:col-span-2">
        <h2 className="text-lg font-bold text-slate-950">Delivery updates</h2>
        <p className="mt-3 leading-7 text-slate-600">
          Once your order ships, a tracking number is sent to the email address used at checkout.
          Use the order tracking page to check the latest status.
        </p>
      </section>
    </div>
  )
}

function ReturnsView() {
  const steps = [
    'Review eligibility for unused items in original packaging within 30 days of delivery.',
    'Contact support with your order number, email, and reason for return.',
    'Wait for return instructions before sending the item back.',
    'After inspection, approved refunds are processed within 5-7 business days.',
  ]

  return (
    <div className="space-y-5">
      {steps.map((step, index) => (
        <div key={step} className="flex gap-4 border border-slate-200 bg-white p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {index + 1}
          </span>
          <p className="leading-7 text-slate-700">{step}</p>
        </div>
      ))}
      <div className="border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        Items with installation marks, missing packaging, or damage outside carrier handling may require additional review.
      </div>
    </div>
  )
}

function TrackingView() {
  const [status, setStatus] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus({
      label: 'In transit',
      message: 'Your order is moving through the carrier network. The next update will appear after the carrier scan.',
    })
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Order number">
          <input required type="text" className={textInputClass} placeholder="OPH-1000" />
        </Field>
        <Field label="Email">
          <input required type="email" className={textInputClass} placeholder="you@example.com" />
        </Field>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Search size={18} />
          View Status
        </button>
      </form>

      <section className="border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-slate-950">Status Information</h2>
        {status ? (
          <div className="mt-5">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={20} />
              <span className="font-bold">{status.label}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{status.message}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your order information to display the latest available status.
          </p>
        )}
      </section>
    </div>
  )
}

function FaqView() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('All')

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return faqs.filter((item) => {
      const matchesTopic = topic === 'All' || item.topic === topic
      const haystack = `${item.question} ${item.answer}`.toLowerCase()
      return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [query, topic])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`${textInputClass} pl-11`}
          placeholder="Search common questions"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {faqTopics.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTopic(item)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              topic === item
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {results.map((item) => (
          <details key={item.question} className="border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer text-base font-bold text-slate-950">
              {item.question}
            </summary>
            <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
        {results.length === 0 && (
          <p className="border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
            No FAQ results found. Try a broader search or contact support.
          </p>
        )}
      </div>
    </div>
  )
}

function SupportContent({ page }) {
  if (page.id === 'contact') return <ContactView />
  if (page.id === 'shipping') return <ShippingView />
  if (page.id === 'returns') return <ReturnsView />
  if (page.id === 'tracking') return <TrackingView />
  return <FaqView />
}

const HelpPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const currentPage = getCurrentPage(location, params)

  const handleMobileChange = (event) => {
    navigate(event.target.value)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 lg:hidden">
          <select
            value={currentPage.path}
            onChange={handleMobileChange}
            className={textInputClass}
            aria-label="Choose support page"
          >
            {supportPages.map((page) => (
              <option key={page.id} value={page.path}>
                {page.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <SupportSidebar currentPage={currentPage} />
          </div>

          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border border-slate-200 bg-white shadow-sm"
          >
            <SupportHero page={currentPage} />
            <div className="p-6 sm:p-8">
              <SupportContent page={currentPage} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
