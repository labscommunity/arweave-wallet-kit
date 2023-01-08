import useDisconnect from "./disconnect";
import useConnected from "./connected";
import useConnect from "./connect";

/**
 * Base connection hook
 */
export default function useConnection() {
  const connected = useConnected();
  const connect = useConnect();
  const disconnect = useDisconnect();

  return {
    connected,
    connect,
    disconnect
  };
}
