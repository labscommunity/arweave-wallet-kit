import useGlobalState from "../global";
import useConnected from "./connected";

/**
 * Connect method hook
 */
export default function useConnect() {
  const { dispatch } = useGlobalState();
  const connected = useConnected();

  const connect = () =>
    new Promise<void>((resolve, reject) => {
      // check if connected
      if (connected) {
        return reject("[Arweave Wallet Kit] Already connected");
      }

      // open connection modal
      dispatch({
        type: "OPEN_MODAL",
        payload: "connect"
      });

      // listener for the connection response message
      async function listener(e: MessageEvent<ConnectMsg>) {
        // validate message
        if (e.data.type !== "connect_result") return;

        // remove this listener
        removeEventListener("message", listener);

        // handle result
        if (e.data.res) {
          resolve();
        } else {
          reject("[Arweave Wallet Kit] User cancelled the connection");
        }
      }

      // wait for confirmation
      addEventListener("message", listener);
    });

  return connect;
}

export interface ConnectMsg {
  type: "connect_result";
  res: boolean;
}
