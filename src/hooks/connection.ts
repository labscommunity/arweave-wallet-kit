import { comparePermissions } from "../utils";
import { useEffect, useState } from "react";
import useActiveStrategy from "./strategy";
import useGlobalState from "./global";

export default function useConnection() {
  // global context
  const { state, dispatch } = useGlobalState();
  const { ensurePermissions, permissions: requiredPermissions } = state.config;

  // permissions
  const [connected, setConnected] = useState(false);

  // active strategy
  const strategy = useActiveStrategy();

  useEffect(() => {
    (async () => {
      if (!strategy) {
        return setConnected(false);
      }

      if (ensurePermissions) {
        try {
          const permissions = await strategy.getPermissions();

          return setConnected(comparePermissions(requiredPermissions, permissions));
        } catch {
          setConnected(false);
        }
      } else {
        return setConnected(true);
      }
    })();
  }, [strategy, requiredPermissions, ensurePermissions]);

  /**
   * Open connection modal
   */
  async function connect() {
    if (connected) {
      throw new Error("[ArConnect Kit] Already connected")
    }

    dispatch({
      type: "OPEN_MODAL",
      payload: "connect"
    });
  }

  /**
   * Disconnect from active wallet
   */
  async function disconnect() {
    if (!connected || !strategy) {
      throw new Error("[ArConnect Kit] Not yet connected");
    }

    try {
      await strategy.disconnect();
      dispatch({ type: "DISCONNECT" });
    } catch (e: any) {
      throw new Error("[ArConnect Kit] Could not disconnect\n" + (e?.message || e));
    }
  }

  return {
    connected,
    connect,
    disconnect
  };
}
