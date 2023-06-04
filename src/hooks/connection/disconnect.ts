import { STRATEGY_STORE } from "../../strategy";
import useActiveStrategy from "../strategy";
import useGlobalState from "../global";
import useConnected from "./connected";

/**
 * Disconnect method hook
 */
export default function useDisconnect() {
  const strategy = useActiveStrategy();
  const { dispatch } = useGlobalState();
  const connected = useConnected();

  /**
   * Disconnect from active wallet
   */
  async function disconnect() {
    if (!strategy || !connected) {
      throw new Error("[Arweave Wallet Kit] Not yet connected");
    }

    try {
      await strategy.disconnect();

      localStorage.removeItem(STRATEGY_STORE);
      dispatch({ type: "DISCONNECT" });
    } catch (e: any) {
      throw new Error(
        "[Arweave Wallet Kit] Could not disconnect\n" + (e?.message || e)
      );
    }
  }

  return disconnect;
}
