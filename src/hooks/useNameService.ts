import { useEffect, useState } from "react";
import useAddress from "./active_address";
import useGatewayURL from "./gateway";
import { findLogo, getPrimaryArNSName } from "../lib/arns";

export interface NameServiceProfile {
  /** address of the wallet */
  address: string;
  /** name associated with the address */
  name: string;
  /** logo Arweave TxID */
  logo?: string;
}

/**
 * Name Service profile hook: looks up a wallet's profile in ArNS and ANS
 */
export default function useNameService({
  useArNS,
  useAns
}: {
  useArNS: boolean;
  useAns: boolean;
}) {
  const [nameServiceProfile, setNameServiceProfile] =
    useState<NameServiceProfile>();
  const address = useAddress();
  const gatewayURL = useGatewayURL();

  useEffect(() => {
    (async () => {
      if (!address) {
        return setNameServiceProfile(undefined);
      }

      if (useArNS) {
        try {
          const primaryName = await getPrimaryArNSName(address);
          if (!primaryName) {
            setNameServiceProfile(undefined);
            return;
          }
          const logo = await findLogo(primaryName.processId);

          setNameServiceProfile({
            address,
            name: primaryName.name,
            logo: logo ? `${gatewayURL}/${logo}` : undefined
          });
          return;
        } catch (e: any) {
          console.error(
            `[Arweave Wallet Kit] Failed to fetch ArNS profile\n${
              e?.message || e
            }`
          );
        }
      }

      if (useAns) {
        try {
          const res = await fetch(
            `https://ans-stats.decent.land/profile/${address}`
          );
          const data: AnsProfile = await res.json();

          if (!data?.currentLabel) {
            return setNameServiceProfile(undefined);
          }

          setNameServiceProfile({
            address,
            name: data.currentLabel + ".ar",
            logo: data.avatar ? `${gatewayURL}/${data.avatar}` : undefined
          });
        } catch (e: any) {
          console.error(
            `[Arweave Wallet Kit] Failed to fetch ans profile\n${
              e?.message || e
            }`
          );
        }
      }
    })();
  }, [address, gatewayURL]);

  return nameServiceProfile;
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
