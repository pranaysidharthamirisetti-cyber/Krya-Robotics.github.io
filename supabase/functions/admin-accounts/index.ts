import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function respond(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return respond({ ok: false, error: 'Method not allowed.' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return respond({ ok: false, error: 'Account administration is not configured.' }, 500);
  }

  const authorization = request.headers.get('Authorization');
  const token = authorization?.replace(/^Bearer\s+/i, '');
  if (!token || token === authorization) return respond({ ok: false, error: 'Authentication required.' }, 401);

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await client.auth.getUser(token);
  if (authError || !authData.user) return respond({ ok: false, error: 'Authentication required.' }, 401);
  if (authData.user.app_metadata?.role !== 'admin') {
    return respond({ ok: false, error: 'Administrator access required.' }, 403);
  }

  let body: { action?: string; email?: string; userId?: string; active?: boolean };
  try {
    body = await request.json();
  } catch {
    return respond({ ok: false, error: 'Invalid request.' }, 400);
  }

  if (body.action === 'list') {
    const [{ data: usersData, error: usersError }, { data: eventsData, error: eventsError }] = await Promise.all([
      client.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      client.from('login_events').select('email, success, occurred_at').order('occurred_at', { ascending: false }).limit(100),
    ]);
    if (usersError || eventsError) {
      console.error('Unable to load account administration data.', usersError?.message, eventsError?.message);
      return respond({ ok: false, error: 'Unable to load account administration data.' }, 500);
    }

    return respond({
      ok: true,
      users: usersData.users.map((user) => ({
        id: user.id,
        email: user.email ?? '',
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
        bannedUntil: user.banned_until ?? null,
        role: typeof user.app_metadata?.role === 'string' ? user.app_metadata.role : null,
      })),
      loginEvents: eventsData.map((event) => ({
        email: event.email,
        success: event.success,
        occurredAt: event.occurred_at,
      })),
    });
  }

  if (body.action === 'invite') {
    if (typeof body.email !== 'string' || body.email.trim().length > 320) {
      return respond({ ok: false, error: 'Enter a valid email address.' }, 400);
    }
    const { error: inviteError } = await client.auth.admin.inviteUserByEmail(body.email.trim().toLowerCase());
    if (inviteError) return respond({ ok: false, error: inviteError.message }, 400);
    return respond({ ok: true });
  }

  if (body.action === 'set-status') {
    if (
      typeof body.userId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.userId) ||
      typeof body.active !== 'boolean'
    ) {
      return respond({ ok: false, error: 'Invalid account status request.' }, 400);
    }

    const { data: target, error: targetError } = await client.auth.admin.getUserById(body.userId);
    if (targetError || !target.user) return respond({ ok: false, error: 'Account not found.' }, 404);
    if (target.user.app_metadata?.role === 'admin') {
      return respond({ ok: false, error: 'Administrator accounts are protected from this action.' }, 400);
    }

    const { error: statusError } = await client.auth.admin.updateUserById(body.userId, {
      ban_duration: body.active ? 'none' : '876000h',
    });
    if (statusError) return respond({ ok: false, error: 'Unable to update this account.' }, 400);
    return respond({ ok: true });
  }

  return respond({ ok: false, error: 'Unknown account action.' }, 400);
});
