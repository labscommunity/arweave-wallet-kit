import { Title, TitleWithParagraph } from "../components/Title";
import { Application } from "../components/Application";
import { Paragraph } from "../components/Paragraph";
import { useModal } from "../components/Modal/hook";
import { Footer } from "../components/Modal/Footer";
import { Modal } from "../components/Modal/Modal";
import { Head } from "../components/Modal/Head";
import { Button } from "../components/Button";
import strategies from "../strategies";
import styled from "styled-components";

export function ConnectModal() {
  const modalController = useModal();

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
  padding-bottom: 1rem;
  max-height: 280px;
  overflow-y: auto;
`;
