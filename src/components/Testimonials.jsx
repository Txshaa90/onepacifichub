import { Star } from 'lucide-react'

const reviews = [
  {
    text: 'The fitment-first search made it much easier to narrow down the right wheel cover for my Camry.',
    author: 'Anthony P.',
    role: 'Toyota Camry owner',
    image: '/images/Person 1.jpeg'
  },
  {
    text: 'The product page answered the key questions right away, and adding to cart felt a lot smoother.',
    author: 'Melissa R.',
    role: 'Shopper reviewing styling accessories',
    image: '/images/Person 2.jpeg'
  },
  {
    text: 'I like that the site now focuses on the main categories instead of making me dig through extra menus.',
    author: 'Jordan T.',
    role: 'Returning wheel cover customer',
    image: '/images/Person 1.jpeg'
  }
]

const Testimonials = () => {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Customer Reviews
          </p>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            What customers are saying
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Simple feedback from shoppers who found the right parts faster.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.author}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.2)] backdrop-blur"
            >
              <div className="mb-5 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={18} className="fill-current" />
                ))}
              </div>
              <p className="text-lg leading-8 text-slate-100">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.author}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-sm text-slate-400">{review.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
