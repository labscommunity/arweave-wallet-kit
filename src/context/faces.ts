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

/** Modal types */
export type ModalType = "connect" | "profile";

/** All possible actions for the global state reducer */
export type Actions = OpenModalAction | CloseModalAction | DisconnectAction;

/** Global state type */
export interface GlobalState {
  activeModal: ModalType | false;
  activeStrategy: string | false;
  connectionData: {
    requiredPermissions: PermissionType[];
    appInfo?: AppInfo;
    gatewayConfig?: GatewayConfig;
  };
  walletState: {
    activeAddress?: string;
    addresses?: string[];
  }
}