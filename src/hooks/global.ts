import context, { defaultState } from "../context";
import { useContext, useMemo } from "react";

export default function useGlobalState() {
  const ctx = useContext(context);

  const state = useMemo(
    () => ctx || { state: defaultState, dispatch: () => {} },
    [ctx]
  );

  return state;
}
