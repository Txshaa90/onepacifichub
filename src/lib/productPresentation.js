const BRAND_PREFIX_PATTERN = /^(?:fuel\s*rider|oxgord|keystone)\s+/i

export const getProductTitle = (product) => {
  const title = product?.displayTitle || product?.title || product?.name || 'Product'
  return title.replace(BRAND_PREFIX_PATTERN, '').trim()
}

export const getProductPartNumbers = (product) => {
  const custom = product?.metafields?.custom || {}
  const source = product?.partNumbers || product?.crossReferencePartNumbers || {}

  return {
    onePacificHub: product?.sku || product?.id || '',
    keystone:
      source.keystone ||
      source.keystonePartNumber ||
      product?.keystonePartNumber ||
      product?.keystone_part_number ||
      custom.keystone_part_number ||
      '',
    oxGord:
      source.oxGord ||
      source.oxgord ||
      source.oxGordPartNumber ||
      product?.oxGordPartNumber ||
      product?.oxgordPartNumber ||
      product?.oxgord_part_number ||
      custom.oxgord_part_number ||
      ''
  }
}

export const getCustomerPrice = (product, pricingTier = 'general') => {
  const prices = product?.prices || product?.pricing || {}
  const tierKeys = {
    general: ['general', 'retail'],
    loyalty: ['loyalty', 'loyaltyCustomer'],
    wholesale: ['wholesale', 'business', 'wholesaleBusiness']
  }

  const tierPrice = (tierKeys[pricingTier] || tierKeys.general)
    .map((key) => prices[key])
    .find((value) => Number.isFinite(Number(value)))

  return Number(tierPrice ?? product?.price ?? 0)
}

