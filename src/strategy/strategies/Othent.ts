import * as othentKMS from "@othent/kms";
import type Transaction from "arweave/web/lib/transaction";
import type { SignatureOptions } from "arweave/web/lib/crypto/crypto-interface";
import type { PermissionType, AppInfo, GatewayConfig } from "arconnect";
import type Strategy from "../Strategy";

export default class OthentStrategy implements Strategy {
  public id: "othent" = "othent";
  public name = "Google";
  public description = "Sign in with Google using Othent 2.0";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  constructor() {}

  public async isAvailable(): Promise<boolean> {
    return othentKMS !== undefined;
  }

  public async sync() {}

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    if (permissions || appInfo || gateway) {
      console.log("permissions/appInfo/gateway, are not implemented in Othent");
    }
    await othentKMS.connect();
  }

  public async disconnect(): Promise<void> {
    await othentKMS.disconnect();
  }

  public async getActiveAddress(): Promise<string> {
    return await othentKMS.getActiveAddress();
  }

  public async getAllAddresses(): Promise<string[]> {
    return [await othentKMS.getActiveAddress()];
  }

  public async getWalletNames(): Promise<{ [addr: string]: string }> {
    const address = await othentKMS.getActiveAddress();
    const walletName = await othentKMS.getWalletNames();
    return { [address]: walletName };
  }

  public async sign(
    transaction: Transaction,
    options?: SignatureOptions,
    analyticsTags?: { name: string; value: string }[] | undefined
  ): Promise<any> {
    if (options) {
      console.log("options, are not implemented in Othent");
    }

    return othentKMS.sign(transaction, analyticsTags);
  }

  public async encrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    if (algorithm) {
      console.log("algorithm, is not implemented in Othent");
    }
    let encryptData: string | Uint8Array;
    if (data instanceof ArrayBuffer) {
      encryptData = new Uint8Array(data);
    } else if (ArrayBuffer.isView(data)) {
      encryptData = new Uint8Array(
        data.buffer,
        data.byteOffset,
        data.byteLength
      );
    } else {
      throw new Error("Unsupported data type");
    }
    const result = await othentKMS.encrypt(encryptData);
    if (typeof result === "string") {
      return new TextEncoder().encode(result);
    } else if (result instanceof Uint8Array) {
      return result;
    } else {
      throw new Error("Unexpected encryption result type");
    }
  }

  public async decrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    if (algorithm) {
      console.log("algorithm, is not implemented in Othent");
    }
    let decryptData: string | Uint8Array;
    if (typeof data === "string") {
      decryptData = data;
    } else if (data instanceof ArrayBuffer) {
      decryptData = new Uint8Array(data);
    } else if (ArrayBuffer.isView(data)) {
      decryptData = new Uint8Array(
        data.buffer,
        data.byteOffset,
        data.byteLength
      );
    } else {
      throw new Error("Unsupported data type");
    }
    const result = await othentKMS.decrypt(decryptData);
    if (typeof result === "string") {
      return new TextEncoder().encode(result);
    } else if (result instanceof Uint8Array) {
      return result;
    } else {
      throw new Error("Unexpected decryption result type");
    }
  }

  public async getArweaveConfig(): Promise<any> {
    console.log("getArweaveConfig, is not implemented in Othent");
  }

  public async signature(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    if (algorithm) {
      console.log("algorithm, is not implemented in Othent");
    }
    const uint8ArrayData = new Uint8Array(data);
    return await othentKMS.signature(uint8ArrayData);
  }

  public async getActivePublicKey(): Promise<string> {
    return await othentKMS.getActivePublicKey();
  }

  public async addToken(id: string): Promise<void> {
    console.log("addToken, is not implemented in Othent");
  }

  public async dispatch(transaction: Transaction): Promise<{ id: string }> {
    return await othentKMS.dispatch(transaction);
  }

  // @ts-ignore - non implemented function error
  public addAddressEvent(listener: (address: string) => void) {
    console.log("addAddressEvent, is not implemented in Othent");
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void
  ) {
    console.log("removeAddressEvent, is not implemented in Othent");
  }

  public async getPermissions() {

    try {
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
}
