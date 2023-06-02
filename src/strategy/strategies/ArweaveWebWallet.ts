import type { AppInfo, GatewayConfig, PermissionType } from "arconnect";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import BrowserWalletStrategy from "./BrowserWallet";
import type Strategy from "../Strategy";

export default class ArweaveWebWalletStrategy
  extends BrowserWalletStrategy
  implements Strategy
{
  public id = "webwallet";
  public name = "Arweave.app";
  public description = "Web based wallet software";
  public theme = "24, 24, 24";
  public logo = "qVms-k8Ox-eKFJN5QFvrPQvT9ryqQXaFcYbr-fJbgLY";
  public url = "https://arweave.app";

  #instance = new ArweaveWebWallet();

  constructor() {
    super();
  }

  public async isAvailable() {
    return true;
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    if (gateway) {
      console.warn(
        "[Arweave Wallets Kit] Arweave.app does not support custom gateway connection yet."
      );
    }

    // try connecting
    this.#instance = new ArweaveWebWallet(appInfo);

    this.#instance.setUrl("arweave.app");
    await this.#instance.connect();
  }

  public addAddressEvent(listener: (address: string) => void) {
    this.#instance.on("connect", listener);

    return listener as any;
  }

  public removeAddressEvent(listener: any) {
    this.#instance.off("connect", listener);
  }
}
