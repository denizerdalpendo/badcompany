// Derive an account/org identifier from an email address.
// `deniz@acme.io` -> `acme`, `someone@acme.co.uk` -> `acme`.
// Falls back to '' for missing or malformed input.
export const accountFromEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const at = email.indexOf('@');
  if (at < 0 || at === email.length - 1) return '';
  const domain = email.slice(at + 1).toLowerCase();
  const [first] = domain.split('.').filter(Boolean);
  return first || '';
};
