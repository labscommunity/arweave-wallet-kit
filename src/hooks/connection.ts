import { comparePermissions } from "../utils";
import { STRATEGY_STORE } from "../strategy";
import { useEffect, useState } from "react";
import useActiveStrategy from "./strategy";
import useGlobalState from "./global";
import { nanoid } from "nanoid";

/**
 * Base connection hook
 */
export default function useConnection() {
  // global context
  const { state, dispatch } = useGlobalState();
  const { ensurePermissions, permissions: requiredPermissions } = state.config;

  /** Is the app connected to a wallet */
  const [connected, setConnected] = useState(false);

  // active strategy
  const strategy = useActiveStrategy();

  useEffect(() => {
    (async () => {
      if (!strategy) {
        return setConnected(false);
      }

      try {
        const permissions = await strategy.getPermissions();

        if (ensurePermissions) {
          setConnected(comparePermissions(requiredPermissions, permissions));
        } else {
          setConnected(permissions.length > 0);
        }
      } catch {
        setConnected(false);
      }
    })();
  }, [strategy, requiredPermissions, ensurePermissions]);

  /**
   * Open connection modal
   */
  const connect = () =>
    new Promise<void>((resolve, reject) => {
      if (connected) {
        return reject("[ArConnect Kit] Already connected");
      }

      const connectId = nanoid();

      // update global state
      dispatch({
        type: "SET_CONNECT_ID",
        payload: connectId
      });
      dispatch({
        type: "OPEN_MODAL",
        payload: "connect"
      });

      // wait for confirmation
      addEventListener(
        "message",
        (
          e: MessageEvent<{
            connectId?: string;
            res: boolean;
          }>
        ) => {
          // check if the connection id is the same
          if (e.data?.connectId !== connectId) return;

          // remove connection id
          dispatch({
            type: "SET_CONNECT_ID",
            payload: undefined
          });

          // handle result
          if (e.data.res) {
            setConnected(true);
            resolve();
          } else {
            reject("[ArConnect Kit] User cancelled the connection");
          }
        }
      );
    });

  /**
   * Disconnect from active wallet
   */
  async function disconnect() {
    if (!connected || !strategy) {
      throw new Error("[ArConnect Kit] Not yet connected");
    }

    try {
      await strategy.disconnect();

      localStorage.removeItem(STRATEGY_STORE);
      dispatch({ type: "DISCONNECT" });
    } catch (e: any) {
      throw new Error(
        "[ArConnect Kit] Could not disconnect\n" + (e?.message || e)
      );
    }
  }

  return {
    connected,
    connect,
    disconnect
  };
}
