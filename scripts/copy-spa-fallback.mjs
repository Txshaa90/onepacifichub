/**
 * GitHub Pages serves 404.html for unknown paths. Copy index.html so
 * /auth/callback (and other client routes) load the SPA.
 */
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

const dist = join(process.cwd(), 'dist')
const index = join(dist, 'index.html')
const fallback = join(dist, '404.html')

if (!existsSync(index)) {
  console.warn('[copy-spa-fallback] dist/index.html missing — run vite build first')
  process.exit(0)
}
copyFileSync(index, fallback)
console.log('[copy-spa-fallback] wrote dist/404.html')
