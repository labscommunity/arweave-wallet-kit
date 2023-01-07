import { useEffect, useState } from "react";
import { getStrategy } from "../strategy"
import useAddress from "./active_address";
import useGlobalState from "./global";

export default function useAddresses() {
  const [addresses, setAddresses] = useState<string[]>([]);

  const activeAddress = useAddress();
  const { state } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (!state?.activeStrategy) {
        return setAddresses([]);
      }

      const strategy = getStrategy(state.activeStrategy);

      if (!strategy) {
        return setAddresses([]);
      }

      // sync with wallet
      const sync = async () => {
        try {
          setAddresses(await strategy.getAllAddresses());
        } catch (e: any) {
          console.error(`[ArConnect Kit] Failed to sync addresses\n${e?.message || e}`);
        }
      };

      await sync();

      // sync on focus
      addEventListener("focus", sync);

      return () => removeEventListener("focus", sync);
    })();
  }, [activeAddress, state]);

  return addresses;
}

export function useWalletNames() {
  const [names, setNames] = useState<{ [addr: string]: string }>({});
  const addresses = useAddresses();
  const { state } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (!state?.activeStrategy) {
        return setNames({});
      }

      const strategy = getStrategy(state.activeStrategy);

      if (!strategy) {
        return setNames({});
      }

      try {
        const names = await strategy.getWalletNames();

        setNames(names);
      } catch (e: any) {
        console.error(`[ArConnect Kit] Failed to sync wallet names\n${e?.message || e}`);
      }
    })();
  }, [addresses, state?.activeStrategy]);

  return names;
}
