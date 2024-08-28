import BrowserWalletStrategy from "./BrowserWallet";
import { callWindowApi } from "../../utils";
import type Strategy from "../Strategy";

export default class ArConnectStrategy
  extends BrowserWalletStrategy
  implements Strategy
{
  // @ts-expect-error
  public id: "arconnect" = "arconnect";
  public name = "ArConnect";
  public description = "Non-custodial Arweave wallet for your favorite browser";
  public theme = "171, 154, 255";
  public logo = "tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE";
  public url = "https://arconnect.io";

  constructor() {
    super();
    
    console.log("ArConnectStrategy")
  }

  public async isAvailable() {
    const injectedAvailable = await super.isAvailable();

    if (!injectedAvailable) {
      return false;
    }

    return window.arweaveWallet.walletName === "ArConnect";
  }

  public async addToken(id: string): Promise<void> {
    return await callWindowApi("addToken", [id]);
  }
}
