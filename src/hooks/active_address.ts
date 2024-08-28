import { useEffect, useState } from "react";
import useActiveStrategy from "./strategy";
import useGlobalState from "./global";

/**
 * Active address in the wallet
 */
export default function useAddress() {
  // global context
  const { state } = useGlobalState();

  return state?.activeAddress;
}

// sync address in global state
export async function useSyncAddress() {
  const strategy = useActiveStrategy();
  const { dispatch } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (!strategy) return;

      // get active address and sync the global state
      const sync = async () => {
        try {
          const address = await strategy.getActiveAddress();

          dispatch({
            type: "UPDATE_ADDRESS",
            payload: address
          });
        } catch (e: any) {
          console.error(
            `[Arweave Wallet Kit] Failed to sync address\n${e?.message || e}`
          );
        }
      };

      await sync();

      const listener = strategy.addAddressEvent?.((addr) =>
        dispatch({
          type: "UPDATE_ADDRESS",
          payload: addr
        })
      );

      // check address change on focus
      addEventListener("focus", sync);

      return () => {
        if (listener && strategy.removeAddressEvent) {
          strategy.removeAddressEvent(listener);
        }

        removeEventListener("focus", sync);
      };
    })();
  }, [strategy, dispatch]);
}

/**
 * Public key of the active wallet
 */
export function usePublicKey() {
  const [publicKey, setPublicKey] = useState<string>();
  const strategy = useActiveStrategy();
  const address = useAddress();

  useEffect(() => {
    (async () => {
      if (!strategy || !strategy.getActivePublicKey) return;

      setPublicKey(await strategy.getActivePublicKey());
    })();
  }, [address, strategy]);

  return publicKey;
}
