import type ArweaveWebWalletStrategy from "../strategy/strategies/ArweaveWebWallet";
import type BrowserWalletStrategy from "../strategy/strategies/BrowserWallet";
import type ArConnectStrategy from "../strategy/strategies/ArConnect";
import type OthentStrategy from "../strategy/strategies/Othent";
import type Strategy from "../strategy/Strategy";
import { getStrategy } from "../strategy";
import useGlobalState from "./global";
import { useMemo } from "react";

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
  const api = useMemo<PossibleApis | undefined>(() => {
    if (!strategy) return undefined;

    // only return api functions that would
    // not break the kit
    // e.g.: we don't return connect(),
    // as it needs it's implementation
    // from "useConnection"
    // @ts-expect-error
    const apiObj: PossibleApis = strategy;
    const omit = ["name", "description", "theme", "logo", "url", "resumeSession", "isAvailable", "addAddressEvent", "removeAddressEvent", "connect"];
    
    for (const key in strategy) {
      if (!omit.includes(key)) continue;
      
      delete apiObj[key];
    }
    
    return apiObj;
  }, [strategy]);

  return api;
}

type PossibleApis = ApiType<ArConnectStrategy> | ApiType<ArweaveWebWalletStrategy> | ApiType<BrowserWalletStrategy> | ApiType<OthentStrategy>;
type ApiType<S = Strategy> = Omit<S, "name" | "description" | "theme" | "logo" | "url" | "resumeSession" | "isAvailable" | "addAddressEvent" | "removeAddressEvent" | "connect"> & {
  [functionName: string]: (...props: unknown[]) => Promise<unknown>;
};
