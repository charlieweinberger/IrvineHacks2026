// Predefined list of officer email addresses
export const OFFICER_EMAILS: Set<string> = new Set([
  // Add officer emails here
  "alex@example.com",
  "jordan@example.com",
]);

export function isOfficerEmail(email: string): boolean {
  return OFFICER_EMAILS.has(email.toLowerCase());
}
