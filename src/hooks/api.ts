import { useMemo } from "react";
import useActiveStrategy from "./strategy";

export default function useApi() {
  const strategy = useActiveStrategy();

  const api = useMemo(() => {
    if (!strategy) return undefined;

    const {
      sign,
      getPermissions,
      encrypt,
      decrypt,
      getArweaveConfig,
      signature,
      addToken,
      dispatch
    } = strategy;

    return {
      sign,
      getPermissions,
      encrypt,
      decrypt,
      getArweaveConfig,
      signature,
      addToken,
      dispatch
    };
  }, [strategy]);

  return api;
}
