import { useEffect, useState } from "react";
import useAddress from "./active_address";
import useGatewayURL from "./gateway";

/**
 * ANS profile hook
 */
export default function useAns() {
  const [ans, setAns] = useState<AnsProfile>();
  const address = useAddress();
  const gatewayURL = useGatewayURL();

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://ans-testnet.herokuapp.com/profile/${address}`
      );
      const data: AnsProfile = await res.json();

      if (!data?.currentLabel) {
        return setAns(undefined);
      }

      setAns({
        ...data,
        currentLabel: data.currentLabel + ".ar",
        avatar: data.avatar ? `${gatewayURL}/${data.avatar}` : undefined
      });
    })();
  }, [address, gatewayURL]);

  return ans;
}

interface AnsProfile {
  user: string;
  currentLabel: string;
  ownedLabels?: {
    label: string;
    scarcity: string;
    acquisationBlock: number;
    mintedFor: number;
  }[];
  nickname?: string;
  address_color: string;
  bio?: string;
  avatar?: string;
  links?: {
    [key: string]: string;
  };
  subdomains?: any;
  freeSubdomains: number;
  timestamp: number;
}
