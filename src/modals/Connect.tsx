import { AppIcon, Application, Logo } from "../components/Application";
import { Title, TitleWithParagraph } from "../components/Title";
import { useEffect, useMemo, useState } from "react";
import { Paragraph } from "../components/Paragraph";
import { Footer } from "../components/Modal/Footer";
import { Modal } from "../components/Modal/Modal";
import { Head } from "../components/Modal/Head";
import { Button } from "../components/Button";
import useGlobalState from "../hooks/global";
import strategies from "../strategies";
import styled from "styled-components";
import useModal from "../hooks/modal";
import { ChevronLeftIcon } from "@iconicicons/react"

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

  // selected strategy
  const [selectedStrategy, setSelectedStrategy] = useState<string>();

  // selected strategy data
  const strategyData = useMemo(() => strategies.find((s) => s.id === selectedStrategy), [selectedStrategy, strategies]);

  return (
    <Modal {...modalController.bindings}>
      <Head onClose={modalController.bindings.onClose}>
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
              logo={strategy.logo}
              theme={strategy.theme}
              onClick={() => setSelectedStrategy(strategy.id)}
              key={i}
            />
          ))}
        </Apps>
      )) || (
        <Connecting>
          <WalletData>
            <AppIcon colorTheme={strategyData?.theme}>
              <Logo src={strategyData?.logo} />
            </AppIcon>
            <Title small>
              Connecting to {strategyData?.name || ""}...
            </Title>
            <Paragraph>
              Confirm connection request in the wallet popup window
            </Paragraph>
          </WalletData>
        </Connecting>
      )}
      <Footer>
        <TitleWithParagraph>
          <Title small>
            New to Arweave?
          </Title>
          <Paragraph small>
            Click to learn more about the permaweb & wallets.
          </Paragraph>
        </TitleWithParagraph>
        <Button>
          MORE
        </Button>
      </Footer>
    </Modal>
  );
}

const Apps = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.2rem;
  height: 280px;
  overflow-y: auto;
`;

const Connecting = styled.div`
  position: relative;
  height: 280px;
`;

const WalletData = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  width: 70%;
  transform: translate(-50%, -50%);

  ${AppIcon} {
    margin: 0 auto .65rem;
  }

  ${Title} {
    text-align: center;
    font-weight: 700;
    margin-bottom: .1rem;
    justify-content: center;
  }

  ${Paragraph} {
    text-align: center;
  }
`;

const BackButton = styled(ChevronLeftIcon)`
  font-size: 1em;
  width: 1em;
  height: 1em;
  cursor: pointer;
  color: rgb(0, 122, 255);
  transform: scale(1.75);
  transition: transform .125s ease;

  &:active {
    transform: scale(1.5);
  }
`;
