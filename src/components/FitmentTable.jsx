import { Check } from 'lucide-react'
import { getProductFitment } from '../data/catalog'

const EMPTY_VALUE = '—'

const FitmentTable = ({ product }) => {
  const mf = product.metafields?.custom || product.metafields || {}
  const parsedFitment = getProductFitment(product)

  const year = mf.year || formatYearRange(parsedFitment.years) || extractYear(product)
  const make = mf.make || parsedFitment.make || extractMake(product)
  const model = mf.model || parsedFitment.model || extractModel(product)
  const submodel = mf.submodel || mf.sub_model || parsedFitment.trim || ''
  const bodyType = mf.body_type || mf.bodytype || ''
  const doors = mf.doors || ''
  const position = mf.position || mf.position_on_vehicle || ''
  const fitmentNotes = mf.fitment_notes || mf.fitmentNotes || ''

  const fitmentData = []

  if (Array.isArray(mf.vehicles) && mf.vehicles.length) {
    mf.vehicles.forEach((vehicle) => {
      fitmentData.push({
        year: vehicle.year || EMPTY_VALUE,
        make: vehicle.make || EMPTY_VALUE,
        model: vehicle.model || EMPTY_VALUE,
        submodel: vehicle.submodel || EMPTY_VALUE,
        bodyType: vehicle.body_type || EMPTY_VALUE,
        doors: vehicle.doors || EMPTY_VALUE,
        position: vehicle.position || EMPTY_VALUE
      })
    })
  } else {
    fitmentData.push({
      year: year || EMPTY_VALUE,
      make: make || EMPTY_VALUE,
      model: model || EMPTY_VALUE,
      submodel: submodel || EMPTY_VALUE,
      bodyType: bodyType || EMPTY_VALUE,
      doors: doors || EMPTY_VALUE,
      position: position || EMPTY_VALUE
    })
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-950 md:text-[2rem]">Vehicle Fitment</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 overflow-hidden rounded-[24px]">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="rounded-tl-[24px] px-6 py-4 text-left text-sm font-semibold">Year</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Make</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Model</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Submodel</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Body</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Doors</th>
              <th className="rounded-tr-[24px] px-6 py-4 text-left text-sm font-semibold">Position</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {fitmentData.map((row, index) => (
              <tr key={index} className={index < fitmentData.length - 1 ? 'border-b border-slate-200' : ''}>
                <td className="px-6 py-6 text-sm text-slate-900">{row.year || EMPTY_VALUE}</td>
                <td className="px-6 py-6 text-sm text-slate-900">{row.make || EMPTY_VALUE}</td>
                <td className="px-6 py-6 text-sm text-slate-900">{row.model || EMPTY_VALUE}</td>
                <td className="px-6 py-6 text-sm text-slate-900">{row.submodel || EMPTY_VALUE}</td>
                <td className="px-6 py-6 text-sm text-slate-900">{row.bodyType || EMPTY_VALUE}</td>
                <td className="px-6 py-6 text-sm text-slate-900">{row.doors || EMPTY_VALUE}</td>
                <td className="px-6 py-6 text-sm text-slate-900">{row.position || EMPTY_VALUE}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fitmentNotes ? (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="mb-1 text-sm font-semibold text-blue-800">Fitment Notes:</p>
          <p className="text-sm text-blue-700">{fitmentNotes}</p>
        </div>
      ) : null}

      <div className="mt-5 rounded-[22px] border border-amber-300 bg-amber-50 px-6 py-5">
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 flex-shrink-0 text-amber-600" size={18} />
          <p className="text-sm leading-7 text-amber-800">
            <strong>Need help?</strong> Use our fitment guide to find your exact wheel specs.
            Proper fitment ensures safety and optimal performance.
          </p>
        </div>
      </div>
    </section>
  )
}

const extractYear = (product) => {
  const text = `${product.name} ${product.description}`
  const yearMatch = text.match(/\b(19|20)\d{2}\b/)
  return yearMatch ? yearMatch[0] : null
}

const extractMake = (product) => {
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'GMC', 'Dodge', 'Nissan', 'Mazda', 'Jeep', 'Ram', 'Cadillac', 'Subaru']
  const text = `${product.name} ${product.description}`
  return makes.find((make) => text.includes(make)) || null
}

const extractModel = (product) => {
  const models = ['F-150', 'Silverado', 'Sierra', 'Camry', 'Corolla', 'Accord', 'Civic', 'Tundra', 'Prius', 'Challenger', 'Charger', 'Colorado', 'Equinox', 'Altima', 'CX-5']
  const text = `${product.name} ${product.description}`
  return models.find((model) => text.includes(model)) || null
}

const formatYearRange = (years = []) => {
  if (!years.length) return ''
  if (years.length === 1) return years[0]

  const sorted = [...years].sort((a, b) => Number(a) - Number(b))
  return `${sorted[0]}-${sorted[sorted.length - 1]}`
}

export default FitmentTable
