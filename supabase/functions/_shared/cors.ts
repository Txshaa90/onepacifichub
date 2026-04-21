/**
 * Browser calls to Edge Functions trigger a CORS preflight (OPTIONS).
 * If the function does not answer OPTIONS with Access-Control-* headers,
 * the browser blocks the request and you see:
 * "No 'Access-Control-Allow-Origin' header is present on the requested resource"
 *
 * Usage in each function handler (merge `corsHeaders` into every Response):
 *
 *   import { corsHeaders, handleCorsPreflight } from '../_shared/cors.ts'
 *
 *   Deno.serve(async (req) => {
 *     const preflight = handleCorsPreflight(req)
 *     if (preflight) return preflight
 *     // ... your logic ...
 *     return new Response(JSON.stringify({ ok: true }), {
 *       status: 200,
 *       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 *     })
 *   })
 *
 * If you edit functions in the Supabase Dashboard, copy `corsHeaders` and the
 * OPTIONS branch into that file instead of importing.
 */

/** Tighten to your site in production if you prefer not to use `*`. */
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Max-Age': '86400',
}

export function handleCorsPreflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: new Headers(corsHeaders) })
  }
  return null
}
