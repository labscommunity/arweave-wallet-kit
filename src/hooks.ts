import { useContext, useEffect, useMemo, useState } from "react";
import context, { defaultState } from "./context";
import { comparePermissions } from "./utils";
import strategies from "./strategies";

export function useGlobalState() {
  const ctx = useContext(context);

  const state = useMemo(() => (ctx || { state: defaultState, dispatch: () => {} }), [ctx]);

  return state;
}

export function useActiveStrategy() {
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

/**
 * @param ensurePermissions Return "connected" as true only if the app has the required permissions
 */
export function useConnection(ensurePermissions = false) {
  // global context
  const { state: { connectionData }, dispatch } = useGlobalState();

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

          return setConnected(comparePermissions(connectionData.requiredPermissions, permissions));
        } catch {
          setConnected(false);
        }
      } else {
        return setConnected(true);
      }
    })();
  }, [strategy, connectionData.requiredPermissions, ensurePermissions]);

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
