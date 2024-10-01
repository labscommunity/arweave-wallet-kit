import type { ConnectMsg } from "./connection/connect";
import { STRATEGY_STORE } from "../strategy";
import useActiveStrategy from "./strategy";
import useGlobalState from "./global";
import { useEffect, useRef } from "react";
import { comparePermissions } from "../utils";
import type { PermissionType } from "arconnect";

/**
 * Given permissions hook
 */
export default function usePermissions(): PermissionType[] {
  const { state, dispatch } = useGlobalState();
  const strategy = useActiveStrategy();

  // no need to add the strategy to the
  // dependencies of this "useEffect" hook
  // because we don't need to sync the
  // permissions here.
  // the permissions array gets synced anyway
  // in the "useSyncPermissions" hook,
  // mounted in the Provider.
  // here we just sync the permissions on
  // mount, so the hook is up to date when
  // initialised
  useEffect(() => {
    (async () => {
      if (!strategy) return;

      // dispatch to the global state to update
      dispatch({
        type: "UPDATE_PERMISSIONS",
        payload: await strategy.getPermissions()
      });
    })();
  }, [dispatch]);

  return state.givenPermissions;
}

// sync permissions in global state
export function useSyncPermissions() {
  const isReconnecting = useRef(false);
  const { state, dispatch } = useGlobalState();
  const strategy = useActiveStrategy();
  const { permissions: requiredPermissions, ensurePermissions } = state.config;

  useEffect(() => {
    // sync permissions
    async function sync() {
      if (!strategy) {
        fixupDisconnection();
        return dispatch({
          type: "UPDATE_PERMISSIONS",
          payload: []
        });
      }

      try {
        const permissions = await strategy.getPermissions();
        const hasPermissions = comparePermissions(
          requiredPermissions,
          permissions
        );

        dispatch({
          type: "UPDATE_PERMISSIONS",
          payload: permissions
        });

        if (requiredPermissions.length === 0 && ensurePermissions) {
          fixupDisconnection();
          return;
        }

        if (!hasPermissions && ensurePermissions && !isReconnecting.current) {
          isReconnecting.current = true;
          await strategy.connect(
            requiredPermissions,
            state.config.appInfo,
            state.config.gatewayConfig
          );
        }

        if (permissions.length === 0) {
          fixupDisconnection();
        }
      } catch {
        fixupDisconnection();
        dispatch({
          type: "UPDATE_PERMISSIONS",
          payload: []
        });
      }
    }

    // sync on connection
    async function msgSync(e: MessageEvent<ConnectMsg>) {
      // validate message
      if (e.data.type !== "connect_result") {
        return;
      }

      await sync();
    }

    // if a disconnection was not executed appropriately,
    // we need to fix up the global state (active address, etc.)
    // in this function, we check for a broken disconnection,
    // and remove remaining states if necessary
    function fixupDisconnection() {
      // check if disconnection was broken
      // (meaning that some fields has been
      // left in the state)
      if (!state.activeAddress && !state.activeStrategy) {
        return;
      }

      // signal correct disconnection
      dispatch({ type: "DISCONNECT" });

      // remove active strategy
      localStorage.removeItem(STRATEGY_STORE);
    }

    // initial sync
    sync();

    // events where we need to sync
    addEventListener("arweaveWalletLoaded", sync);
    addEventListener("focus", sync);
    addEventListener("message", msgSync);

    // add sync on address change if
    // there is an active strategy
    let addressChangeSync: any;

    if (strategy) {
      addressChangeSync = strategy.addAddressEvent(sync);
    }

    return () => {
      // remove events
      removeEventListener("arweaveWalletLoaded", sync);
      removeEventListener("focus", sync);
      removeEventListener("message", msgSync);

      // remove sync on address change
      // if there was a listener added
      if (strategy && addressChangeSync) {
        strategy.removeAddressEvent(addressChangeSync);
      }
    };
  }, [strategy, requiredPermissions, dispatch]);
}
