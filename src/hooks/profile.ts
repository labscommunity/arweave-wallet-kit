import useGlobalState from "./global";
import { useEffect } from "react";

export default function useProfileModal() {
  // global context
  const { state, dispatch } = useGlobalState();

  // close modal on disconnect
  useEffect(() => {
    if (state.activeStrategy || state.activeModal !== "profile") return;
    dispatch({ type: "CLOSE_MODAL" });
  }, [state, dispatch]);

  return {
    setOpen(val: boolean) {
      if (!state.activeStrategy) {
        throw new Error("[Arweave Wallet Kit] App not connected");
      }

      if (val) {
        dispatch({
          type: "OPEN_MODAL",
          payload: "profile"
        });
      } else {
        dispatch({ type: "CLOSE_MODAL" });
      }
    },
    open: state.activeModal === "profile"
  };
}
