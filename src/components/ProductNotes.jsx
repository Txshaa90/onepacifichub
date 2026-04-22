import { Check } from 'lucide-react'
import { extractDescriptionBlocks, isCompatibilityLine, isLeadHighlightLine } from '../lib/productUtils'

const ProductNotes = ({ product }) => {
  const descriptionBlocks = extractDescriptionBlocks(product)
  const notes = product.metafields?.custom?.notes || product.metafields?.custom?.notes || ''
  
  const features = product.features || []
  const shortDescription = product.description || ''

  const hasContent = descriptionBlocks.length > 0 || features.length > 0 || notes

  if (!hasContent) return null

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About This Item</h2>
      
      {descriptionBlocks.length > 0 ? (
        <div className="space-y-3">
          {descriptionBlocks.map((block, index) => (
            isCompatibilityLine(block) || block.startsWith('•') ? (
              <div key={index} className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">{block.replace(/^[•✓]\s*/, '')}</span>
              </div>
            ) : isLeadHighlightLine(block) ? (
              <p key={index} className="text-gray-900 font-semibold leading-relaxed">
                {block}
              </p>
            ) : (
              <p key={index} className="text-gray-700 leading-relaxed">
                {block}
              </p>
            )
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {shortDescription && (
            <li className="flex items-start gap-3">
              <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <span className="text-gray-700">{shortDescription}</span>
            </li>
          )}
          {features.slice(0, 5).map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {notes && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm font-semibold text-blue-800 mb-1">Additional Notes:</p>
          <p className="text-sm text-blue-700">{notes}</p>
        </div>
      )}
    </div>
  )
}

export default ProductNotes
