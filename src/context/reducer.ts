import type { Actions, GlobalState } from "./faces";
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
        activeAddress: undefined,
        givenPermissions: []
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

    case "UPDATE_ADDRESS":
      return {
        ...state,
        activeAddress: action.payload
      };

    case "UPDATE_PERMISSIONS":
      return {
        ...state,
        givenPermissions: action.payload
      };

    default:
      break;
  }

  return state;
}
