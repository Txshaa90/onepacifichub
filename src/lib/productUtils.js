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
    // Split before the marker if there's a space or if it's at the start
    const pattern = new RegExp(`(?:\\s+|^)(?=${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
    next = next.replace(pattern, '\n')
  })

  return next
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * Normalizes a string for comparison (removes non-alphanumeric, lowercase).
 */
const normalizeForComparison = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Removes duplicate description blocks, even if they aren't exact matches (fuzzy dedupe).
 */
export const collapseDuplicateDescriptionBlocks = (blocks) => {
  const seen = new Set()
  const result = []

  blocks.forEach(block => {
    // Skip junk blocks (dots, dashes, etc)
    const normalized = normalizeForComparison(block)
    if (normalized.length < 2) return

    // If we haven't seen this meaningful content before, add it
    // We use a prefix check or exact match on normalized content
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
      // Professional cleanup: Replace Amazon references with site-appropriate terms
      cleaned = cleaned.replace(/Amazon(?:'s)? fitment tool/gi, 'our fitment guide')
      return cleaned
    })
    .filter(Boolean)

  return collapseDuplicateDescriptionBlocks(blocks)
}

/**
 * Checks if a line is a compatibility/bullet line.
 */
export const isCompatibilityLine = (block) => {
  const lower = block.toLowerCase()
  return (
    lower.startsWith('compatible with:') || 
    lower.startsWith('•') || 
    lower.startsWith('-') ||
    lower.startsWith('fits ')
  )
}

/**
 * Checks if a line should be highlighted as a lead/attention line.
 */
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
