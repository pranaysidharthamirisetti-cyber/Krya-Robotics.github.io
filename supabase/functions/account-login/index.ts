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
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return respond({ ok: false, error: 'Sign-in service is not configured.' }, 500);
  }

  let email: string;
  let password: string;
  try {
    const body = await request.json();
    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.password.length === 0 ||
      body.password.length > 1024
    ) {
      return respond({ ok: false, error: 'Enter a valid email and password.' }, 400);
    }
    email = body.email.trim().toLowerCase();
    password = body.password;
    if (!email || email.length > 320) {
      return respond({ ok: false, error: 'Enter a valid email and password.' }, 400);
    }
  } catch {
    return respond({ ok: false, error: 'Invalid request.' }, 400);
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  const successful = !error && Boolean(data.session && data.user);
  const { error: auditError } = await adminClient.from('login_events').insert({
    email,
    success: successful,
  });

  if (auditError) {
    console.error('Unable to write the sign-in audit event.', auditError.message);
    return respond({ ok: false, error: 'Sign-in could not be completed. Please try again later.' }, 500);
  }
  if (!successful) return respond({ ok: false, error: 'Invalid email or password.' });

  return respond({ ok: true, session: data.session });
});
