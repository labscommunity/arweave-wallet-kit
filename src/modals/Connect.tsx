import { Title, TitleWithParagraph } from "../components/Title";
import { Application } from "../components/Application";
import { Paragraph } from "../components/Paragraph";
import { Footer } from "../components/Modal/Footer";
import { Modal } from "../components/Modal/Modal";
import { Head } from "../components/Modal/Head";
import { Button } from "../components/Button";
import useGlobalState from "../hooks/global";
import strategies from "../strategies";
import styled from "styled-components";
import useModal from "../hooks/modal";
import { useEffect } from "react";

export function ConnectModal() {
  const modalController = useModal();
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    modalController.setOpen(state?.activeModal === "connect");
  }, [state?.activeModal]);

  useEffect(() => {
    if (modalController.open) return;
    dispatch({ type: "CLOSE_MODAL" });
  }, [modalController.open])

  return (
    <Modal {...modalController.bindings}>
      <Head onClose={modalController.bindings.onClose}>
        <Title>
          Connect wallet
        </Title>
      </Head>
      <Apps>
        {strategies.map((strategy, i) => (
          <Application
            name={strategy.name}
            description={strategy.description}
            logo={strategy.logo}
            theme={strategy.theme}
            key={i}
          />
        ))}
      </Apps>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.2rem;
  max-height: 280px;
  overflow-y: auto;
`;
