import { PermissionType, AppInfo, GatewayConfig } from "arconnect";

/** Basic action */
export interface Action {
  type: string;
  payload?: any;
}

/** All actions */

export interface OpenModalAction extends Action {
  type: "OPEN_MODAL";
  payload: ModalType;
}

export interface CloseModalAction extends Action {
  type: "CLOSE_MODAL";
}

export interface DisconnectAction extends Action {
  type: "DISCONNECT";
}

export interface UpdateStrategyAction extends Action {
  type: "UPDATE_STRATEGY";
  payload: string | false;
}

export interface UpdateConfig extends Action {
  type: "UPDATE_CONFIG";
  payload: Config;
}

export interface UpdateConnectId extends Action {
  type: "SET_CONNECT_ID";
  payload: string | undefined;
}

export interface UpdateAddress extends Action {
  type: "UPDATE_ADDRESS";
  payload: string;
}

/** Modal types */
export type ModalType = "connect" | "profile";

/** All possible actions for the global state reducer */
export type Actions = OpenModalAction | CloseModalAction | DisconnectAction | UpdateStrategyAction | UpdateConfig | UpdateConnectId | UpdateAddress;

/** Global state type */
export interface GlobalState {
  activeModal: ModalType | false;
  activeStrategy: string | false;
  config: Config;
  // unique id for the last connection call
  connectId?: string;
  activeAddress?: string;
}

/** Global config for ArConnect kit */
export interface Config {
  /** The permissions your app requires */
  permissions: PermissionType[];
  /** 
   * This will ensure that all required permissions are 
   * given to your app. If not, ArConnect kit will not 
   * consider the strategy "connected" 
   */
  ensurePermissions?: boolean;
  /** Information about your application */
  appInfo?: AppInfo;
  /** Custom Arweave gateway configuration */
  gatewayConfig?: GatewayConfig;
}
