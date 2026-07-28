import { Check } from 'lucide-react'
import { extractDescriptionBlocks, isCompatibilityLine, isLeadHighlightLine } from '../lib/productUtils'

const BULLET_PREFIX = /^(?:\u2022|\u2713|\u00e2\u20ac\u00a2|\u00e2\u0153\u201c)\s*/
const startsWithBullet = (block) => block.startsWith('\u2022') || block.startsWith('\u00e2\u20ac\u00a2')

const ProductNotes = ({ product }) => {
  const descriptionBlocks = extractDescriptionBlocks(product)
  const notes = product.metafields?.custom?.notes || product.metafields?.custom?.notes || ''
  const features = product.features || []
  const shortDescription = product.description || ''

  const hasContent = descriptionBlocks.length > 0 || features.length > 0 || notes

  if (!hasContent) return null

  const detailBlocks = descriptionBlocks.filter((block) => !isLeadHighlightLine(block))

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-[2rem]">About This Item</h2>
      </div>

      {descriptionBlocks.length > 0 ? (
        <div className="space-y-6">
          {detailBlocks.length > 0 ? (
            <div className={`grid gap-4 ${detailBlocks.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {detailBlocks.map((block, index) => (
                isCompatibilityLine(block) || startsWithBullet(block) ? (
                  <div key={index} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <Check className="mt-1 flex-shrink-0 text-green-500" size={18} />
                    <span className="text-sm leading-7 text-slate-700">{block.replace(BULLET_PREFIX, '')}</span>
                  </div>
                ) : (
                  <p key={index} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    {block}
                  </p>
                )
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <ul className={`grid gap-4 ${features.length > 0 ? 'md:grid-cols-2' : ''}`}>
          {shortDescription ? (
            <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <Check className="mt-1 flex-shrink-0 text-green-500" size={18} />
              <span className="text-sm leading-7 text-slate-700">{shortDescription}</span>
            </li>
          ) : null}
          {features.slice(0, 5).map((feature, index) => (
            <li key={index} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <Check className="mt-1 flex-shrink-0 text-green-500" size={18} />
              <span className="text-sm leading-7 text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {notes ? (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="mb-1 text-sm font-semibold text-blue-800">Additional Notes:</p>
          <p className="text-sm text-blue-700">{notes}</p>
        </div>
      ) : null}
    </section>
  )
}

export default ProductNotes
