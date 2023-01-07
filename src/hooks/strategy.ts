import { getStrategy, STRATEGY_STORE, syncStrategies } from "../strategy";
import { Actions, Config } from "../context/faces";
import { useEffect, useMemo } from "react";
import useGlobalState from "./global";

/**
 * Active strategy (wallet) identifier
 */
export function useStrategy() {
  // global context
  const { state } = useGlobalState();

  return state.activeStrategy;
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

// sync active strategy in global state
export function useSyncStrategy(config: Config, dispatch: (value: Actions) => void) {
  // try to get an active strategy on mount
  useEffect(() => {
    (async () => {
      let activeStrategy: string | false = localStorage?.getItem(STRATEGY_STORE) || false;

      if (!activeStrategy) {
        activeStrategy = await syncStrategies(
          config.permissions,
          !!config.ensurePermissions
        );
      }

      return dispatch({
        type: "UPDATE_STRATEGY",
        payload: activeStrategy
      });
    })();
  }, []);
}
