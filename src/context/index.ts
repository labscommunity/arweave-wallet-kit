import type { Actions, GlobalState } from "./faces";
import { Dispatch, createContext } from "react";

export const defaultState: GlobalState = {
  activeModal: false,
  activeStrategy: false,
  givenPermissions: [],
  config: {
    permissions: []
  }
};

const context = createContext<{
  state: GlobalState;
  dispatch: Dispatch<Actions>;
}>(undefined as any);

export default context;
