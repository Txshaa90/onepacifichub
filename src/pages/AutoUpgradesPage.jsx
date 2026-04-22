import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'

const AutoUpgradesPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const categories = [
    {
      title: 'Wheel Covers',
      eyebrow: 'Main Category',
      description: 'Transform your vehicle with premium wheel covers built to refresh your look and improve curb appeal. Explore hub caps, wheel skins, wheel simulators, center caps, and trim rings in one place.',
      image: '/images/Wheel Covers.jpg',
      link: '/category/wheel-covers'
    },
    {
      title: 'Restyling Accessories',
      eyebrow: 'Main Category',
      description: 'Upgrade your vehicle\'s exterior with restyling accessories that sharpen its appearance and finish. Browse mirror covers, door handle covers, grille inserts, and other styling parts.',
      image: '/images/Restyling accessories.jpg',
      link: '/category/restyling-accessories'
    },
    {
      title: 'Off Road Gears and Accessories',
      eyebrow: 'Explore More',
      description: 'Prepare for your next adventure with off-road gear and accessories built for tougher roads, utility, and visual upgrades that support your next setup.',
      image: '/images/Off Road Gears and Accessories.jpg',
      link: '/products'
    },
    {
      title: 'Floor Mats and Car Covers',
      eyebrow: 'Explore More',
      description: 'Discover protective essentials like floor mats and car covers that help keep your vehicle clean, protected, and ready for daily use.',
      image: '/images/Floor Mats and Car Covers.jpg',
      link: '/products'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-36 md:pt-44">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <Breadcrumb items={[{ label: 'Auto Upgrades', href: null }]} />
      </div>

      {/* Hero Section */}
      <section className="relative py-12 md:py-14 bg-gradient-to-br from-blue-600 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Auto Upgrades
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Vehicle Enhancement Solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section ref={ref} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.title}
                to={category.link}
                state={{
                  parentBreadcrumb: { label: 'Auto Upgrades', href: '/auto-upgrades' },
                  backLink: { label: 'Back to Auto Upgrades', href: '/auto-upgrades' }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-56 md:h-60 rounded-3xl overflow-hidden mb-4 shadow-xl">
                    <motion.img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80 mb-2">
                        {category.eyebrow}
                      </p>
                      <h2 className="text-white text-2xl md:text-3xl font-bold">{category.title}</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-gray-600 text-[15px] md:text-base leading-relaxed group-hover:text-blue-600 transition-colors">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                      Explore {category.title}
                      <span>→</span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Adventure Awaits
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-yellow-400 text-yellow-400" size={24} />
              ))}
            </div>
            
            <p className="text-gray-700 text-xl md:text-2xl mb-8 italic leading-relaxed">
              "I upgraded my car with 1pacifichub's accessories, and the quality is outstanding! My ride feels brand new, ready for any adventure. Highly recommend!"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                J
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">John Anderson</p>
                <p className="text-gray-600">Auto Enthusiast</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Upgrade Your Ride
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Discover premium DIY auto upgrades and restyling accessories to enhance your vehicle and elevate your driving experience today.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AutoUpgradesPage
