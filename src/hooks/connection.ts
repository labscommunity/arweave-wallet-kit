import { useEffect, useMemo, useState } from "react";
import type { PermissionType } from "arconnect";
import { comparePermissions } from "../utils";
import { STRATEGY_STORE } from "../strategy";
import useActiveStrategy from "./strategy";
import useGlobalState from "./global";
import { nanoid } from "nanoid";

/**
 * Base connection hook
 */
export default function useConnection(v?: string) {
  // global context
  const { state, dispatch } = useGlobalState();

  // active strategy
  const strategy = useActiveStrategy();

  // permissions
  const [givenPermissions, setGivenPerms] = useState<PermissionType[]>([]);

  useEffect(() => {
    if (!strategy) return;

    strategy.getPermissions()
      .then((res) => setGivenPerms(res))
      .catch();
  }, [strategy]);

  /** Is the app connected to a wallet */
  const connected = useMemo(() => {
    if (state.config.ensurePermissions) {
      return comparePermissions(state.config.permissions, givenPermissions);
    }

    return givenPermissions.length > 0;
  }, [state, givenPermissions]);

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
        async (e: MessageEvent<ConnectMsg>) => {
          // check if the connection id is the same
          if (e.data?.connectId !== connectId) return;

          // remove connection id
          dispatch({
            type: "SET_CONNECT_ID",
            payload: undefined
          });

          // handle result
          if (e.data.res) {
            if (strategy) {
              setGivenPerms(await strategy.getPermissions());
            }

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
    if (!strategy) {
      throw new Error("[ArConnect Kit] Not yet connected");
    }

    try {
      await strategy.disconnect();

      setGivenPerms([]);
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

interface ConnectMsg {
  connectId?: string;
  res: boolean;
}
