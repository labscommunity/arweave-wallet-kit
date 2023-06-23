import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type { DispatchResult, GatewayConfig, PermissionType } from "arconnect";
import type Transaction from "arweave/web/lib/transaction";
import type { AppInfo } from "arweave-wallet-connector";
import type Strategy from "../Strategy";
import { Othent } from "othent";

export default class OthentStrategy implements Strategy {
  public id = "othent";
  public name = "Google";
  public description =
    "Sign in with Google through Othent Smart Contract Wallets";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  #apiID = "e923634af8cc8b63bc8c74735d177aae";
  #addressListeners: ListenerFunction[] = [];

  constructor() {}

  async #othentInstance(ensureConnection = true) {
    // init othent
    const othent = await Othent({
      API_ID: this.#apiID
    });

    if (!othent) {
      throw new Error("[Arweave Wallet Kit] Invalid Othent API ID");
    }

    if (ensureConnection) {
      const permissions = await this.getPermissions();

      if (permissions.length === 0) {
        throw new Error("[Arweave Wallet Kit] You are not connected to Othent");
      }
    }

    return othent;
  }

  public async isAvailable() {
    try {
      // ensure instance
      await this.#othentInstance(false);

      return true;
    } catch {
      return false;
    }
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ) {
    const othent = await this.#othentInstance(false);
    const res = await othent.logIn();

    for (const listener of this.#addressListeners) {
      listener(res.contract_id);
    }
  }

  public async disconnect() {
    const othent = await this.#othentInstance();

    await othent.logOut();

    for (const listener of this.#addressListeners) {
      listener(undefined as any);
    }
  }

  public async getPermissions() {
    const othent = await this.#othentInstance(false);

    try {
      const res = await othent.userDetails();

      for (const listener of this.#addressListeners) {
        listener(res.contract_id);
      }

      return [
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "ENCRYPT",
        "DECRYPT",
        "SIGNATURE",
        "ACCESS_ARWEAVE_CONFIG",
        "DISPATCH"
      ] as PermissionType[];
    } catch {
      return [];
    }
  }

  public async getActiveAddress(): Promise<string> {
    const othent = await this.#othentInstance(false);
    const res = await othent.userDetails();

    return res.contract_id;
  }

  public async sign(transaction: Transaction): Promise<void> {
    if (transaction.quantity !== "0" && transaction.target !== "") {
      throw new Error(
        "Signing with Othent only supports data type transactions."
      );
    }
    const othent = await this.#othentInstance(false);

    const signedTransaction = await othent.signTransactionArweave({
      othentFunction: "uploadData",
      data: transaction.data,
      tags: transaction.tags ? transaction.tags : []
    });

    await othent.sendTransactionArweave(signedTransaction);
  }

  public async signWarp(transaction: Transaction): Promise<void> {
    if (transaction.quantity !== "0" && transaction.target !== "") {
      throw new Error(
        "Signing with Othent only supports data type transactions."
      );
    }
    const othent = await this.#othentInstance(false);

    const signedTransaction = await othent.signTransactionArweave({
      othentFunction: "uploadData",
      data: transaction.data,
      tags: transaction.tags ? transaction.tags : []
    });

    await othent.sendTransactionArweave(signedTransaction);
  }

  public async signature(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    return new Uint8Array(1);
  }

  public async getActivePublicKey(): Promise<string> {
    return "";
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    try {
      const othent = await this.#othentInstance(false);

      const signedTransaction = await othent.signTransactionBundlr({
        othentFunction: "uploadData",
        data: transaction.data,
        tags: transaction.tags ? transaction.tags : []
      });

      const res = await othent.sendTransactionBundlr(signedTransaction);

      if (res.success === true) {
        return { id: res.transactionId, type: "BUNDLED" };
      } else {
        try {
          const othent = await this.#othentInstance(false);

          const signedTransaction = await othent.signTransactionArweave({
            othentFunction: "uploadData",
            data: transaction.data,
            tags: transaction.tags ? transaction.tags : []
          });

          const res = await othent.sendTransactionArweave(signedTransaction);

          if (res.success === true) {
            return { id: res.transactionId, type: "BASE" };
          } else {
            throw new Error(
              `Failed to dispatch layer transaction. Please recheck request.`
            );
          }
        } catch (error) {
          throw new Error(
            `Unable to dispatch Base layer transaction: ${error}`
          );
        }
      }
    } catch (error) {
      throw new Error(`Unable to dispatch Bundled transaction: ${error}`);
    }
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

type ListenerFunction = (address: string) => void;
