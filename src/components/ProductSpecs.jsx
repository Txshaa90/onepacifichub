import { Package, Palette, Wrench } from 'lucide-react'

const ProductSpecs = ({ product }) => {
  const mf = product.metafields || {}
  const specs = {
    sku: mf.custom?.sku || mf.sku || product.sku || '',
    dimensions: mf.custom?.dimensions || extractDimension(product),
    color: mf.custom?.color || extractColor(product),
    installationType: mf.custom?.installation_type || mf.custom?.installationType || extractInstallation(product)
  }

  const specFields = [
    { key: 'sku', label: 'SKU', icon: Package },
    { key: 'dimensions', label: 'Dimensions', icon: Package },
    { key: 'color', label: 'Color', icon: Palette },
    { key: 'installationType', label: 'Installation', icon: Wrench }
  ].filter(field => specs[field.key])

  if (specFields.length === 0) return null

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h2>
      <div className="grid grid-cols-2 gap-4">
        {specFields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-start gap-3">
            <Icon className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-semibold text-gray-900">{specs[key]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const extractDimension = (product) => {
  const sizeMatch = product.name?.match(/(\d+)\s*(inch|"|in)/i)
  return sizeMatch ? `${sizeMatch[1]} inches` : null
}

const extractColor = (product) => {
  const colorKeywords = ['Chrome', 'Silver', 'Black', 'Matte', 'Polished', 'Gloss', 'Gunmetal']
  const text = `${product.name} ${product.description}`
  return colorKeywords.find(color => text.includes(color)) || null
}

const extractInstallation = (product) => {
  const text = `${product.name} ${product.description}`
  if (text.includes('Snap-On') || text.includes('snap')) return 'Snap-On Installation'
  if (text.includes('Push-On') || text.includes('push')) return 'Push-On Installation'
  return 'Easy Installation'
}

export default ProductSpecs
