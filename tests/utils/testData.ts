export function uniqueEmail(prefix = 'qa.portfolio'): string {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;
}
