import { Link } from 'react-router-dom'

const Hero = () => {
  const scrollToSelector = () => {
    const section = document.getElementById('fitment-selector')
    if (section) {
      section.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }

  return (
    <section className="relative overflow-hidden bg-white pt-[76px]">
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
            <img
              src="/images/Banner - Ride and Rover-1.jpg"
              alt="Vehicle accessories showcase"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.78)_0%,rgba(2,6,23,0.48)_45%,rgba(2,6,23,0.18)_100%)]" />

            <div className="relative z-10 mx-auto flex min-h-[420px] max-w-7xl items-center px-6 py-10 sm:px-8 md:min-h-[520px] lg:px-12">
              <div className="max-w-2xl text-white">
                <h1 className="max-w-3xl text-5xl font-semibold leading-none md:text-6xl">
                  Wheel Covers and Styling Accessories
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-[1.65rem] md:leading-9">
                  Shop direct-fit wheel covers and clean styling upgrades for your vehicle.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={scrollToSelector}
                    className="inline-flex min-w-[260px] items-center justify-center border border-white bg-white px-8 py-5 text-[1.05rem] font-semibold text-slate-950 hover:bg-slate-100"
                  >
                    Find Parts for Your Vehicle
                  </button>
                  <Link
                    to="/category/restyling-accessories"
                    className="inline-flex min-w-[260px] items-center justify-center border border-white px-8 py-5 text-[1.05rem] font-semibold text-white hover:bg-white hover:text-slate-950"
                  >
                    Shop Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
