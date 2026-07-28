import { products as realProductsByCategory } from './products_real.js'
import { getProductPartNumbers } from '../lib/productPresentation.js'

const curatedProducts = [
  {
    id: 'hc-001',
    categorySlug: 'hubcaps',
    name: 'Fuel Rider Set of 4 Semi-Universal 15 inch Chrome Snap-On Hubcaps With Wire Spoke',
    price: 120.98,
    description: 'Chrome wire-spoke hubcaps designed for a fast visual upgrade and easy DIY installation.',
    image: 'https://i.postimg.cc/fTMhb9YC/1215-4pcs.jpg',
    features: ['Fits standard steel wheels', 'Easy snap-on installation'],
    rating: 4.5,
    reviews: 50
  },
  {
    id: 'hc-019',
    categorySlug: 'hubcaps',
    name: 'Fuel Rider Set of 4 Semi-Universal 16 inch Chrome Snap-On Hubcaps With 5 Spokes',
    price: 113.98,
    description: 'A chrome 5-spoke hubcap set for restoring or upgrading your vehicle’s wheel appearance.',
    image: 'https://i.postimg.cc/8zhkYSdX/13416-C-4pcs.jpg',
    features: ['Chrome finish', '5 spoke design'],
    rating: 4.8,
    reviews: 230
  },
  {
    id: 'ws-001',
    categorySlug: 'wheelskins',
    name: 'Fuel Rider Wheel Skin Set for 17 inch Factory Alloy Wheels',
    price: 189.95,
    description: 'Direct-fit wheel skins that refresh worn factory wheels with a clean OEM-style finish.',
    image: 'https://www.tenplus.ph/cdn/shop/products/JH080_9f1cf417-450a-4f40-a2d8-69a8d44d939c.jpg?v=1736185368',
    features: ['Direct fit', 'Factory-style finish'],
    rating: 4.7,
    reviews: 84
  },
  {
    id: 'sim-001',
    categorySlug: 'wheel-simulator',
    name: 'Fuel Rider Chrome ABS Wheel Simulators for Dually Truck Set of 4',
    price: 359.95,
    description: 'Chrome ABS wheel simulators that deliver a polished dually look without replacing your wheels.',
    image: 'https://img.vevorstatic.com/us%2FCLMNQ195YC4P6TQSZV0%2Fgoods_img-v2%2Fwheel-simulators-m100-1.2.jpg?format=webp&timestamp=1706755044000',
    features: ['Dually application', 'Chrome ABS finish'],
    rating: 4.8,
    reviews: 168
  },
  {
    id: 'tr-001',
    categorySlug: 'trim-rings',
    name: 'Fuel Rider Beauty Trim Rings for 13 inch Rally Wheels Chrome ABS Set',
    price: 58.95,
    description: 'Chrome ABS trim rings that add a clean finishing touch to rally wheels and steel wheel setups.',
    image: 'https://m.media-amazon.com/images/I/61JfDiO055L._AC_UF894,1000_QL80_.jpg',
    features: ['Chrome ABS', 'Rally wheel style'],
    rating: 4.6,
    reviews: 65
  },
  {
    id: 'tr-008',
    categorySlug: 'trim-rings',
    name: 'Fuel Rider 15 Inch Beauty Trim Rings Compatible with 2004-2009 Toyota Prius',
    price: 52.95,
    description: 'Vehicle-specific trim rings for Toyota Prius steel wheels with a durable silver finish.',
    image: 'https://i.postimg.cc/pXLbN2Bx/1515TPx4.jpg',
    features: ['Vehicle specific', 'Set of 4'],
    rating: 4.8,
    reviews: 135
  }
]

const KNOWN_MAKES = [
  'Acura',
  'Audi',
  'BMW',
  'Buick',
  'Cadillac',
  'Chevrolet',
  'Chrysler',
  'Dodge',
  'Ford',
  'GMC',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Jeep',
  'Kia',
  'Lexus',
  'Lincoln',
  'Mazda',
  'Mercedes-Benz',
  'Mercury',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Pontiac',
  'Ram',
  'Saturn',
  'Subaru',
  'Toyota',
  'Volkswagen',
  'Volvo'
]

const FITMENT_STOP_WORDS = [
  'set',
  'standard',
  'steel',
  'wheel',
  'wheels',
  'wheelcover',
  'wheelcovers',
  'wheel',
  'cover',
  'covers',
  'hubcap',
  'hubcaps',
  'snap-on',
  'snap',
  'factory',
  'alloy',
  'chrome',
  'silver',
  'gloss',
  'black',
  'replacement'
]

const normalizeWhitespace = (value) => value.replace(/\s+/g, ' ').trim()

const titleCase = (value) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')

const CATEGORY_SLUGS_BY_SOURCE_KEY = {
  wheelSimulator: 'wheel-simulator',
  trimRings: 'trim-rings'
}

const realProducts = Object.entries(realProductsByCategory).flatMap(([sourceKey, items]) => {
  const categorySlug = CATEGORY_SLUGS_BY_SOURCE_KEY[sourceKey] || sourceKey

  return items.map((product) => ({
    ...product,
    categorySlug: product.categorySlug || categorySlug
  }))
})

const searchableProducts = realProducts.length ? realProducts : curatedProducts

const extractFitmentText = (product) =>
  normalizeWhitespace(
    [
      product.name,
      product.description,
      ...(product.features || []),
      product.metafield?.value || '',
      product.metafields?.custom?.fitment || ''
    ]
      .filter(Boolean)
      .join(' ')
  )

const extractYearValues = (text) => {
  const years = new Set()
  const rangePattern = /\b((?:19|20)\d{2})\s*[-–—]\s*((?:19|20)\d{2})\b/g
  let rangeMatch = rangePattern.exec(text)

  while (rangeMatch) {
    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2])

    if (start <= end && end - start <= 50) {
      for (let year = start; year <= end; year += 1) {
        years.add(String(year))
      }
    }

    rangeMatch = rangePattern.exec(text)
  }

  const matches = text.match(/\b(?:19|20)\d{2}\b/g) || []
  matches.forEach((year) => years.add(year))

  return Array.from(years)
}

const extractMakeValue = (text) => {
  const lower = text.toLowerCase()
  return KNOWN_MAKES.find((make) => lower.includes(make.toLowerCase())) || ''
}

const extractModelValue = (text, make) => {
  if (!make) return ''

  const makeIndex = text.toLowerCase().indexOf(make.toLowerCase())
  if (makeIndex === -1) return ''

  const afterMake = text.slice(makeIndex + make.length)
  const tokens = afterMake
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .map((token) => token.replace(/^[^a-z0-9]+|[^a-z0-9-]+$/gi, ''))
    .filter(Boolean)

  const modelTokens = []
  for (const token of tokens) {
    const lower = token.toLowerCase()
    if (FITMENT_STOP_WORDS.includes(lower)) break
    if (/^(?:19|20)\d{2}$/.test(token)) continue
    modelTokens.push(token)
    if (modelTokens.length === 3) break
  }

  return normalizeWhitespace(modelTokens.join(' '))
}

const extractTrimValue = (text, model) => {
  if (!model) return ''

  const modelIndex = text.toLowerCase().indexOf(model.toLowerCase())
  if (modelIndex === -1) return ''

  const afterModel = text.slice(modelIndex + model.length)
  const tokens = afterModel
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .map((token) => token.replace(/^[^a-z0-9]+|[^a-z0-9-]+$/gi, ''))
    .filter(Boolean)

  const trimTokens = []
  for (const token of tokens) {
    const lower = token.toLowerCase()
    if (FITMENT_STOP_WORDS.includes(lower)) break
    if (/^(?:19|20)\d{2}$/.test(token)) continue
    trimTokens.push(token)
    if (trimTokens.length === 3) break
  }

  return titleCase(normalizeWhitespace(trimTokens.join(' ')))
}

export const getProductFitment = (product) => {
  const text = extractFitmentText(product)
  const years = extractYearValues(text)
  const make = extractMakeValue(text)
  const model = extractModelValue(text, make)
  const trim = extractTrimValue(text, model)

  return {
    years,
    make,
    model,
    trim
  }
}

export const getAllLocalProducts = () => searchableProducts

export const getLocalProductsByCategorySlug = (categorySlug) =>
  searchableProducts.filter((product) => product.categorySlug === categorySlug)

export const getLocalProductByCategoryAndId = (categorySlug, productId) =>
  searchableProducts.find(
    (product) => product.categorySlug === categorySlug && product.id === productId
  ) || null

export const getFeaturedLocalProducts = () => curatedProducts.slice(0, 4)

export const getSearchableProducts = () => searchableProducts

export const searchLocalProducts = (query) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return searchableProducts.filter((product) => {
    const partNumbers = getProductPartNumbers(product)
    const skuValues = [
      product.sku,
      product.metafields?.custom?.sku,
      partNumbers.onePacificHub,
      partNumbers.keystone,
      partNumbers.oxGord
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return skuValues.includes(normalized)
  })
}

export const getCategoriesForFitment = (filters = {}) => {
  const matchingProducts = searchProductsByFitment(filters)
  const counts = matchingProducts.reduce((result, product) => {
    result[product.categorySlug] = (result[product.categorySlug] || 0) + 1
    return result
  }, {})

  return Object.entries(counts)
    .map(([categorySlug, productCount]) => ({ categorySlug, productCount }))
    .sort((a, b) => b.productCount - a.productCount)
}

export const searchProductsByFitment = ({ year = '', make = '', model = '', trim = '' }) => {
  const selectedYear = year.trim()
  const selectedMake = make.trim().toLowerCase()
  const selectedModel = model.trim().toLowerCase()
  const selectedTrim = trim.trim().toLowerCase()

  return searchableProducts.filter((product) => {
    const fitment = getProductFitment(product)
    const matchesYear = !selectedYear || fitment.years.includes(selectedYear)
    const matchesMake = !selectedMake || fitment.make.toLowerCase() === selectedMake
    const matchesModel = !selectedModel || fitment.model.toLowerCase() === selectedModel
    const matchesTrim = !selectedTrim || fitment.trim.toLowerCase() === selectedTrim

    return matchesYear && matchesMake && matchesModel && matchesTrim
  })
}

const matchesFitmentFilters = (fitment, { year = '', make = '', model = '', trim = '' }) => {
  const selectedYear = year.trim()
  const selectedMake = make.trim().toLowerCase()
  const selectedModel = model.trim().toLowerCase()
  const selectedTrim = trim.trim().toLowerCase()

  const matchesYear = !selectedYear || fitment.years.includes(selectedYear)
  const matchesMake = !selectedMake || fitment.make.toLowerCase() === selectedMake
  const matchesModel = !selectedModel || fitment.model.toLowerCase() === selectedModel
  const matchesTrim = !selectedTrim || fitment.trim.toLowerCase() === selectedTrim

  return matchesYear && matchesMake && matchesModel && matchesTrim
}

export const getFitmentOptions = (products = searchableProducts, filters = {}) => {
  const fitmentRows = products
    .map((product) => ({
      product,
      fitment: getProductFitment(product)
    }))
    .filter(({ fitment }) => fitment.years.length || fitment.make || fitment.model || fitment.trim)

  const years = Array.from(
    new Set(fitmentRows.flatMap(({ fitment }) => fitment.years))
  ).sort((a, b) => Number(b) - Number(a))

  const makeRows = fitmentRows.filter(({ fitment }) =>
    matchesFitmentFilters(fitment, { year: filters.year })
  )

  const makes = Array.from(
    new Set(makeRows.map(({ fitment }) => fitment.make).filter(Boolean))
  ).sort()

  const modelsByMake = {}
  const trimsByMakeModel = {}

  makes.forEach((make) => {
    const models = Array.from(
      new Set(
        fitmentRows
          .filter(({ fitment }) =>
            fitment.make === make &&
            fitment.model &&
            matchesFitmentFilters(fitment, { year: filters.year })
          )
          .map(({ fitment }) => fitment.model)
      )
    ).sort()

    modelsByMake[make] = models

    models.forEach((model) => {
      const trims = Array.from(
        new Set(
          fitmentRows
            .filter(({ fitment }) =>
              fitment.make === make &&
              fitment.model === model &&
              fitment.trim &&
              matchesFitmentFilters(fitment, { year: filters.year })
            )
            .map(({ fitment }) => fitment.trim)
        )
      ).sort()

      trimsByMakeModel[`${make}::${model}`] = trims
    })
  })

  return {
    years,
    makes,
    modelsByMake,
    trimsByMakeModel
  }
}
