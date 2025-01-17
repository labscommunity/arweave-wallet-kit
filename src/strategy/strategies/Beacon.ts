import BrowserWalletStrategy from "./BrowserWallet";
import { callWindowApi } from "../../utils";
import type Strategy from "../Strategy";
import type {
  AppInfo,
  DataItem,
  DispatchResult,
  GatewayConfig,
  PermissionType
} from "arconnect";
import WalletClient from "@vela-ventures/ao-sync-sdk";
import Transaction from "arweave/web/lib/transaction";
import { SignatureOptions } from "arweave/web/lib/crypto/crypto-interface";

export default class BeaconWallet
  extends BrowserWalletStrategy
  implements Strategy
{
  // @ts-expect-error
  public id: "beacon" = "beacon";
  public name = "Beacon";
  public description = "iOS based agent first wallet for AO";
  public theme = "171, 154, 255";
  public logo = "JUMbtBcIzDDI5976teuv3UN4Ln6CHLFFbY8Yp7gRw1M";
  public url = "https://beaconwallet.com";
  private walletRef: any;

  constructor() {
    super();
    this.walletRef = new WalletClient();
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    return await this.walletRef.connect();
  }

  public async disconnect() {
    return this.walletRef.disconnect();
  }

  public async getActiveAddress(): Promise<string> {
    return await this.walletRef.getActiveAddress();
  }

  public async getAllAddresses() {
    return this.walletRef.getAllAddresses();
  }

  public async sign(transaction: Transaction, options?: SignatureOptions) {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Beacon does not support `sign()` options"
      );
    }

    return this.walletRef.sign(transaction);
  }

  public async getPermissions(): Promise<PermissionType[]> {
    return this.walletRef.getPermissions();
  }

  public async getWalletNames() {
    return this.walletRef.getWalletNames();
  }

  public encrypt(
    data: BufferSource,
    options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Beacon does not support `encrypt()` options"
      );
    }

    return this.walletRef.encrypt(data, options);
  }

  public decrypt(
    data: BufferSource,
    options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Beacon does not support `decrypt()` options"
      );
    }

    return this.walletRef.decrypt(data, options);
  }

  public getArweaveConfig(): Promise<GatewayConfig> {
    return this.walletRef.getArweaveConfig();
  }

  public signature(
    data: Uint8Array,
    options: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Beacon does not support `signature()` options"
      );
    }

    return this.walletRef.signature(data, options);
  }

  public async getActivePublicKey() {
    return this.walletRef.getActivePublicKey();
  }

  public async addToken(id: string): Promise<void> {
    return this.walletRef.addToken(id);
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return this.walletRef.dispatch(transaction);
  }

  public async isAvailable() {
    return true
  }

  public signDataItem(p: DataItem): Promise<ArrayBuffer> {
    return this.walletRef.signDataItem(p)
  }
}
