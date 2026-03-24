const STORE_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ||
  import.meta.env.SHOPIFY_STORE_DOMAIN ||
  ''

const STOREFRONT_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN ||
  import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  ''
const API_VERSION = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_VERSION || '2024-04'

const ENDPOINT = STORE_DOMAIN
  ? `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`
  : ''

export const isShopifyConfigured = () => {
  return !!(STORE_DOMAIN && STOREFRONT_TOKEN)
}

const stripHtml = (html) => {
  if (!html) return ''
  // Basic HTML stripping for product descriptions.
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const fetchGraphQL = async (query, variables) => {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify is not configured. Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_API_TOKEN to .env')
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Shopify GraphQL request failed: ${res.status} ${res.statusText}. ${text}`)
  }

  const json = await res.json()
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map(e => e.message).join('\n'))
  }

  return json.data
}

export const fetchCollectionProducts = async ({ handle, first = 250 }) => {
  const query = /* GraphQL */ `
    query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        title
        description
        products(first: $first) {
          nodes {
            id
            handle
            title
            description
            featuredImage {
              url
              altText
            }
            images(first: 8) {
              nodes {
                url
                altText
              }
            }
            variants(first: 1) {
              nodes {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await fetchGraphQL(query, { handle, first })
  const collection = data?.collection
  if (!collection) return []

  return (collection.products?.nodes || []).map((p) => {
    const variant = p.variants?.nodes?.[0]
    const featured = p.featuredImage?.url
    const imageNodes = (p.images?.nodes || []).map((n) => n.url).filter(Boolean)
    const images = imageNodes.length ? imageNodes : (featured ? [featured] : [])

    return {
      // Route param uses product handle for uniqueness in Shopify.
      id: p.handle,
      handle: p.handle,
      name: p.title,
      description: stripHtml(p.description),
      image: images[0] || '',
      images: images.slice(0, 8),
      variantId: variant?.id || null,
      price: variant?.price?.amount ? Number(variant.price.amount) : 0,
      currencyCode: variant?.price?.currencyCode || 'USD'
    }
  })
}

export const fetchProductByHandle = async ({ handle }) => {
  const query = /* GraphQL */ `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        metafield(namespace: "custom", key: "fitment") {
          value
        }
        featuredImage {
          url
          altText
        }
        images(first: 12) {
          nodes {
            url
            altText
          }
        }
        variants(first: 1) {
          nodes {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `

  const data = await fetchGraphQL(query, { handle })
  const p = data?.product
  if (!p) return null

  const featured = p.featuredImage?.url
  const imageNodes = (p.images?.nodes || []).map((n) => n.url).filter(Boolean)
  const images = imageNodes.length ? imageNodes : (featured ? [featured] : [])
  const variant = p.variants?.nodes?.[0]

  return {
    id: p.handle,
    handle: p.handle,
    name: p.title,
    description: stripHtml(p.description),
    metafield: p.metafield || null,
    image: images[0] || '',
    images: images.slice(0, 12),
    variantId: variant?.id || null,
    price: variant?.price?.amount ? Number(variant.price.amount) : 0,
    currencyCode: variant?.price?.currencyCode || 'USD'
  }
}

const CART_DETAILS_QUERY = /* GraphQL */ `
  fragment CartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              images(first: 1) {
                nodes {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`

export const fetchCart = async (cartId) => {
  const query = /* GraphQL */ `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartDetails
      }
    }
    ${CART_DETAILS_QUERY}
  `

  const data = await fetchGraphQL(query, { cartId })
  const cart = data?.cart
  if (!cart) return null

  const items = (cart.lines?.nodes || []).map((line) => {
    const variant = line.merchandise
    const imgUrl = variant?.product?.images?.nodes?.[0]?.url || ''
    return {
      lineId: line.id,
      id: line.id, // keep compatibility with existing UI remove/update by `id`
      quantity: line.quantity,
      productTitle: variant?.product?.title || '',
      productHandle: variant?.product?.handle || '',
      title: variant?.title || '',
      image: imgUrl,
      variantId: variant?.id || null,
      price: variant?.price?.amount ? Number(variant.price.amount) : 0,
      currencyCode: variant?.price?.currencyCode || 'USD'
    }
  })

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity || 0,
    totalAmount: cart.cost?.totalAmount?.amount
      ? Number(cart.cost.totalAmount.amount)
      : 0,
    currencyCode: cart.cost?.totalAmount?.currencyCode || 'USD',
    items
  }
}

export const cartCreate = async ({ lines }) => {
  const query = /* GraphQL */ `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_DETAILS_QUERY}
  `

  const data = await fetchGraphQL(query, { lines })
  const cart = data?.cartCreate?.cart
  const errors = data?.cartCreate?.userErrors || []
  if (errors.length) {
    throw new Error(errors.map(e => e.message).join('\n'))
  }

  if (!cart) return null

  // Reuse normal mapping
  return fetchCart(cart.id)
}

export const cartLinesAdd = async ({ cartId, lines }) => {
  const query = /* GraphQL */ `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_DETAILS_QUERY}
  `

  const data = await fetchGraphQL(query, { cartId, lines })
  const errors = data?.cartLinesAdd?.userErrors || []
  if (errors.length) {
    throw new Error(errors.map(e => e.message).join('\n'))
  }

  const cart = data?.cartLinesAdd?.cart
  if (!cart) return null
  return fetchCart(cart.id)
}

export const cartLinesUpdate = async ({ cartId, lines }) => {
  const query = /* GraphQL */ `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_DETAILS_QUERY}
  `

  const data = await fetchGraphQL(query, { cartId, lines })
  const errors = data?.cartLinesUpdate?.userErrors || []
  if (errors.length) {
    throw new Error(errors.map(e => e.message).join('\n'))
  }

  const cart = data?.cartLinesUpdate?.cart
  if (!cart) return null
  return fetchCart(cart.id)
}

export const cartLinesRemove = async ({ cartId, lineIds }) => {
  const query = /* GraphQL */ `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_DETAILS_QUERY}
  `

  const data = await fetchGraphQL(query, { cartId, lineIds })
  const errors = data?.cartLinesRemove?.userErrors || []
  if (errors.length) {
    throw new Error(errors.map(e => e.message).join('\n'))
  }

  const cart = data?.cartLinesRemove?.cart
  if (!cart) return null
  return fetchCart(cart.id)
}

