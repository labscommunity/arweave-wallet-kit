import type { GatewayConfig, PermissionType } from "arconnect";
import type { AppInfo } from "arweave-wallet-connector";
import type Strategy from "../Strategy";
import { Othent } from "othent";

export default class OthentStrategy implements Strategy {
  public id = "othent";
  public name = "Google (Othent)";
  public description = "Sign in with Google through Othent Smart Contract Wallets";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  #othent: Awaited<ReturnType<typeof Othent>> | undefined;
  #connected = false;

  constructor() {}

  public async isAvailable() {
    try {
      this.#othent = await Othent({
        API_ID: this.#apiID
      });

      // get if logged in
      try {
        await this.#othent.userDetails();

        this.#connected = true;
      } catch {
        this.#connected = false;
      }

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
    if (!this.#othent) {
      throw new Error(
        "[Arweave Wallet Kit] Failed to connect to Othent"
      );
    }

    await this.#othent.logIn();
  }

  public async disconnect() {
    if (!this.#othent) {
      throw new Error(
        "[Arweave Wallet Kit] Failed to connect to Othent"
      );
    }

    await this.#othent.logOut();
  }

  public async getPermissions() {
    if (!this.#othent || !this.#connected) {
      return [];
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
  }
}
