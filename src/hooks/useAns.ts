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
      if (!address) {
        return setAns(undefined);
      }

      const res = await fetch(
        `https://ans-stats.decent.land/profile/${address}`
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
    domain: string;
    color: string;
    subdomains: unknown[];
    record: string | null;
    created_at: number;
    label: string;
  }[];
  nickname?: string;
  address_color: string;
  bio?: string;
  avatar?: string;
  links?: {
    [key: string]: string;
  };
}
