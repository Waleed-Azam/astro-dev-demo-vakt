/** Shared waitlist validation — imported by browser form AND API route. */
export interface WaitlistInput {
  name: string;
  email: string;
  company?: string;
  teamSize?: string;
  website?: string; // honeypot
}

export function validateWaitlist(input: WaitlistInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!input.name?.trim() || input.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!input.email?.trim() || !emailRe.test(input.email.trim())) errors.email = 'Please enter a valid work email.';
  if (input.website?.trim()) errors.website = 'Spam detected.';
  return errors;
}

export const isValid = (e: Record<string, string>) => Object.keys(e).length === 0;
