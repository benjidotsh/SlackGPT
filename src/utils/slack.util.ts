import { requiredScopes } from '../services/index.js';

export function areRequiredScopesPresent(scopes: string[]): boolean {
  return requiredScopes.every((scope) => scopes.includes(scope));
}
