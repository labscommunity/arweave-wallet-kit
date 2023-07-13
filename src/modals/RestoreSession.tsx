import { STRATEGY_STORE, syncStrategies } from "../strategy";
import type { Radius } from "../components/Provider";
import { DefaultTheme, withTheme } from "../theme";
import { Modal } from "../components/Modal/Modal";
import type Strategy from "../strategy/Strategy";
import type { Variants } from "framer-motion";
import { Button } from "../components/Button";
import useGlobalState from "../hooks/global";
import { useEffect, useState } from "react";
import useModal from "../hooks/modal";
import { styled } from "@linaria/react";

export default function RestoreSession() {
  // modal controlls and statuses
  const modalController = useModal();
  const { state, dispatch } = useGlobalState();

  // strategy with session to restore
  const [strategyToRestore, setStrategyToRestore] = useState<Strategy>();

  // sync strategy from previous session
  useEffect(() => {
    (async () => {
      const activeStrategy = await syncStrategies(
        state?.config.permissions || [],
        !!state?.config.ensurePermissions
      );

      // we need to ask the user if they
      // want to resume an existing session
      // this is necessary for Arweave.app
      // because opening popups without user
      // action is disabled by default in the
      // browser
      // @ts-expect-error
      if (!!activeStrategy && !!activeStrategy.resumeSession) {
        setStrategyToRestore(activeStrategy as Strategy);
        modalController.setOpen(true);
      } else {
        // if there is not active strategy or
        // the active strategy's previous session
        // does not need to be resumed manually
        dispatch({
          type: "UPDATE_STRATEGY",
          payload: (!!activeStrategy && activeStrategy.id) || false
        });
      }
    })();
  }, []);

  // remove previous session data
  function clearSession() {
    localStorage.removeItem(STRATEGY_STORE);
    dispatch({ type: "DISCONNECT" });
  }

  // restore previous session
  async function restore() {
    let activeStrategy: Strategy | false = false;

    if (!!strategyToRestore?.resumeSession) {
      activeStrategy = strategyToRestore;

      try {
        await strategyToRestore.resumeSession();
      } catch {
        activeStrategy = false;
      }
    }

    // remove modal & strategy to restore
    setStrategyToRestore(undefined);
    modalController.setOpen(false);

    // update active strategy
    dispatch({
      type: "UPDATE_STRATEGY",
      payload: (!!activeStrategy && activeStrategy.id) || false
    });

    // remove strategy
    if (!activeStrategy) {
      clearSession();
    }
  }

  function cancel() {
    // remove modal & strategy to restore
    setStrategyToRestore(undefined);
    modalController.setOpen(false);

    // remove strategy
    clearSession();
  }

  return (
    <BottomModal
      variants={bottomModalVariants}
      {...modalController.bindings}
      onClose={cancel}
      noWatermark
    >
      <Text>
        Would you like to restore your {strategyToRestore?.name + " " || ""}
        session?
      </Text>
      <Buttons>
        <Button onClick={restore}>Restore</Button>
        <CloseButton onClick={cancel}>Cancel</CloseButton>
      </Buttons>
    </BottomModal>
  );
}

const bottomModalVariants: Variants = {
  shown: {
    opacity: 1,
    translateY: "-1.5rem",
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.025
    }
  },
  hidden: {
    opacity: 0.4,
    translateY: "200%",
    transition: {
      type: "spring",
      duration: 0.4
    }
  }
};

const radius: Record<Radius, number> = {
  default: 15,
  minimal: 8,
  none: 0
};

const BottomModal = withTheme(styled(Modal as any)<any>`
  display: flex;
  align-items: center;
  gap: 1.24rem;
  padding: 0.75rem 1rem;
  border-radius: ${(props) =>
    radius[props.theme.themeConfig.radius as Radius] + "px"};
  border-radius: 15px;
  bottom: 0;
  right: 1.5rem;
  left: unset;
  top: unset;
  width: auto;

  @media screen and (max-width: 720px) {
    left: 1.5rem;
    gap: 1rem;
  }
`) as typeof Modal;

const Text = withTheme(styled.p<{ theme: DefaultTheme }>`
  font-size: 1.05rem;
  font-weight: 500;
  color: rgb(${(props) => props.theme.primaryText});
  margin: 0px;
`);

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  @media screen and (max-width: 720px) {
    flex-direction: column;

    ${Button} {
      width: 100%;
    }
  }
`;

const CloseButton = withTheme(styled(Button)<{ theme: DefaultTheme }>`
  background-color: transparent;
  color: rgb(${(props) => props.theme.primaryText});

  &:hover {
    background-color: rgba(${(props) => props.theme.theme}, 0.05);
    color: rgb(${(props) => props.theme.theme});
    box-shadow: none !important;
  }
`);
