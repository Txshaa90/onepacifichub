export const mainCategories = [
  {
    id: 'wheel-covers',
    name: 'Wheel Covers',
    slug: 'wheel-covers',
    description: 'Shop hubcaps, wheel skins, wheel simulators, center caps, and trim rings through organized subcategories.',
    image:
      'https://d2ffe4c0hazokn.cloudfront.net/media/catalog/product/cache/ba9e478d5a0771dbf79917b83147bec8/S/t/Stainless-Simulators-Group.jpg',
    accent: 'from-blue-600 to-cyan-500',
    subcategories: ['hubcaps', 'wheelskins', 'wheel-simulator', 'center-caps', 'trim-rings']
  },
  {
    id: 'restyling-accessories',
    name: 'Styling Accessories',
    slug: 'restyling-accessories',
    description: 'Browse mirror covers, door handles, wheel inserts, and styling parts through a simplified accessories catalog.',
    image:
      'https://m.media-amazon.com/images/I/71pETDSDdDL._AC_UF894,1000_QL80_.jpg',
    accent: 'from-slate-800 to-blue-700',
    subcategories: ['mirror-covers', 'door-handle-covers', 'grille-inserts']
  }
]

export const categories = [
  {
    id: 'hubcaps',
    name: 'Hubcaps',
    slug: 'hubcaps',
    parentSlug: 'wheel-covers',
    description: 'Designed to match your original stock wheel cover or upgrade your ride with fresh new styles.'
  },
  {
    id: 'wheelskins',
    name: 'Wheel Skins',
    slug: 'wheelskins',
    parentSlug: 'wheel-covers',
    description:
      'Direct-fit rim and styled steel wheel covers matched to your vehicle down to the submodel level.'
  },
  {
    id: 'wheel-simulator',
    name: 'Wheel Simulators',
    slug: 'wheel-simulator',
    shopifyHandle: 'wheel-simulators',
    parentSlug: 'wheel-covers',
    description: 'Wheel simulators from universal fit to vehicle-specific designs, including dually applications.'
  },
  {
    id: 'center-caps',
    name: 'Center Caps',
    slug: 'center-caps',
    parentSlug: 'wheel-covers',
    description: 'Center caps for restoring or completing wheel cover and wheel simulator setups.'
  },
  {
    id: 'trim-rings',
    name: 'Trim Rings',
    slug: 'trim-rings',
    parentSlug: 'wheel-covers',
    description: 'Universal and vehicle-specific trim rings for steel wheels to enhance, restore, or customize your look.'
  },
  {
    id: 'mirror-covers',
    name: 'Mirror Covers',
    slug: 'mirror-covers',
    parentSlug: 'restyling-accessories',
    description: 'Mirror covers for exterior styling upgrades and chrome or painted accent finishes.'
  },
  {
    id: 'door-handle-covers',
    name: 'Door Handles',
    slug: 'door-handle-covers',
    parentSlug: 'restyling-accessories',
    description: 'Door handle covers and trim kits for quick appearance upgrades.'
  },
  {
    id: 'grille-inserts',
    name: 'Wheel Inserts',
    slug: 'grille-inserts',
    parentSlug: 'restyling-accessories',
    description: 'Wheel inserts and accent pieces that sharpen the vehicle styling package.'
  }
]

export const findMainCategoryBySlug = (slug) =>
  mainCategories.find((category) => category.slug === slug)

export const getSubcategoriesForMainCategory = (slug) =>
  categories.filter((category) => category.parentSlug === slug)
