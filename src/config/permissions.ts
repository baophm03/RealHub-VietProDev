// Permission helpers using "module:action" string keys.
// Matrix data itself comes from GET /api/permissions (BE source of truth).

export type PermissionKey = string; // "MODULE:ACTION"

export const permKey = (module: string, action: string): PermissionKey =>
  `${module}:${action}`;

// Helper: build a Set of "module:action" strings from a permissions array
export function buildPermissionSet(
  permissions: Array<{ module: string; action: string }>,
): Set<PermissionKey> {
  return new Set(permissions.map((p) => permKey(p.module, p.action)));
}

// Helper: check if a permission exists in the set
export function hasPermissionInSet(
  set: Set<PermissionKey>,
  module: string,
  action: string,
): boolean {
  return set.has(permKey(module, action));
}

// Helper: toggle a permission in the set (returns a new Set)
export function togglePermissionInSet(
  set: Set<PermissionKey>,
  module: string,
  action: string,
): Set<PermissionKey> {
  const next = new Set(set);
  const key = permKey(module, action);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}
