import strategies from "../strategies";
import useGlobalState from "./global";
import { useMemo } from "react";

export default function useActiveStrategy() {
  // global context
  const { state } = useGlobalState();

  const strategy = useMemo(() => {
    if (!state.activeStrategy) {
      return undefined;
    }

    return strategies.find((strat) => strat.id === state.activeStrategy);
  }, [state.activeStrategy]);

  return strategy;
}