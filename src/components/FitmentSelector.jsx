import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFitmentOptions } from '../data/catalog'
import { useAuth } from '../context/AuthContext'

const FitmentSelector = ({ compact = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [trim, setTrim] = useState('')
  const fitmentOptions = useMemo(
    () => getFitmentOptions(undefined, { year, make, model }),
    [make, model, year]
  )

  const models = make ? fitmentOptions.modelsByMake[make] || [] : []
  const trims = make && model ? fitmentOptions.trimsByMakeModel[`${make}::${model}`] || [] : []

  const handleSubmit = (event) => {
    event.preventDefault()

    const params = new URLSearchParams()
    if (year) params.set('year', year)
    if (make) params.set('make', make)
    if (model) params.set('model', model)
    if (trim) params.set('trim', trim)

    navigate(`/search?${params.toString()}`)
  }

  const shopSavedVehicle = (vehicle) => {
    const params = new URLSearchParams(vehicle)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <section
      id="fitment-selector"
      className={`${compact ? 'bg-white py-12 md:py-16' : 'bg-white py-16'} scroll-mt-40`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`border border-slate-200 ${
            compact
              ? 'bg-white p-6 md:p-8'
              : 'bg-slate-950 p-8 text-white md:p-10'
          }`}
        >
          <div className={`mb-6 flex flex-col gap-3 ${compact ? 'lg:flex-row lg:items-end lg:justify-between' : 'lg:flex-row lg:items-end lg:justify-between'}`}>
            <div className={compact ? 'max-w-2xl' : 'max-w-3xl'}>
              <h2 className={`font-bold tracking-tight ${compact ? 'text-2xl text-slate-950 md:text-3xl' : 'text-3xl text-white md:text-4xl'}`}>
                Find Your Parts
              </h2>
              <p className={`mt-2 ${compact ? 'text-sm text-slate-600 md:text-base' : 'text-base text-slate-300 md:text-lg'}`}>
                Find parts for your vehicle.
              </p>
            </div>
          </div>

          {user?.garage?.length ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className={`text-sm font-semibold ${compact ? 'text-slate-600' : 'text-slate-300'}`}>Your garage:</span>
              {user.garage.map((vehicle) => (
                <button
                  type="button"
                  key={`${vehicle.year}-${vehicle.make}-${vehicle.model}-${vehicle.trim}`}
                  onClick={() => shopSavedVehicle(vehicle)}
                  className={`${compact ? 'border-slate-300 bg-slate-50 text-slate-900 hover:border-blue-500' : 'border-slate-600 bg-slate-900 text-white hover:border-blue-400'} border px-3 py-2 text-sm font-semibold`}
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </button>
              ))}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            {[
              {
                label: 'Year',
                value: year,
                onChange: (event) => {
                  setYear(event.target.value)
                  setMake('')
                  setModel('')
                  setTrim('')
                },
                options: fitmentOptions.years,
                placeholder: 'Select Year',
                disabled: false
              },
              {
                label: 'Make',
                value: make,
                onChange: (event) => {
                  setMake(event.target.value)
                  setModel('')
                  setTrim('')
                },
                options: fitmentOptions.makes,
                placeholder: 'Select Make',
                disabled: false
              },
              {
                label: 'Model',
                value: model,
                onChange: (event) => {
                  setModel(event.target.value)
                  setTrim('')
                },
                options: models,
                placeholder: 'Select Model',
                disabled: !make
              },
              {
                label: 'Submodel / Trim',
                value: trim,
                onChange: (event) => setTrim(event.target.value),
                options: trims,
                placeholder: 'Select Trim',
                disabled: !model || trims.length === 0
              }
            ].map((field) => (
              <label key={field.label} className="block">
                <span className={`mb-2 block text-sm font-medium ${compact ? 'text-slate-700' : 'text-slate-300'}`}>
                  {field.label}
                </span>
                <select
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none disabled:cursor-not-allowed ${
                    compact
                      ? 'border-slate-200 bg-white text-slate-900 focus:border-blue-400 disabled:bg-slate-100'
                      : 'border-white/10 bg-white/95 text-slate-900 focus:border-cyan-400 disabled:bg-slate-200'
                  }`}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <div className="flex items-end">
              <button
                type="submit"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold ${
                  compact
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'bg-white text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Search size={18} aria-hidden />
                Find My Parts
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default FitmentSelector
