/**
 * Decodes HTML entities from a string.
 */
export const decodeEntities = (text) => (
  text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
)

/**
 * Splits a long description block into smaller meaningful paragraphs.
 */
export const splitLongDescriptionBlock = (block) => {
  const markers = [
    'Attention!',
    'ATTENTION:',
    'These are',
    'These Wheel Covers',
    'Compatible with:',
    'Use Amazon',
    'For ',
    'Factory ',
    'Stylish ',
    'Important:',
    'Note:',
    'PLEASE NOTE'
  ]

  let next = block
  markers.forEach((marker) => {
    const pattern = new RegExp(`(?:\\s+|^)(?=${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
    next = next.replace(pattern, '\n')
  })

  return next
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

const normalizeForComparison = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Removes duplicate description blocks, even if they aren't exact matches.
 */
export const collapseDuplicateDescriptionBlocks = (blocks) => {
  const seen = new Set()
  const result = []

  blocks.forEach((block) => {
    const normalized = normalizeForComparison(block)
    if (normalized.length < 2) return

    if (!seen.has(normalized)) {
      seen.add(normalized)
      result.push(block)
    }
  })

  return result
}

/**
 * Main entry point for cleaning product descriptions.
 */
export const extractDescriptionBlocks = (product) => {
  const source = product?.descriptionHtml || product?.description || ''
  if (!source) return []

  const blocks = decodeEntities(
    source
      .replace(/\r/g, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|h[1-6]|li|ul|ol)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<[^>]+>/g, ' ')
  )
    .split(/\n+/)
    .flatMap((block) => splitLongDescriptionBlock(block))
    .map((block) => {
      let cleaned = block.replace(/\s+/g, ' ').trim()
      cleaned = cleaned.replace(/Amazon(?:'s)? fitment tool/gi, 'our fitment guide')
      return cleaned
    })
    .filter(Boolean)

  return collapseDuplicateDescriptionBlocks(blocks)
}

export const isCompatibilityLine = (block) => {
  const lower = block.toLowerCase()
  return (
    lower.startsWith('compatible with:') ||
    lower.startsWith('•') ||
    lower.startsWith('-') ||
    lower.startsWith('fits ')
  )
}

export const isLeadHighlightLine = (block) => {
  const normalized = block.trim()
  const lower = normalized.toLowerCase()
  if (normalized.length <= 220 && lower.includes('only compatible')) return true
  return (
    normalized.length <= 180 &&
    (lower.startsWith('these ') ||
      lower.startsWith('attention') ||
      lower.startsWith('important:') ||
      lower.startsWith('note:'))
  )
}
