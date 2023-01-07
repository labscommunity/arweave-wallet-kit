import strategies from "../strategies";
import useGlobalState from "./global";
import { useMemo } from "react";

/**
 * Get active strategy identifier
 */
export function useStrategy() {
  // global context
  const { state } = useGlobalState();

  return state.activeStrategy;
}

export default function useActiveStrategy() {
  // global context
  const activeStrategy = useStrategy();

  const strategy = useMemo(() => {
    if (!activeStrategy) {
      return undefined;
    }

    return strategies.find((strat) => strat.id === activeStrategy);
  }, [activeStrategy]);

  return strategy;
}
