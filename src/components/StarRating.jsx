import { Star } from 'lucide-react'

const StarRating = ({ rating = 4.5, reviews = 0, size = 16, showReviews = true }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="fill-amber-500 text-amber-500"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={size} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={size} className="fill-amber-500 text-amber-500" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300"
          />
        ))}
      </div>
      {showReviews && (
        <span className="text-sm text-slate-800">
          {rating.toFixed(1)} ({reviews} reviews)
        </span>
      )}
    </div>
  )
}

export default StarRating
