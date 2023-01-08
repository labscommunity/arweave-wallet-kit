import { comparePermissions } from "../../utils";
import { useEffect, useState } from "react";
import type { ConnectMsg } from "./connect";
import useActiveStrategy from "../strategy";
import useGlobalState from "../global";

export default function useConnected() {
  const [connected, setConnected] = useState(false);
  const strategy = useActiveStrategy();
  const { state } = useGlobalState();
  const { permissions, ensurePermissions } = state.config;

  useEffect(() => {
    // check if there's a strategy active
    if (!strategy) {
      return setConnected(false);
    }

    // sync connection status
    async function sync() {
      if (!strategy) {
        return setConnected(false);
      }

      // get permissions given by the user
      const givenPermissions = await strategy.getPermissions();

      if (ensurePermissions) {
        setConnected(
          comparePermissions(permissions, givenPermissions)
        );
      } else {
        setConnected(givenPermissions.length > 0);
      }
    }

    // sync on connect message
    async function msgSync(e: MessageEvent<ConnectMsg>) {
      // validate message
      if (e.data.type !== "connect_result") {
        return;
      }

      // set connection to false on unsucessfull connection
      if (!e.data.res) {
        return setConnected(false);
      }

      // call sync
      await sync();
    }

    sync();
    addEventListener("arweaveWalletLoaded", sync);
    addEventListener("focus", sync);
    addEventListener("message", msgSync);

    const addressListener = strategy.addAddressEvent(sync);

    return () => {
      removeEventListener("arweaveWalletLoaded", sync);
      removeEventListener("focus", sync);
      removeEventListener("message", msgSync);

      if (strategy) {
        strategy.removeAddressEvent(addressListener);
      }
    };
  }, [strategy, permissions, ensurePermissions]);

  return connected;
}
