import { useEffect, useState } from "react";
import Arweave from "arweave/node/common";
import useGlobalState from "./global";

/**
 * Balance hook
 */
export default function useBalance() {
  const [balance, setBalance] = useState(0);
  const { state } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (!state.activeAddress) return;

      const arweave = new Arweave(
        state?.config?.gatewayConfig || {
          host: "arweave.net",
          port: 443,
          protocol: "https"
        }
      );

      const bal = arweave.ar.winstonToAr(
        await arweave.wallets.getBalance(state.activeAddress)
      );

      setBalance(Number(bal));
    })();
  }, [state?.activeAddress]);

  return balance;
}
