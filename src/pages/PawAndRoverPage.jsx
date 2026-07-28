import { Bone, Cat, Dog, PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'

const petCategories = [
  { label: 'Dog essentials', icon: Dog },
  { label: 'Cat essentials', icon: Cat },
  { label: 'Toys and accessories', icon: Bone }
]

const PawAndRoverPage = () => (
  <div className="min-h-screen bg-slate-50 pb-20 pt-32 md:pt-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Paw and Rover
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Pet products
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Everyday essentials, accessories, and travel-ready products for pets and their people.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <PawPrint size={22} aria-hidden />
            </span>
            <h2 className="text-xl font-bold text-slate-950">Coming categories</h2>
          </div>

          <div className="space-y-3">
            {petCategories.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <Icon size={18} className="text-blue-600" aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-8 flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-2xl font-bold text-slate-950">0 products</p>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Paw and Rover
            </span>
          </div>

          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
            <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <PawPrint size={38} aria-hidden />
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">Products coming soon</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
              The Paw and Rover collection is being prepared and will appear here as pet inventory is published.
            </p>
            <Link to="/" className="mt-8 font-semibold text-blue-600 underline transition hover:text-blue-800">
              Back to Ride
            </Link>
          </div>
        </section>
      </div>
    </div>
  </div>
)

export default PawAndRoverPage
