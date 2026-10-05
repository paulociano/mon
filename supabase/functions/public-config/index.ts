const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
  })
}

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const raw = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')
  if (!url || !raw) return json({ error: 'server_configuration' }, 500)

  try {
    const publishableKey = JSON.parse(raw)?.default
    if (!publishableKey || !String(publishableKey).startsWith('sb_publishable_')) {
      return json({ error: 'server_configuration' }, 500)
    }
    return json({ url, publishableKey })
  } catch {
    return json({ error: 'server_configuration' }, 500)
  }
})
