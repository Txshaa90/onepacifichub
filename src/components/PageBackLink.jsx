import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const PageBackLink = ({ to = '/', label = 'Back to home', className = '' }) => {
  return (
    <Link
      to={to}
      className={`mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 ${className}`}
    >
      <ArrowLeft size={18} />
      {label}
    </Link>
  )
}

export default PageBackLink
