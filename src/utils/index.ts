export * from './dynamodb.js';

export function prefixObjectKeys(
  object: object,
  prefix: string
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [`${prefix}${key}`, value])
  );
}
