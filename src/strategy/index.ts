import ArweaveWebWalletStrategy from "./strategies/ArweaveWebWallet";
import BrowserWalletStrategy from "./strategies/BrowserWallet";
import ArConnectStrategy from "./strategies/ArConnect";

import type { PermissionType } from "arconnect";
import { comparePermissions } from "../utils";
import type Strategy from "./Strategy";

const strategies: Strategy[] = [
  new ArConnectStrategy(),
  new ArweaveWebWalletStrategy(),
  new BrowserWalletStrategy()
];

export const STRATEGY_STORE = "wallet_kit_strategy_id";

/**
 * On page mount, sync the logged in strategy
 *
 * @param requiredPermissions The permissions required by this app
 * @param enforcePermissions Should the strategy be active only if the required permissions are gived or not
 */
export async function syncStrategies(
  requiredPermissions: PermissionType[],
  enforcePermissions: boolean
) {
  let activeStrategy: string | false = localStorage?.getItem(STRATEGY_STORE) || false;

  if (activeStrategy && !!getStrategy(activeStrategy)) {
    return getStrategy(activeStrategy);
  } else {
    for (const strategy of strategies) {
      const permissions = await strategy.getPermissions();

      if (!enforcePermissions && permissions.length > 0) {
        saveStrategy(strategy.id);
        return getStrategy(strategy.id);
      } else if (
        enforcePermissions &&
        comparePermissions(requiredPermissions, permissions)
      ) {
        saveStrategy(strategy.id);
        return getStrategy(strategy.id);
      }
    }

    return false;
  }
}

/**
 * Save active strategy to localstorage
 */
export function saveStrategy(active: string) {
  if (!localStorage) {
    return;
  }

  localStorage.setItem(STRATEGY_STORE, active);
}

/**
 * Get strategy by id
 */
export function getStrategy(id: string) {
  return strategies.find((s) => s.id === id);
}

export default strategies;
