import BrowserWalletStrategy from "./BrowserWallet";
import type Strategy from "../Strategy";

export default class ArConnectStrategy extends BrowserWalletStrategy implements Strategy {
  public id = "arconnect";
  public name = "ArConnect";
  public description = "Secure wallet management for Arweave";
  public theme = "171, 154, 255";
  public logo = "tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE";
  public url = "https://arconnect.io";

  constructor() {
    super();
  }

  public async isAvailable() {
    const injectedAvailable = await super.isAvailable();

    if (!injectedAvailable) {
      return false;
    }

    return window.arweaveWallet.walletName === "ArConnect";
  }
}
