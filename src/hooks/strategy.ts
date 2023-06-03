import { getStrategy, STRATEGY_STORE, syncStrategies } from "../strategy";
import type { Actions, Config } from "../context/faces";
import { useEffect, useMemo } from "react";
import useGlobalState from "./global";

/**
 * Active strategy (wallet) identifier
 */
export function useStrategy() {
  // global context
  const { state } = useGlobalState();
  const val = useMemo(() => state.activeStrategy, [state]);

  return val;
}

// active strategy instance
export default function useActiveStrategy() {
  // global context
  const activeStrategy = useStrategy();

  const strategy = useMemo(() => {
    if (!activeStrategy) {
      return undefined;
    }

    return getStrategy(activeStrategy);
  }, [activeStrategy]);

  return strategy;
}

/**
 * Strategy API
 */
export function useApi() {
  const strategy = useActiveStrategy();
  const api = useMemo(() => {
    if (!strategy) return undefined;

    // only return api functions that would
    // not break the kit
    // e.g.: we don't return connect(),
    // as it needs it's implementation
    // from "useConnection"
    const {
      getActiveAddress,
      getAllAddresses,
      sign,
      getPermissions,
      getWalletNames,
      encrypt,
      decrypt,
      getArweaveConfig,
      signature,
      getActivePublicKey,
      addToken,
      dispatch
    } = strategy;

    return {
      getActiveAddress,
      getAllAddresses,
      sign,
      getPermissions,
      getWalletNames,
      encrypt,
      decrypt,
      getArweaveConfig,
      signature,
      getActivePublicKey,
      addToken,
      dispatch
    };
  }, [strategy]);

  return api;
}

// sync active strategy in global state
export function useSyncStrategy(
  config: Config,
  dispatch: (value: Actions) => void
) {
  // try to get an active strategy on mount
  useEffect(() => {
    (async () => {
      const activeStrategy = await syncStrategies(
        config.permissions,
        !!config.ensurePermissions
      );

      if (!!activeStrategy) {
        await activeStrategy.sync();
      }

      return dispatch({
        type: "UPDATE_STRATEGY",
        payload: (!!activeStrategy && activeStrategy.id) || false
      });
    })();
  }, []);
}
