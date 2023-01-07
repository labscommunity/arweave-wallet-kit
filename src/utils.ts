import { PermissionType } from "arconnect"

/**
 * Compare two permission arrays
 * 
 * @param required The permissions that should be in the second array
 * @param existing The permissions the app has
 */
export function comparePermissions(required: PermissionType[], existing: PermissionType[]) {
  for (const permission of required) {
    if (!existing.includes(permission)) {
      return false;
    }
  }

  return true;
}
