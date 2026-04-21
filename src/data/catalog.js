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

export const getAllLocalProducts = () => curatedProducts

export const getLocalProductsByCategorySlug = (categorySlug) =>
  curatedProducts.filter((product) => product.categorySlug === categorySlug)

export const getLocalProductByCategoryAndId = (categorySlug, productId) =>
  curatedProducts.find(
    (product) => product.categorySlug === categorySlug && product.id === productId
  ) || null

export const getFeaturedLocalProducts = () => curatedProducts.slice(0, 4)

export const searchLocalProducts = (query) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return curatedProducts.filter((product) => {
    const haystack = [product.id, product.name, product.description, ...(product.features || [])]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalized)
  })
}
