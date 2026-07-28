import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
const logoImage = '/images/Icon.png'

const Logo = ({
  className = '',
  size = 'default',
  variant = 'default',
  showWordmark = true,
  splitNavigation = false
}) => {
  const sizes = {
    small: { height: 'h-12', fontSize: 'text-lg' },
    default: { height: 'h-16', fontSize: 'text-xl' },
    large: { height: 'h-20', fontSize: 'text-2xl' }
  }

  const currentSize = sizes[size] || sizes.default
  const textClass = variant === 'dark' ? 'text-white' : 'text-gray-900'

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      {splitNavigation ? (
        <Link to="/" aria-label="Ride automotive homepage">
          <img
            src={logoImage}
            alt="Ride and Rover logo"
            className={`${currentSize.height} w-auto object-contain`}
          />
        </Link>
      ) : (
        <img
          src={logoImage}
          alt="Ride and Rover logo"
          className={`${currentSize.height} w-auto object-contain`}
        />
      )}
      {showWordmark && (
        splitNavigation ? (
          <span className={`inline-flex items-baseline font-bold tracking-tight ${textClass} ${currentSize.fontSize}`}>
            <Link to="/" className="transition hover:text-blue-600" aria-label="Ride automotive homepage">
              Ride
            </Link>
            <span className="mx-1 font-medium">and</span>
            <Link to="/paw-and-rover" className="transition hover:text-blue-600" aria-label="Paw and Rover pet products">
              Rover
            </Link>
          </span>
        ) : (
          <span className={`font-bold tracking-tight ${textClass} ${currentSize.fontSize}`}>Ride and Rover</span>
        )
      )}
    </motion.div>
  )
}

export default Logo
