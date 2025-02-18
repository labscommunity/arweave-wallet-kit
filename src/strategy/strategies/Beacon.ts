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

export default class BeaconWallet implements Strategy {
  public id: "beacon" = "beacon";
  public name = "Beacon";
  public description = "iOS based agent first wallet for AO";
  public theme = "29, 43, 194";
  public logo = "iXL24MHFs5MRS0uwAHLQgxEluwolVc9VKYVou7ngM6o";
  public url = "https://beaconwallet.app";
  private walletRef: any;
  private addressListeners: ((address: string) => void)[] = [];

  constructor() {
    this.walletRef = new WalletClient();
    this.walletRef.reconnect();
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    if (permissions) {
      console.warn(
        "[Arweave Wallet Kit] Beacon implicitly requires all permissions. Your `permissions` parameter will be ignored."
      );
    }

    return await this.walletRef.connect({ permissions, appInfo, gateway });
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
    throw new Error("Encrypt is not implemented in Beacon wallet");
  }

  public decrypt(
    data: BufferSource,
    options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    throw new Error("Decrypt is not implemented in Beacon wallet");
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

    return this.walletRef.signature(data);
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
    return true;
  }

  public signDataItem(p: DataItem): Promise<ArrayBuffer> {
    return this.walletRef.signDataItem(p);
  }

  public addAddressEvent(
    listener: (address: string) => void
  ): (e: CustomEvent<{ address: string }>) => void {
    this.addressListeners.push(listener);

    return listener as any;
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void
  ) {
    this.addressListeners.splice(
        this.addressListeners.indexOf(listener as any),
        1
      );
  }
}
