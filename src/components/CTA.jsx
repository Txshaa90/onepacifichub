import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Next Step
        </p>
        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Keep the launch shopping flow focused.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Browse wheel covers and styling accessories through the updated category-first storefront.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex items-center justify-center border border-white bg-white px-8 py-4 text-base font-semibold text-slate-950 hover:bg-slate-100"
          >
            Browse the Catalog
          </Link>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center border border-white px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-slate-950"
          >
            Review Cart
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA
