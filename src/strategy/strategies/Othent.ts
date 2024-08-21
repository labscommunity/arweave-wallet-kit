import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type { DispatchResult, GatewayConfig, PermissionType } from "arconnect";
import type Transaction from "arweave/web/lib/transaction";
import type { AppInfo } from "arweave-wallet-connector";
import type Strategy from "../Strategy";
import { Othent, OthentOptions } from "@othent/kms";

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
    return this.#othentInstance().connect(permissions, appInfo, gateway);
  }

  public async disconnect() {
    return this.#othentInstance().disconnect();
  }

  public async getPermissions() {
    return this.#othentInstance().getPermissions();
  }

  public async getActiveAddress(): Promise<string> {
    return this.#othentInstance().getActiveAddress();
  }

  public async getAllAddresses(): Promise<string[]> {
    return this.#othentInstance().getAllAddresses();
  }

  public async sign(transaction: Transaction, options?: SignatureOptions) {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Othent does not support transaction signature options"
      );
    }

    if (transaction.quantity !== "0" && transaction.target !== "") {
      // TODO: Is this still the case?
      throw new Error(
        "[Arweave Wallet Kit] Signing with Othent only supports data type transactions"
      );
    }

    return this.#othentInstance().sign(transaction);
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return this.#othentInstance().dispatch(transaction);
  }

  public async userDetails() {    
    return this.#othentInstance().getUserDetails();
  }
}
