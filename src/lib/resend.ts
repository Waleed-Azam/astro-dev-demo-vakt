/** Resend helper (fetch-based, Cloudflare-safe) with mock mode for local dev. */
import type { WaitlistInput } from './validation';

export interface SendResult { ok: boolean; id?: string; mocked?: boolean; error?: string }

export async function sendWaitlistEmail(input: WaitlistInput, env: Record<string, string | undefined>): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL ?? 'hello@example.com';
  const from = env.CONTACT_FROM_EMAIL ?? 'website@vakt.demo';
  const subject = `Vakt waitlist — ${input.name.trim()} (${input.email.trim()})`;
  const text = `Name: ${input.name}\nEmail: ${input.email}\nCompany: ${input.company || '—'}\nTeam size: ${input.teamSize || '—'}\n`;
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  const html = `<div style="font-family:sans-serif"><h2>New waitlist signup</h2><p><strong>${esc(input.name)}</strong> &lt;${esc(input.email)}&gt;<br/>Company: ${esc(input.company || '—')} · Team: ${esc(input.teamSize || '—')}</p></div>`;

  if (!apiKey || apiKey.includes('demo') || apiKey.includes('replace_me')) {
    console.log('[resend:mock] waitlist email:', { to, from, subject });
    return { ok: true, mocked: true, id: `mock_${Date.now()}` };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: input.email.trim(), subject, text, html }),
  });
  if (!res.ok) return { ok: false, error: `Email provider error (${res.status}). Please try again.` };
  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return { ok: true, id: data.id };
}
