import { PermissionType, AppInfo, GatewayConfig } from "arconnect";
import { createContext, Dispatch } from "react";

interface GlobalState {
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

type ModalType = "connect" | "profile";

export const defaultState: GlobalState = {
  activeModal: false,
  activeStrategy: false,
  connectionData: {
    requiredPermissions: []
  },
  walletState: {}
};

interface Action {
  type: string;
  payload?: any;
}

interface OpenModalAction extends Action {
  type: "OPEN_MODAL";
  payload: ModalType;
}

interface CloseModalAction extends Action {
  type: "CLOSE_MODAL";
}

interface DisconnectAction extends Action {
  type: "DISCONNECT";
}

type Actions = OpenModalAction | CloseModalAction | DisconnectAction;

export const reducer = (
  state: GlobalState = defaultState,
  action: Actions
): GlobalState => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        activeModal: action.payload
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        activeModal: false
      };

    case "DISCONNECT":
      return {
        ...state,
        activeStrategy: false,
        walletState: {}
      };

    default:
      break;
  }

  return state;
};

const context = createContext<{
  state: GlobalState;
  dispatch: Dispatch<Actions>;
}>(undefined as any);

export default context;