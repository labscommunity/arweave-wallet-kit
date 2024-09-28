import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type Transaction from "arweave/node/lib/transaction";
import { callWindowApi } from "../../utils";
import type Strategy from "../Strategy";
import type {
  PermissionType,
  AppInfo,
  GatewayConfig,
  DispatchResult,
  DataItem
} from "arconnect";

/**
 * Any kind of browser wallet, with an
 * ArConnect-like injected API
 */
export default class BrowserWalletStrategy implements Strategy {
  public id: "browserwallet" = "browserwallet";
  public name = "Browser Wallet";
  public description = "Any browser wallet with an injected API";
  public theme = "121,212,131";
  public logo = "KKiSlNKc5K59MXzUPz5qjtCLsl6_ckjAOg9MyAzaUs0";

  constructor() {}

  public async isAvailable() {
    if (typeof window === "undefined" || !window) {
      console.error(
        `[Arweave Wallet Kit] "${this.id}" strategy is unavailable. Window is undefined`
      );
      return false;
    }

    if (window.arweaveWallet) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const listener = () => resolve(true);

      window.addEventListener("arweaveWalletLoaded", listener);

      // after 7 seconds, we stop listening
      setTimeout(() => {
        window.removeEventListener("arweaveWalletLoaded", listener);

        if (!window.arweaveWallet) {
          console.error(
            `[Arweave Wallet Kit] "${this.id}" strategy is unavailable. window.arweaveWallet is undefined`
          );
        }

        resolve(!!window.arweaveWallet);
      }, 7000);
    });
  }

  public async sync() {}

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    return await callWindowApi("connect", [permissions, appInfo, gateway]);
  }

  public async disconnect(): Promise<void> {
    return await callWindowApi("disconnect");
  }

  public async getActiveAddress(): Promise<string> {
    return await callWindowApi("getActiveAddress");
  }

  public async getAllAddresses(): Promise<string[]> {
    return await callWindowApi("getAllAddresses");
  }

  public async getPermissions(): Promise<PermissionType[]> {
    return await callWindowApi("getPermissions");
  }

  public async getWalletNames(): Promise<{ [addr: string]: string }> {
    return await callWindowApi("getWalletNames");
  }

  public async sign(
    transaction: Transaction,
    options?: SignatureOptions
  ): Promise<Transaction> {
    const signedTransaction = await callWindowApi("sign", [
      transaction,
      options
    ]);

    transaction.setSignature({
      id: signedTransaction.id,
      owner: signedTransaction.owner,
      reward: signedTransaction.reward,
      tags: signedTransaction.tags,
      signature: signedTransaction.signature
    });

    return transaction;
  }
  public async signDataItem(p: DataItem): Promise<ArrayBuffer> {
    return await callWindowApi("signDataItem", [p]);
  }

  public async encrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    return await callWindowApi("encrypt", [data, algorithm]);
  }

  public async decrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    return await callWindowApi("decrypt", [data, algorithm]);
  }

  public async getArweaveConfig(): Promise<GatewayConfig> {
    return await callWindowApi("getArweaveConfig");
  }

  public async signature(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    return await callWindowApi("signature", [data, algorithm]);
  }

  public async getActivePublicKey(): Promise<string> {
    return await callWindowApi("getActivePublicKey");
  }

  public async addToken(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return await callWindowApi("dispatch", [transaction]);
  }

  public addAddressEvent(listener: (address: string) => void) {
    const listenerFunction = (e: CustomEvent<{ address: string }>) =>
      listener(e.detail.address);
    addEventListener("walletSwitch", listenerFunction);

    return listenerFunction;
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void
  ) {
    removeEventListener("walletSwitch", listener);
  }
}
