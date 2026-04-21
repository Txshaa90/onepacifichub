import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CarFront } from 'lucide-react'

const brands = [
  { name: 'Cadillac', logo: '/images/brands/Cadillac.png' },
  { name: 'Chevrolet', logo: '/images/brands/Chevrolet.png' },
  { name: 'Chrysler', logo: '/images/brands/Chrysler.png' },
  { name: 'Dodge', logo: '/images/brands/Dodge.png' },
  { name: 'Ford', logo: '/images/brands/Ford.png' },
  { name: 'GMC', logo: '/images/brands/GMC.png' },
  { name: 'Honda', logo: '/images/brands/Honda.png' },
  { name: 'Hyundai', logo: '/images/brands/Hyundai.png' },
  { name: 'Jeep', logo: '/images/brands/Jeep.png' },
  { name: 'Kia', logo: '/images/brands/kia.png' },
  { name: 'Mazda', logo: '/images/brands/Mazda.png' },
  { name: 'Nissan', logo: '/images/brands/Nissan.png' },
  { name: 'Ram', logo: '/images/brands/Ram.png' },
  { name: 'Saturn', logo: '/images/brands/Saturn.png' },
  { name: 'Subaru', logo: '/images/brands/Subaru.png' },
  { name: 'Toyota', logo: '/images/brands/Toyota.png' }
]

const firstRow = brands.slice(0, 8)
const secondRow = brands.slice(8)

const BrandCard = ({ brand, index, compact = false }) => {
  const initials = brand.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className={`group flex items-center justify-center rounded-3xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:shadow-[0_16px_40px_rgba(37,99,235,0.10)] ${
        compact
          ? 'min-w-[220px] px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]'
          : 'min-h-[112px] px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white">
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-10 max-w-[112px] object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
              const fallback = event.currentTarget.nextElementSibling
              if (fallback) {
                fallback.classList.remove('hidden')
                fallback.classList.add('flex')
              }
            }}
          />
          <div className="hidden relative h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
            <CarFront size={22} className="absolute opacity-20" />
            <span className="relative text-sm font-bold tracking-[0.22em]">{initials}</span>
          </div>
        </div>
        <span className="text-lg font-semibold tracking-tight text-slate-900">{brand.name}</span>
      </div>
    </motion.div>
  )
}

const BrandShowcase = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">Shop by Brands</p>
          </div>

          <Link
            to="/products"
            className="text-lg font-medium text-cyan-500 transition hover:text-blue-600"
          >
            See All
          </Link>
        </motion.div>

        <div className="space-y-5 overflow-hidden">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
            <div className="brand-marquee flex gap-5">
              {[...firstRow, ...firstRow].map((brand, index) => (
                <BrandCard key={`top-${brand.name}-${index}`} brand={brand} index={index} compact />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
            <div className="brand-marquee brand-marquee-reverse flex gap-5">
              {[...secondRow, ...secondRow].map((brand, index) => (
                <BrandCard key={`bottom-${brand.name}-${index}`} brand={brand} index={index} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandShowcase
