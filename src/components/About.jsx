import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const shopSections = [
    {
      title: 'DIY Auto Upgrades',
      description: 'Browse the complete upgrade section for wheel covers, restyling accessories, off-road gear, and other curated vehicle enhancement collections.',
      image: '/images/Explore our premium DIY auto upgrades to enhance your vehicle for every journey ahead..jpeg',
      link: '/auto-upgrades',
      cta: 'Browse Collections'
    },
    {
      title: 'Fishing Gear',
      description: 'Discover top-quality fishing gear designed to help you catch more on your next trip.',
      image: '/images/Discover top-quality fishing gear designed to help you catch more on your next trip..jpg',
      link: '/products',
      cta: 'Explore Gear'
    },
    {
      title: 'Travel Essentials',
      description: 'Find essential travel gear for road trips, camping, and outdoor adventures to pack smart.',
      image: '/images/Find essential travel gear for road trips, camping, and outdoor adventures to pack smart..jpg',
      link: '/products',
      cta: 'Explore Travel'
    }
  ]

  return (
    <section id="upgrade-your-ride" ref={ref} className="py-24 bg-gradient-to-br from-blue-500 to-blue-600 scroll-mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Upgrade Your Ride
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Enter the store through the sections that matter most: category-led shopping, clear calls to action, and faster paths to products.
          </motion.p>

        </motion.div>

        <div id="upgrade-product-cards" className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 scroll-mt-32">
          {shopSections.map((section, index) => (
            <Link
              key={section.title}
              to={section.link}
              className="block h-full"
              id={
                section.title === 'DIY Auto Upgrades'
                  ? 'upgrade-diy-auto-upgrades'
                  : section.title === 'Fishing Gear'
                    ? 'upgrade-fishing-gear'
                    : section.title === 'Travel Essentials'
                      ? 'upgrade-travel-essentials'
                      : undefined
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.25 } }}
                className="group cursor-pointer h-full"
              >
                <div className="relative h-[22rem] rounded-3xl overflow-hidden mb-4 shadow-xl">
                  <motion.img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.35 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/45" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-white text-3xl font-bold leading-tight">{section.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 opacity-100 transition group-hover:bg-white">
                      {section.cta}
                      <span>→</span>
                    </span>
                  </div>
                </div>

                <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors">
                  {section.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
