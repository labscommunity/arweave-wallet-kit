import { Actions, GlobalState } from "./faces";
import { defaultState } from "./index";

export default function reducer(
  state: GlobalState = defaultState,
  action: Actions
): GlobalState {
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

    case "UPDATE_STRATEGY":
      return {
        ...state,
        activeStrategy: action.payload
      };

    case "UPDATE_CONFIG":
      return {
        ...state,
        config: action.payload
      };

    case "SET_CONNECT_ID":
      return {
        ...state,
        connectId: action.payload
      };

    case "UPDATE_ADDRESS":
      return {
        ...state,
        walletState: {
          ...state.walletState,
          activeAddress: action.payload
        }
      };

    default:
      break;
  }

  return state;
}