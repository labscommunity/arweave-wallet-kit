import { useEffect, useState } from "react";
import useActiveStrategy from "./strategy";
import useAddress from "./active_address";
import useGlobalState from "./global";

/**
 * Addresses added to the wallet
 */
export default function useAddresses() {
  const [addresses, setAddresses] = useState<string[]>([]);

  const activeAddress = useAddress();
  const { state } = useGlobalState();
  const strategy = useActiveStrategy();

  useEffect(() => {
    (async () => {
      if (!strategy) {
        return setAddresses([]);
      }

      // sync with wallet
      const sync = async () => {
        try {
          setAddresses(await strategy.getAllAddresses());
        } catch (e: any) {
          console.error(
            `[Arweave Wallet Kit] Failed to sync addresses\n${e?.message || e}`
          );
        }
      };

      await sync();

      // sync on focus
      addEventListener("focus", sync);

      return () => removeEventListener("focus", sync);
    })();
  }, [activeAddress, state, strategy]);

  return addresses;
}

/**
 * Nicknames/ANS names for addresses
 */
export function useWalletNames() {
  const [names, setNames] = useState<{ [addr: string]: string }>({});
  const addresses = useAddresses();
  const { state } = useGlobalState();
  const strategy = useActiveStrategy();

  useEffect(() => {
    (async () => {
      if (!strategy || !strategy.getWalletNames) {
        return setNames({});
      }

      try {
        const names = await strategy.getWalletNames();

        setNames(names);
      } catch (e: any) {
        console.error(
          `[Arweave Wallet Kit] Failed to sync wallet names\n${e?.message || e}`
        );
      }
    })();
  }, [addresses, state?.activeStrategy]);

  return names;
}
