import { Actions } from "../context/faces";
import { getStrategy } from "../strategy";
import useGlobalState from "./global";
import { useEffect } from "react";

/**
 * Active address hook
 */
export default function useAddress() {
  // global context
  const { state } = useGlobalState();

  return state?.walletState?.activeAddress;
}

// sync address in global state
export async function useSyncAddress(activeStrategy: string | false, dispatch: (value: Actions) => void) {
  useEffect(() => {
    (async () => {
      if (!activeStrategy) {
        return;
      }

      const strategy = getStrategy(activeStrategy);

      if (!strategy) {
        return;
      }

      // get active address and sync the global state
      const sync = async () => {
        try {
          const address = await strategy.getActiveAddress();
  
          dispatch({
            type: "UPDATE_ADDRESS",
            payload: address
          });
        } catch (e: any) {
          console.error(`[ArConnect Kit] Failed to sync address\n${e?.message || e}`);
        }
      };

      await sync();

      const listener = strategy.addAddressEvent((addr) => dispatch({
        type: "UPDATE_ADDRESS",
        payload: addr
      }));

      // check address change on focus
      addEventListener("focus", sync);

      return () => {
        strategy.removeAddressEvent(listener);
        removeEventListener("focus", sync);
      };
    })();
  }, [activeStrategy]);
}
