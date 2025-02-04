import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type { DataItem, DispatchResult, GatewayConfig, PermissionType } from "arconnect";
import type Transaction from "arweave/web/lib/transaction";
import type { AppInfo } from "arweave-wallet-connector";
import type Strategy from "../Strategy";
import { Othent, OthentOptions, AppInfo as OthentAppInfo } from "@othent/kms";

type ListenerFunction = (address: string) => void;

export default class OthentStrategy implements Strategy {
  public id: "othent" = "othent";
  public name = "Othent";
  public description =
    "Othent JS SDK to manage Arweave wallets backed by Auth0 and Google Key Management Service.";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  #othent: Othent | null = null;
  #othentOptions: OthentOptions | null = null;
  #addressListeners: ListenerFunction[] = [];

  constructor() {}

  public __overrideOthentOptions(othentOptions: OthentOptions) {
    this.#othentOptions = othentOptions;
  }

  #othentInstance() {
    if (this.#othent) return this.#othent;

    try {
      const appInfo: OthentAppInfo = {
        name: typeof location === "undefined" ? "UNKNOWN" : location.hostname,
        version: "ArweaveWalletKit",
        env: "",
      };

      this.#othent = new Othent({
        appInfo,
        persistLocalStorage: true,
        ...this.#othentOptions,
      });

      // Note the cleanup function is not used here, which could cause issues with Othent is re-instantiated on the same tab.
      this.#othent.addEventListener("auth", (userDetails) => {
        for (const listener of this.#addressListeners) {
          listener((userDetails?.walletAddress || undefined) as unknown as string);
        }
      });

      if (this.#othentOptions?.persistLocalStorage) {
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

    if (permissions) {
      console.warn(
        "[Arweave Wallet Kit] Othent implicitly requires all permissions. Your `permissions` parameter will be ignored."
      );
    }

    return othent.connect(
      undefined,
      appInfo ? { ...othent.appInfo, ...appInfo } as OthentAppInfo : undefined,
      gateway,
    ).then(() => undefined);
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

  public signDataItem(p: DataItem): Promise<ArrayBuffer> {
    return this.#othentInstance().signDataItem(p) as Promise<ArrayBuffer>
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
    const othent = this.#othentInstance();

    return othent.getSyncUserDetails() ? othent.getPermissions() : Promise.resolve([]);

  }

  public async addToken(id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  public addAddressEvent(listener: ListenerFunction) {
    this.#addressListeners.push(listener);

    // placeholder function
    return listener as any;
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void
  ) {
    this.#addressListeners.splice(
      this.#addressListeners.indexOf(listener as any),
      1
    );
  }
}
