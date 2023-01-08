import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type Transaction from "arweave/node/lib/transaction";
import type Strategy from "../Strategy";
import type {
  PermissionType,
  AppInfo,
  GatewayConfig,
  DispatchResult
} from "arconnect";

export default class ArConnectStrategy implements Strategy {
  public id = "arconnect";
  public name = "ArConnect";
  public description = "Secure wallet management for Arweave";
  public theme = "171, 154, 255";
  public logo = "tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE";
  public url = "https://arconnect.io";

  constructor() {}

  public async isAvailable() {
    if (typeof window === "undefined" || !window) {
      console.error(
        `[ArConnect Kit] "${this.id}" strategy is unavailable. Window is undefined`
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
            `[ArConnect Kit] "${this.id}" strategy is unavailable. window.arweaveWallet is undefined`
          );
        }

        resolve(!!window.arweaveWallet);
      }, 7000);
    });
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    return await this.#callWindowApi("connect", [
      permissions,
      appInfo,
      gateway
    ]);
  }

  public async disconnect(): Promise<void> {
    return await this.#callWindowApi("disconnect");
  }

  public async getActiveAddress(): Promise<string> {
    return await this.#callWindowApi("getActiveAddress");
  }

  public async getAllAddresses(): Promise<string[]> {
    return await this.#callWindowApi("getAllAddresses");
  }

  public async getPermissions(): Promise<PermissionType[]> {
    return await this.#callWindowApi("getPermissions");
  }

  public async getWalletNames(): Promise<{ [addr: string]: string }> {
    return await this.#callWindowApi("getWalletNames");
  }

  public async sign(
    transaction: Transaction,
    options?: SignatureOptions
  ): Promise<void> {
    const signedTransaction = await this.#callWindowApi("sign", [transaction, options]);

    transaction.setSignature({
      id: signedTransaction.id,
      owner: signedTransaction.owner,
      reward: signedTransaction.reward,
      tags: signedTransaction.tags,
      signature: signedTransaction.signature,
    });
  }

  public async encrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    return await this.#callWindowApi("encrypt", [data, algorithm]);
  }

  public async decrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    return await this.#callWindowApi("decrypt", [data, algorithm]);
  }

  public async getArweaveConfig(): Promise<GatewayConfig> {
    return await this.#callWindowApi("getArweaveConfig");
  }

  public async signature(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    return await this.#callWindowApi("signature", [data, algorithm]);
  }

  public async getActivePublicKey(): Promise<string> {
    return await this.#callWindowApi("getActivePublicKey");
  }

  public async addToken(id: string): Promise<void> {
    return await this.#callWindowApi("addToken", [id]);
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return await this.#callWindowApi("dispatch", [transaction]);
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

  /**
   * Call the window.arweaveWallet API and wait for it to be injected,
   * if it has not yet been injected.
   *
   * @param fn Function name
   * @param params Params
   * @returns API result
   */
  async #callWindowApi(fn: string, params: any[] = []) {
    // if it is already injected
    if (window?.arweaveWallet) {
      // @ts-expect-error
      return await window.arweaveWallet[fn as any](...params);
    }

    // if it has not yet been injected
    return new Promise((resolve, reject) =>
      window.addEventListener("arweaveWalletLoaded", async () => {
        try {
          // @ts-expect-error
          resolve(await window.arweaveWallet[fn as any](...params));
        } catch (e) {
          reject(e);
        }
      })
    );
  }
}
