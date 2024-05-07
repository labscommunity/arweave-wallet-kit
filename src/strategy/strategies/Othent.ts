import * as othentKMS from '@othent/kms'
import type { ConnectReturnType } from '@othent/kms'
import type Transaction from "arweave/web/lib/transaction";
import type { SignatureOptions } from "arweave/web/lib/crypto/crypto-interface";
import type {
  PermissionType,
  AppInfo,
  GatewayConfig,
} from "arconnect";
import type Strategy from "../Strategy";

export default class OthentStrategy
implements Strategy
{
  public id: "othent" = "othent";
  public name = "Google";
  public description =
    "Sign in with Google through Othent 2.0";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  constructor() {}

  public async isAvailable() {
    if (othentKMS) {
      return true;
    }
  }

  public async sync() {}

  public async connect(permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig): Promise<ConnectReturnType> {
      if (permissions || appInfo || gateway) {
        console.log("permissions/appInfo/gateway, are not implemented in Othent");
      }
    return await othentKMS.connect()
  }

  public async disconnect(): Promise<null> {
    return await othentKMS.disconnect()
  }

  public async getActiveAddress(): Promise<string> {
    return await othentKMS.getActiveAddress()
  }

  public async getAllAddresses(): Promise<string[]> {
    return [await othentKMS.getActiveAddress()]
  }

  public async getWalletNames(): Promise<string> {
    return await othentKMS.getWalletNames()
  }

  public async sign(
    transaction: Transaction,
    options?: SignatureOptions,
    analyticsTags?: { name: string; value: string; }[] | undefined
  ): Promise<any> {

    if (options) {
      console.log("options, are not implemented in Othent");
    }

    return othentKMS.sign(transaction, analyticsTags);
  }

  public async encrypt(
    data: string | Uint8Array,
    algorithm?: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<string | Uint8Array | null> {
    if (algorithm) {
      console.log("algorithm, is not implemented in Othent");
    }

    return await othentKMS.encrypt(data)
  }

  public async decrypt(
    data: string | Uint8Array,
    algorithm?: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<string | Uint8Array | null> {
    if (algorithm) {
      console.log("algorithm, is not implemented in Othent");
    }
    return await othentKMS.decrypt(data)
  }

  public async getArweaveConfig(): Promise<any> {
    console.log("getArweaveConfig, is not implemented in Othent");
  }

  public async signature(
    data: string | Uint8Array | ArrayBuffer,
    algorithm?: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    if (algorithm) {
      console.log("algorithm, is not implemented in Othent");
    }
    return await othentKMS.signature(data)
  }

  public async getActivePublicKey(): Promise<string> {
    return await othentKMS.getActivePublicKey()
  }

  public async addToken(id: string): Promise<void> {
    console.log("addToken, is not implemented in Othent");
  }

  public async dispatch(transaction: Transaction): Promise<{ id: string; }> {
    return await othentKMS.dispatch(transaction)
  }

  public addAddressEvent(listener: (address: string) => void) {
    console.log("addAddressEvent, is not implemented in Othent");
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void
  ) {
    console.log("removeAddressEvent, is not implemented in Othent");
  }

}
