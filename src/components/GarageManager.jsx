import { useMemo, useState } from 'react'
import { Car, Plus, Search, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFitmentOptions } from '../data/catalog'

const emptyVehicle = { year: '', make: '', model: '', trim: '' }

const GarageManager = ({ vehicles = [], onSave }) => {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(emptyVehicle)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const options = useMemo(
    () => getFitmentOptions(undefined, draft),
    [draft.year, draft.make, draft.model]
  )
  const models = draft.make ? options.modelsByMake[draft.make] || [] : []
  const trims = draft.make && draft.model
    ? options.trimsByMakeModel[`${draft.make}::${draft.model}`] || []
    : []

  const persist = async (nextVehicles) => {
    setMessage('')
    setError('')
    const result = await onSave(nextVehicles)
    if (!result.success) {
      setError(result.error || 'Could not save your garage.')
      return false
    }
    setMessage('Garage saved.')
    return true
  }

  const addVehicle = async (event) => {
    event.preventDefault()
    if (!draft.year || !draft.make || !draft.model) {
      setError('Choose a year, make, and model.')
      return
    }
    if (vehicles.length >= 3) {
      setError('Your garage can hold up to three vehicles.')
      return
    }
    const duplicate = vehicles.some((vehicle) =>
      ['year', 'make', 'model', 'trim'].every((key) => vehicle[key] === draft[key])
    )
    if (duplicate) {
      setError('That vehicle is already in your garage.')
      return
    }
    if (await persist([...vehicles, draft])) setDraft(emptyVehicle)
  }

  const shopVehicle = (vehicle) => {
    const params = new URLSearchParams(vehicle)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div id="garage" className="scroll-mt-28 border border-gray-200 bg-white p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Garage</h2>
          <p className="mt-1 text-sm text-gray-600">Save up to three vehicles and shop compatible categories when you return.</p>
        </div>
        <span className="text-sm font-semibold text-gray-500">{vehicles.length} / 3 saved</span>
      </div>

      {error ? <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}

      {vehicles.length ? (
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <div key={`${vehicle.year}-${vehicle.make}-${vehicle.model}-${vehicle.trim}`} className="border border-gray-200 p-4">
              <Car className="mb-3 text-blue-600" size={22} aria-hidden />
              <p className="font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              {vehicle.trim ? <p className="mt-1 text-sm text-gray-500">{vehicle.trim}</p> : null}
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => shopVehicle(vehicle)} className="inline-flex flex-1 items-center justify-center gap-2 bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  <Search size={15} aria-hidden /> Shop
                </button>
                <button type="button" onClick={() => persist(vehicles.filter((_, vehicleIndex) => vehicleIndex !== index))} className="border border-gray-300 p-2 text-gray-600 hover:border-red-300 hover:text-red-600" aria-label={`Remove ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 border border-dashed border-gray-300 p-5 text-sm text-gray-600">No saved vehicles yet. Add the vehicle you shop for most often.</p>
      )}

      {vehicles.length < 3 ? (
        <form onSubmit={addVehicle} className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          {[
            { key: 'year', label: 'Year', options: options.years, disabled: false },
            { key: 'make', label: 'Make', options: options.makes, disabled: !draft.year },
            { key: 'model', label: 'Model', options: models, disabled: !draft.make },
            { key: 'trim', label: 'Trim', options: trims, disabled: !draft.model || !trims.length }
          ].map((field) => (
            <label key={field.key} className="text-sm font-semibold text-gray-700">
              {field.label}
              <select
                value={draft[field.key]}
                disabled={field.disabled}
                onChange={(event) => {
                  const value = event.target.value
                  setDraft((current) => ({
                    ...current,
                    [field.key]: value,
                    ...(field.key === 'year' ? { make: '', model: '', trim: '' } : {}),
                    ...(field.key === 'make' ? { model: '', trim: '' } : {}),
                    ...(field.key === 'model' ? { trim: '' } : {})
                  }))
                }}
                className="mt-2 h-11 w-full border border-gray-300 bg-white px-3 disabled:bg-gray-100"
              >
                <option value="">Select</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
          <button type="submit" className="mt-auto inline-flex h-11 items-center justify-center gap-2 bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <Plus size={16} aria-hidden /> Add
          </button>
        </form>
      ) : null}
    </div>
  )
}

export default GarageManager

