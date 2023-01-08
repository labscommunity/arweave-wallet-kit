import { comparePermissions } from "../../utils";
import { useEffect, useState } from "react";
import useActiveStrategy from "../strategy";
import usePermissions from "../permissions";
import useGlobalState from "../global";

export default function useConnected() {
  const [connected, setConnected] = useState(false);
  const strategy = useActiveStrategy();
  const givenPermissions = usePermissions();

  const { state } = useGlobalState();
  const { permissions: requiredPermissions, ensurePermissions } = state.config;

  useEffect(() => {
    if (!strategy) {
      return setConnected(false);
    }

    if (ensurePermissions) {
      setConnected(comparePermissions(requiredPermissions, givenPermissions));
    } else {
      setConnected(givenPermissions.length > 0);
    }
  }, [strategy, givenPermissions, requiredPermissions, ensurePermissions]);

  return connected;
}
