import { PermissionType, AppInfo, GatewayConfig } from "arconnect";

export default abstract class Strategy {
  // info
  public abstract name: string;
  public abstract description: string;
  public abstract theme?: string;
  public abstract logo: string;

  // connection
  public abstract connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig
  ): Promise<void>;
  public abstract disconnect(): Promise<void>;

  // other apis
  /*public abstract getActiveAddress(): Promise<string>;
  public abstract getAllAddresses(): Promise<string[]>;
  public abstract sign(): Promise<void>;
  public abstract getPermissions(): Promise<PermissionType[]>;*/
}