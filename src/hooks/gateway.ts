import useGlobalState from "./global";
import { useMemo } from "react";

export default function useGatewayURL() {
  const { state } = useGlobalState();

  const url = useMemo(() => {
    const gatewayConfig = state?.config?.gatewayConfig;

    if (!gatewayConfig) {
      return "https://arweave.net";
    }

    return `${gatewayConfig.protocol}://${gatewayConfig.host}:${gatewayConfig.port}`;
  }, [state?.config?.gatewayConfig]);

  return url;
}
