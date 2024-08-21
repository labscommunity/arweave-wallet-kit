import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type { DispatchResult, GatewayConfig, PermissionType } from "arconnect";
import type Transaction from "arweave/web/lib/transaction";
import type { AppInfo } from "arweave-wallet-connector";
import type Strategy from "../Strategy";
import { Othent, OthentOptions, AppInfo as OthentAppInfo } from "@othent/kms";

export default class OthentStrategy implements Strategy {
  public id: "othent" = "othent";
  public name = "Othent";
  public description =
    "Othent JS SDK to manage Arweave custodial wallets backend by Auth0 and Google Key Management Service.";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  #othent: Othent | null = null;
  #othentOptions: OthentOptions | null = null;

  constructor() {}

  public __overrideOthentOptions(othentOptions: OthentOptions) {
    this.#othentOptions = othentOptions;
  }

  #othentInstance() {
    if (this.#othent) return this.#othent;

    if (!this.#othentOptions) {
      throw new Error("[Arweave Wallet Kit] `OthentOptions` not provided.");
    }

    try {
      this.#othent = new Othent(this.#othentOptions);

      if (this.#othentOptions.persistLocalStorage) {
        // Note the cleanup function is not used here, which could cause issues with Othent is re-instantiated on the same tab.
        this.#othent.startTabSynching();
      }
    } catch (err) {
      throw new Error(`[Arweave Wallet Kit] ${ (err instanceof Error && err.message) || err}`);
    }

    return this.#othent;
  }

  public async isAvailable() {
    try {
      return !!this.#othentInstance();
    } catch {
      return false;
    }
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ) {
    const othent = this.#othentInstance();

    return othent.connect(
      permissions,
      appInfo ? { ...othent.appInfo, ...appInfo } as OthentAppInfo : undefined,
      gateway,
    ).then(() => undefined)
  }

  public async disconnect() {
    return this.#othentInstance().disconnect();
  }

  public async getActiveAddress() {
    return this.#othentInstance().getActiveAddress();
  }

  public async getActivePublicKey() {
    return this.#othentInstance().getActivePublicKey();
  }

  public async getAllAddresses() {
    return this.#othentInstance().getAllAddresses();
  }

  public async getWalletNames() {
    return this.#othentInstance().getWalletNames();
  }

  public async userDetails() {    
    return this.#othentInstance().getUserDetails();
  }

  public async sign(transaction: Transaction, options?: SignatureOptions) {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Othent does not support `sign()` options"
      );
    }

    return this.#othentInstance().sign(transaction);
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return this.#othentInstance().dispatch(transaction);
  }

  public encrypt(data: BufferSource, options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams): Promise<Uint8Array> {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Othent does not support `encrypt()` options"
      );
    }

    return this.#othentInstance().encrypt(data);
  }

  public decrypt(data: BufferSource, options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams): Promise<Uint8Array> {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Othent does not support `decrypt()` options"
      );
    }

    return this.#othentInstance().decrypt(data);
  }

  public signature(data: Uint8Array, options: AlgorithmIdentifier | RsaPssParams | EcdsaParams): Promise<Uint8Array> {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Othent does not support `signature()` options"
      );
    }

    return this.#othentInstance().signature(data);
  }

  public getArweaveConfig(): Promise<GatewayConfig> {
    return this.#othentInstance().getArweaveConfig();
  }

  public async getPermissions() {
    return this.#othentInstance().getPermissions();
  }

  public async addToken(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  public addAddressEvent(listener: (address: string) => void): (e: CustomEvent<{ address: string; }>) => void {
    throw new Error("Not implemented");
  }

  public removeAddressEvent(listener: (e: CustomEvent<{ address: string; }>) => void): void {
    throw new Error("Not implemented");
  }
}
