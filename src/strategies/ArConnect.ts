import { PermissionType, AppInfo, GatewayConfig, DispatchResult } from "arconnect";
import { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import Transaction from "arweave/node/lib/transaction";
import Strategy from "./Strategy";

export default class ArConnectStrategy implements Strategy {
  public id = "arconnect";
  public name = "ArConnect";
  public description = "Secure wallet management for Arweave";
  public theme = "171, 154, 255";
  public logo = "https://lh3.googleusercontent.com/fife/AAbDypARM46G9BG8Y387jm9xoFSIXs6_yqC2wS2JukihPte0-V7KNVRk3XULiv-wXf39o6pdcGpAB575lJRZzmcjswpPpo06oMEJsYjzhhTRYUEUO1j3DbLpCRxC3GqXxBCweww3dj7FaVLUIuOOaM8R4vRS4YXN1dcn3-f1wJgU0Z1rAlHu1P-TeTE2IPKOBMHadg1N1x_QET3Q10_FxH99dXS6X5lGAy9sQpj_sbGN-AqAUbvbZzd_QgNThyoGm5Fe0tl_q5WGthRFIKtHlP4qHRqF0zQ3D1o04gi_vYwM9ktHFcUO9a1SkRpMsVtqfmxKR6tU-zcDeXyakdk7SE64RQzy6yzejAcznN_HweINX1ZFvZhq9wBL6fCmlZNcnf7WvdKfFMZEBaLngFaisJwS9AzA3Z9IAE5ZKjgWof-_tXbtQFstAFXz9maoBT2oXWp0oX8gdC6sUGUUhGHqbkqm5D0IkzMewutCOyrMEtfacFMxEkXpYRY1V7xjM07CMbo53GBYpaaHBQtNjvl17E8LmZJFPpQDKdhartq_LpuEi80OgJ4EUSn1lLW1FXGtj93hchy0p68tUseBf-jCKOEf44Rjr2aJD0XN3ZxKDkPR9egWEMy-M5E9mEFeI5CVyNHjJK90lHZLvmRkVgMftswMgzseMIsHTCpyvK-qHwx6aqvrJj58OxyJZPFBDcm9slRXbpdBHInfK_vs0N_j19mpo6T9AI3ibFmyrf04gEorGYZGnG2WMnPT51cvPeizPuGkNUH6CKop8UPlp3gXUmhdNphc72vtt7WFc4_UhRjts21RdHJ_LnNASuHBxLPFVgc29ysaBjAwilT0PoddIB9C8b613KIItfIjQQU71Kpj7HV0wr6nszQPtcQefqG9z1bDY46_AjOWx8sqDnTUnz-BWbNbJCPFiQ_5so6PblAzDlDrOT1ZFu8hRNZw358zkTIRUNjxwU7xA6HrG99fdjldtjZJZTHxXph5ZfY6TTUKeLG6uGhE0j4SMyD4DFwMAyiwJwQsXmtiicWtbZhu9Mw15U8nvQlEkOYTRh7CCN17xUtEFO3oCigJeQFgtn5HMmUbg4JI3NjLSwmZiMHLdBCG1wGDw8llzCOyULdiX6fYGW7NxIe6ci3wQulpfw0CeNz0-4ePelsv12UGZGZ_hEflYPWkxAcmH17mPhR_c4RObF990I0kfEyWCFZuNXEeZJLmkzUBoxZYtdJcsO0XT7ToqBRcWHws3Sk39xPQtwVhMs2nQJiVMzyGzliO321SAHDAn_WdXtQm19v56zkaHm-ZfY5tGrERCmsjKvoKHt01eRXD_lVf_rxQ0lhXjS9BTbX7A0skEpCWcyVcKh-XgbIGPpf_dHdDf5Kqb4_YH2fjg7vRZhrSzwE7CECtXIJeCT02GdqFNcI4FVJgW9y2_Vofyq_krW1ERImL3G-Dl4ynXJn_yBDzPZDUzQDyWcVa8ePSpKN8bDPzbCYaCNQEn3UZHXXPDNnH1ftDCj0F5N2occivJYqwaJdaiiJvUNLeS1Q1NW2dochMmYzRvlu8WcmKxru5xVCNUdYph0d8I6NhlgZf8Owy-9QB3qFwhaGsDu7EnA=w3024-h1562";
  public url = "https://arconnect.io";

  constructor() {}

  public async isAvailable() {
    if (typeof window === "undefined" || !window) {
      console.error(`[ArConnect Kit] "${this.id}" strategy is unavailable. Window is undefined`);
      return false;
    }

    if (window.arweaveWallet) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const listener = () => resolve(true);

      window.addEventListener("arweaveWalletLoaded", listener);

      // after 7 seconds, we stop listening
      setTimeout(() => {
        window.removeEventListener("arweaveWalletLoaded", listener);

        if (!window.arweaveWallet) {
          console.error(`[ArConnect Kit] "${this.id}" strategy is unavailable. window.arweaveWallet is undefined`);
        }

        resolve(!!window.arweaveWallet);
      }, 7000);
    });
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void> {
    return await this.#callWindowApi("connect", [permissions, appInfo, gateway]);
  }

  public async disconnect(): Promise<void> {
    return await this.#callWindowApi("disconnect");
  }

  public async getActiveAddress(): Promise<string> {
    return await this.#callWindowApi("getActiveAddress");
  }

  public async getAllAddresses(): Promise<string[]> {
    return await this.#callWindowApi("getAllAddresses");
  }

  public async getPermissions(): Promise<PermissionType[]> {
    return await this.#callWindowApi("getPermissions");
  }

  public async getWalletNames(): Promise<{ [addr: string]: string }> {
    return await this.#callWindowApi("getWalletNames");
  }

  public async sign(transaction: Transaction, options?: SignatureOptions): Promise<Transaction> {
    return await this.#callWindowApi("sign", [transaction, options]);
  }

  public async encrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    return await this.#callWindowApi("encrypt", [data, algorithm]);
  }

  public async decrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    return await this.#callWindowApi("decrypt", [data, algorithm]);
  }

  public async getArweaveConfig(): Promise<GatewayConfig> {
    return await this.#callWindowApi("getArweaveConfig");
  }

  public async signature(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    return await this.#callWindowApi("signature", [data, algorithm]);
  }

  public async getActivePublicKey(): Promise<string> {
    return await this.#callWindowApi("getActivePublicKey");
  }

  public async addToken(id: string): Promise<void> {
    return await this.#callWindowApi("addToken", [id]);
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return await this.#callWindowApi("dispatch", [transaction]);
  }

  /**
   * Call the window.arweaveWallet API and wait for it to be injected,
   * if it has not yet been injected.
   * 
   * @param fn Function name
   * @param params Params
   * @returns API result
   */
  async #callWindowApi(fn: string, params: any[] = []) {
    // if it is already injected
    if (window?.arweaveWallet) {
      // @ts-expect-error
      return await window.arweaveWallet[fn as any](...params);
    }

    // if it has not yet been injected
    return new Promise((resolve, reject) => window.addEventListener("arweaveWalletLoaded", async () => {
      try {
        // @ts-expect-error
        resolve(await window.arweaveWallet[fn as any](...params));
      } catch (e) {
        reject(e);
      }
    }));
  }
}