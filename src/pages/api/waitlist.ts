/**
 * POST /api/waitlist — validate → Resend email → Railway backup (best-effort).
 * Runs as a Cloudflare Function (hybrid output: only /api/* is server-side).
 */
import type { APIRoute } from 'astro';
import { validateWaitlist, isValid, type WaitlistInput } from '../../lib/validation';
import { sendWaitlistEmail } from '../../lib/resend';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env ?? {};
  const metaEnv = import.meta.env as unknown as Record<string, string>;
  const env: Record<string, string | undefined> = { ...(process.env as Record<string, string>), ...metaEnv, ...runtimeEnv };

  let input: WaitlistInput;
  try {
    const ct = request.headers.get('content-type') ?? '';
    input = ct.includes('application/json')
      ? ((await request.json()) as WaitlistInput)
      : (Object.fromEntries(await request.formData()) as unknown as WaitlistInput);
  } catch {
    return json({ ok: false, error: 'Could not read your submission. Please try again.' }, 400);
  }

  if (input.website?.trim()) { await sleep(400); return json({ ok: true, mocked: true }); } // honeypot

  const errors = validateWaitlist(input ?? ({} as WaitlistInput));
  if (!isValid(errors)) return json({ ok: false, errors }, 422);

  const result = await sendWaitlistEmail(input, env);
  if (!result.ok) return json({ ok: false, error: result.error ?? 'Email failed.' }, 502);

  backupToRailway(input, env).catch((err) => console.error('[railway:backup-failed]', err));
  return json({ ok: true, mocked: result.mocked ?? false, id: result.id });
};

export const GET: APIRoute = async () => json({ ok: false, error: 'Use POST with { name, email }.' }, 405);

async function backupToRailway(input: WaitlistInput, env: Record<string, string | undefined>): Promise<void> {
  const base = env.RAILWAY_API_URL ?? env.PUBLIC_RAILWAY_API_URL;
  if (!base) return;
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 4000);
  try {
    await fetch(`${base.replace(/\/$/, '')}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.email?.trim(), name: input.name?.trim(), company: input.company?.trim() || null, source: 'vakt-waitlist' }),
      signal: c.signal,
    });
  } finally { clearTimeout(t); }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
