import { motion } from 'framer-motion'
import logoImage from '../../OPH/Logo.png'

const Logo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: { height: "h-12", fontSize: "text-xl" },
    default: { height: "h-16", fontSize: "text-2xl" },
    large: { height: "h-20", fontSize: "text-3xl" }
  }

  const currentSize = sizes[size] || sizes.default

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
      <span className={`font-bold text-gray-900 ${currentSize.fontSize}`}>
        onepacifichub
      </span>
    </motion.div>
  )
}

export default Logo
