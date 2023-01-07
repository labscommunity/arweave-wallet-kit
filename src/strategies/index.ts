import { comparePermissions } from "../utils";
import ArConnectStrategy from "./ArConnect";
import { PermissionType } from "arconnect";
import Strategy from "./Strategy";

const strategies: Strategy[] = [
  new ArConnectStrategy()
];

export const STRATEGY_STORE = "arconnect_kit_strategy_id";

/**
 * On page mount, sync the logged in strategy
 * 
 * @param requiredPermissions The permissions required by this app
 * @param enforcePermissions Should the strategy be active only if the required permissions are gived or not
 */
export async function syncStrategies(requiredPermissions: PermissionType[], enforcePermissions: boolean) {
  for (const strategy of strategies) {
    const permissions = await strategy.getPermissions();

    if (!enforcePermissions && permissions.length > 0) {
      saveStrategy(strategy.id);
      return strategy.id;
    } else if (enforcePermissions && comparePermissions(requiredPermissions, permissions)) {
      saveStrategy(strategy.id);
      return strategy.id;
    }
  }

  return false;
}

/**
 * Save active strategy to localstorage
 */
export async function saveStrategy(active: string) {
  if (!localStorage) {
    return;
  }

  localStorage.setItem(STRATEGY_STORE, active);
}

export default strategies;
