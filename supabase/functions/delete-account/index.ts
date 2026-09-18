// delete-account — a Supabase Edge Function.
//
// WHY THIS EXISTS: deleting a login needs the project's secret (service) key, which
// bypasses every Row Level Security rule and must never be in a web page. So the
// browser asks THIS function, which runs on Supabase's servers where the secret key
// is available as an environment variable, and it deletes exactly one user: the one
// whose sign-in token made the request. Deleting the login cascades to their
// `profiles` and `catalogs` rows (see the "on delete cascade" in the table SQL).
//
// Deploy: Supabase dashboard → Edge Functions → Deploy a new function → name it
// `delete-account`, paste this file, deploy. Nothing else to configure: SUPABASE_URL
// and the service key are injected automatically. The app calls it with
// sb.functions.invoke("delete-account"), which attaches the caller's token.

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return new Response("Unauthorized", { status: 401, headers: cors });

  // The secret key: newer projects expose it as SUPABASE_SECRET_KEY, older ones as
  // SUPABASE_SERVICE_ROLE_KEY. Either works; both bypass RLS, which is the point here.
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!secret || !url) return new Response("Server not configured", { status: 500, headers: cors });

  const admin = createClient(url, secret, { auth: { persistSession: false } });

  // Who is asking? Verify the caller's token rather than trusting anything in the body.
  const { data: { user }, error: whoErr } = await admin.auth.getUser(token);
  if (whoErr || !user) return new Response("Unauthorized", { status: 401, headers: cors });

  // Delete only that user. Their profile and catalog rows go with them (cascade).
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return new Response(error.message, { status: 500, headers: cors });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
