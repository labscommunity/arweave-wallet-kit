import { AppIcon, Application, Logo } from "../components/Application";
import strategies, { getStrategy, saveStrategy } from "../strategy";
import { Title, TitleWithParagraph } from "../components/Title";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon } from "@iconicicons/react";
import type { Radius } from "../components/Provider";
import { Paragraph } from "../components/Paragraph";
import { Footer } from "../components/Modal/Footer";
import { DefaultTheme, withTheme } from "../theme";
import { Modal } from "../components/Modal/Modal";
import type Strategy from "../strategy/Strategy";
import { Loading } from "../components/Loading";
import { Head } from "../components/Modal/Head";
import useConnection from "../hooks/connection";
import { Button } from "../components/Button";
import useGlobalState from "../hooks/global";
import useGatewayURL from "../hooks/gateway";
import { styled } from "@linaria/react";
import useModal from "../hooks/modal";

export function ConnectModal() {
  // modal controlls and statuses
  const modalController = useModal();
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    modalController.setOpen(state?.activeModal === "connect");
  }, [state?.activeModal]);

  useEffect(() => {
    if (modalController.open) return;
    setSelectedStrategy(undefined);
    dispatch({ type: "CLOSE_MODAL" });
  }, [modalController.open]);

  // connection
  const { connected } = useConnection();

  // close modal if the user is connected
  useEffect(() => {
    if (!connected || state?.activeModal !== "connect") return;
    dispatch({ type: "CLOSE_MODAL" });
  }, [connected, state]);

  // selected strategy
  const [selectedStrategy, setSelectedStrategy] = useState<string>();

  // selected strategy data
  const strategyData = useMemo(
    () => (selectedStrategy ? getStrategy(selectedStrategy) : undefined),
    [selectedStrategy, strategies]
  );

  // loadings
  const [connecting, setConnecting] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // strategy available
  const [strategyAvailable, setStrategyAvailable] = useState(false);

  // show retry button
  const [retry, setRetry] = useState(false);

  // go to connect screen for strategy
  async function goToConnect(strategyID: string) {
    // get strategy
    const s = strategies.find((s) => s.id === strategyID);

    if (!s) return;

    // check if available
    setLoadingAvailability(true);
    setSelectedStrategy(strategyID);

    let available = false;

    try {
      available = await s.isAvailable();
    } catch {
      available = false;
    }

    setStrategyAvailable(available);
    setLoadingAvailability(false);

    if (!available) {
      return;
    }

    await tryConnecting(s as Strategy);
  }

  // try to connect
  async function tryConnecting(s: Strategy) {
    setRetry(false);
    setConnecting(true);

    try {
      // connect
      await s.connect(
        state.config.permissions,
        state.config.appInfo,
        state.config.gatewayConfig
      );

      // send success message
      postMessage({
        type: "connect_result",
        res: true
      });

      // close modal
      dispatch({ type: "CLOSE_MODAL" });

      // save strategy
      saveStrategy(s.id);
      dispatch({
        type: "UPDATE_STRATEGY",
        payload: s.id
      });
    } catch {
      fixupArConnectModal();
      setRetry(true);
      dispatch({
        type: "UPDATE_STRATEGY",
        payload: false
      });
    }

    setConnecting(false);
  }

  // on connect modal close
  function onClose() {
    postMessage({
      type: "connect_result",
      res: false
    });
    dispatch({ type: "CLOSE_MODAL" });
  }

  // active gateway url
  const gateway = useGatewayURL();

  function fixupArConnectModal() {
    try {
      document
        .querySelectorAll(".arconnect_connect_overlay_extension_temporary")
        .forEach((el) => el.remove());
    } catch {}
  }

  // is the browser Brave
  const [isBrave, setIsBrave] = useState(false);

  useEffect(() => {
    (async () => {
      // @ts-expect-error
      const brave: boolean = navigator.brave && await navigator.brave.isBrave();

      setIsBrave(brave);
    })();
  }, []);

  return (
    <Modal {...modalController.bindings} onClose={onClose}>
      <Head onClose={onClose}>
        <Title
          themed={!!selectedStrategy}
          onClick={() => {
            if (!selectedStrategy) return;
            setSelectedStrategy(undefined);
          }}
        >
          {selectedStrategy && <BackButton />}
          {strategyData ? strategyData.name : "Connect wallet"}
        </Title>
      </Head>
      {(!selectedStrategy && (
        <Apps>
          {strategies.map((strategy, i) => (
            <Application
              name={strategy.name}
              description={strategy.description}
              logo={`${gateway}/${strategy.logo}`}
              theme={strategy.theme}
              onClick={() => goToConnect(strategy.id)}
              key={i}
            />
          ))}
        </Apps>
      )) || (
        <Connecting>
          <WalletData>
            <AppIcon colorTheme={strategyData?.theme}>
              <Logo src={`${gateway}/${strategyData?.logo}`} draggable={false} />
            </AppIcon>
            {(strategyAvailable && (
              <>
                <Title small>Connecting to {strategyData?.name || ""}...</Title>
                <Paragraph>
                  Confirm connection request in the wallet popup window
                </Paragraph>
                {strategyData?.id === "othent" && isBrave && (
                  <BraveParagraph>
                    You might need to <b>disable Brave shields</b> for this to work properly.
                  </BraveParagraph>
                )}
                {retry && strategyData && (
                  <Button
                    onClick={() => tryConnecting(strategyData as Strategy)}
                  >
                    Retry
                  </Button>
                )}
              </>
            )) ||
              (!loadingAvailability && (
                <>
                  <Title small>
                    {strategyData?.name || ""} is not available.
                  </Title>
                  <Paragraph>
                    If you don't have it yet, you can try to download it
                  </Paragraph>
                  {
                    // @ts-expect-error
                    strategyData?.url && (
                      <Button
                        onClick={() => {
                          // @ts-expect-error
                          window.open(strategyData.url);
                        }}
                      >
                        Download
                      </Button>
                    )
                  }
                </>
              ))}
            {(connecting || loadingAvailability) && <ConnectLoading />}
          </WalletData>
        </Connecting>
      )}
      <Footer>
        <TitleWithParagraph>
          <Title small>Don't have a wallet?</Title>
          <Paragraph small>
            Click to learn more about the permaweb & wallets.
          </Paragraph>
        </TitleWithParagraph>
        <Button onClick={() => window.open("https://arwiki.wiki/#/en/wallets")}>
          Get
        </Button>
      </Footer>
    </Modal>
  );
}

const Apps = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding-bottom: 1.2rem;
  max-height: 280px;
  overflow-y: auto;
`;

const Connecting = styled.div`
  position: relative;
  height: 280px;
`;

const WalletData = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 45%;
  left: 50%;
  width: 70%;
  transform: translate(-50%, -50%);

  ${AppIcon} {
    margin-bottom: 0.65rem;
  }

  ${Title} {
    text-align: center;
    font-weight: 700;
    margin-bottom: 0.1rem;
    justify-content: center;
  }

  ${Paragraph} {
    text-align: center;
  }

  ${Button} {
    margin-top: 1rem;
  }
`;

const radius: Record<Radius, number> = {
  default: 14,
  minimal: 8,
  none: 0
};

const BraveParagraph = withTheme(styled(Paragraph)<{ theme: DefaultTheme }>`
  background-color: rgba(251, 85, 43, 0.2);
  color: #fb542b;
  padding: .44rem;
  border-radius: ${props => radius[props.theme.themeConfig.radius] + "px"};
  margin-top: .6rem;
`);

const ConnectLoading = withTheme(styled(Loading)<{ theme: DefaultTheme }>`
  display: block;
  margin: 0 auto;
  margin-top: 1rem;
  color: rgb(${(props) => props.theme.primaryText});
  width: 1.25rem;
  height: 1.25rem;
`);

const BackButton = styled(ChevronLeftIcon)`
  font-size: 1em;
  width: 1em;
  height: 1em;
  cursor: pointer;
  color: rgb(0, 122, 255);
  transform: scale(1.75);
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.125s ease;

  &:hover {
    transform: scale(1.9);
  }

  &:active {
    transform: scale(1.5);
  }
`;
