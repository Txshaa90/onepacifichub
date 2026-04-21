/**
 * Icon-only or compact controls: screen readers + native tooltip (title) share the same text.
 */
export function a11yAction(label, extra = {}) {
  return {
    'aria-label': label,
    title: label,
    ...extra
  }
}
