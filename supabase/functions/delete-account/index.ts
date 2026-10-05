import { createClient } from 'npm:@supabase/supabase-js@2.117.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const authorization = req.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')

  const envKey = (modernName: string, legacyName: string) => {
    const modern = Deno.env.get(modernName)
    if (modern) {
      try {
        const parsed = JSON.parse(modern)
        if (parsed?.default) return parsed.default
      } catch {
        console.error('delete-account: invalid '+modernName+' configuration')
      }
    }
    return Deno.env.get(legacyName)
  }

  const publishableKey = envKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_ANON_KEY')
  const secretKey = envKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !publishableKey || !secretKey) {
    console.error('delete-account: missing Supabase server configuration')
    return json({ error: 'server_configuration' }, 500)
  }

  let payload: { confirm?: string } = {}
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }
  if (payload.confirm !== 'DELETE_MY_ACCOUNT') return json({ error: 'confirmation_required' }, 400)

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const token = authorization.replace('Bearer ', '')
  const { data: userData, error: userError } = await userClient.auth.getUser(token)
  const user = userData?.user
  if (userError || !user) return json({ error: 'unauthorized' }, 401)

  const { error: signOutError } = await userClient.auth.signOut({ scope: 'global' })
  if (signOutError) {
    console.error('delete-account: session revocation failed', signOutError.code || signOutError.name)
    return json({ error: 'session_revocation_failed' }, 500)
  }

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id, false)
  if (deleteError) {
    console.error('delete-account: admin deletion failed', deleteError.code || deleteError.name)
    return json({ error: 'account_deletion_failed' }, 500)
  }

  return json({ deleted: true })
})
