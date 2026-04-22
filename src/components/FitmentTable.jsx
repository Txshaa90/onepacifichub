import { Check } from 'lucide-react'

const FitmentTable = ({ product }) => {
  const mf = product.metafields?.custom || product.metafields || {}
  
  const year = mf.year || extractYear(product)
  const make = mf.make || extractMake(product)
  const model = mf.model || extractModel(product)
  const submodel = mf.submodel || mf.sub_model || ''
  const bodyType = mf.body_type || mf.bodytype || ''
  const doors = mf.doors || ''
  const position = mf.position || mf.position_on_vehicle || ''
  const fitmentNotes = mf.fitment_notes || mf.fitmentNotes || ''

  const hasFitment = year || make || model

  if (!hasFitment) return null

  const fitmentData = []

  if (Array.isArray(mf.vehicles)) {
    mf.vehicles.forEach(v => {
      fitmentData.push({
        year: v.year || '',
        make: v.make || '',
        model: v.model || '',
        submodel: v.submodel || '',
        bodyType: v.body_type || '',
        doors: v.doors || '',
        position: v.position || ''
      })
    })
  } else {
    fitmentData.push({
      year: year || '',
      make: make || '',
      model: model || '',
      submodel: submodel || '',
      bodyType: bodyType || '',
      doors: doors || '',
      position: position || ''
    })
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Fitment</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-3 text-left font-semibold text-sm">Year</th>
              <th className="px-4 py-3 text-left font-semibold text-sm">Make</th>
              <th className="px-4 py-3 text-left font-semibold text-sm">Model</th>
              <th className="px-4 py-3 text-left font-semibold text-sm">Submodel</th>
              <th className="px-4 py-3 text-left font-semibold text-sm">Body</th>
              <th className="px-4 py-3 text-left font-semibold text-sm">Doors</th>
              <th className="px-4 py-3 text-left font-semibold text-sm">Position</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fitmentData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-900">{row.year}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.make}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.model}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.submodel || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.bodyType || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.doors || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.position || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fitmentNotes && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm font-semibold text-blue-800 mb-1">Fitment Notes:</p>
          <p className="text-sm text-blue-700">{fitmentNotes}</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <div className="flex items-start gap-2">
          <Check className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-amber-800">
            <strong>Need help?</strong> Use our fitment guide to find your exact wheel specs. 
            Proper fitment ensures safety and optimal performance.
          </p>
        </div>
      </div>
    </div>
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
  return makes.find(make => text.includes(make)) || null
}

const extractModel = (product) => {
  const models = ['F-150', 'Silverado', 'Sierra', 'Camry', 'Corolla', 'Accord', 'Civic', 'Tundra', 'Prius', 'Challenger', 'Charger', 'Colorado', 'Equinox', 'Altima', 'CX-5']
  const text = `${product.name} ${product.description}`
  return models.find(model => text.includes(model)) || null
}

export default FitmentTable
