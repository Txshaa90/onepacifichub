import { motion } from 'framer-motion'
import logoImage from '../../OPH/Logo.png'

const Logo = ({ className = '', size = 'default', variant = 'default', showWordmark = true }) => {
  const sizes = {
    small: { height: 'h-12', fontSize: 'text-xl' },
    default: { height: 'h-16', fontSize: 'text-2xl' },
    large: { height: 'h-20', fontSize: 'text-3xl' }
  }

  const currentSize = sizes[size] || sizes.default
  const textClass = variant === 'dark' ? 'text-white' : 'text-gray-900'

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <img
        src={logoImage}
        alt="OnePacificHub Logo"
        className={`${currentSize.height} w-auto object-contain`}
      />
      {showWordmark && (
        <span className={`font-bold ${textClass} ${currentSize.fontSize}`}>onepacifichub</span>
      )}
    </motion.div>
  )
}

export default Logo
