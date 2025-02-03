import { AOProcess } from "./ao";

export const AO_ARNS_PROCESS = "agYcCFJtrMG6cqMuZfskIkFTGvUPddICmtQSBIoPdiA";

export type ProcessId = string;
export type WalletAddress = string;
export type RegistrationType = "lease" | "permabuy";

export type AoArNSBaseNameData = {
  processId: ProcessId;
  startTimestamp: number;
  type: RegistrationType;
  undernameLimit: number;
  purchasePrice: number;
};

export type ANTRecord = {
  transactionId: string;
  ttlSeconds: number;
};

export type AoANTState = {
  Name: string;
  Ticker: string;
  Denomination: number;
  Owner: WalletAddress;
  Controllers: WalletAddress[];
  Records: Record<string, ANTRecord>;
  Balances: Record<WalletAddress, number>;
  Logo: string;
  TotalSupply: number;
  Initialized: boolean;
};

export type ArNSPrimaryName = {
  owner: WalletAddress;
  name: string;
  startTimestamp: number;
  processId: string;
};

export async function getANTState(
  processId: string,
  retries = 3
): Promise<AoANTState> {
  const ant = new AOProcess({ processId });
  const tags = [{ name: "Action", value: "State" }];
  const res = await ant.read<AoANTState>({ tags, retries });
  return res;
}

/**
 * Generalized method to find the logo (avatar) for an ArNS name.
 * Fetches the ArNS record and ANT info to retrieve the transaction ID for the logo.
 * @param name - The ArNS name to fetch the logo for.
 * @returns The transaction ID of the logo if found, otherwise undefined.
 */
export async function findLogo(processId: string): Promise<string | undefined> {
  try {
    // Fetch the ANT info to get the logo transaction ID
    const antInfo = await getANTState(processId);
    return antInfo?.Logo;
  } catch (error) {
    console.error(`Failed to fetch logo for name ${name}:`, error);
    return undefined;
  }
}

/**
 * Fetches the primary ArNS name for a wallet address.
 * @param address - Wallet address to fetch the primary name for.
 * @returns Primary name record or undefined.
 */
export async function getPrimaryArNSName(
  address: WalletAddress
): Promise<ArNSPrimaryName | undefined> {
  const ArIO = new AOProcess({ processId: AO_ARNS_PROCESS });
  // Use retries of 1 as AOProcess is treating assertion errors (i.e., "Primary name not found") as
  // a retry-able error.
  const primaryName = ArIO.read<ArNSPrimaryName>({
    tags: [
      { name: "Action", value: "Primary-Name" },
      { name: "Address", value: address }
    ],
    retries: 1
  });
  return primaryName;
}
