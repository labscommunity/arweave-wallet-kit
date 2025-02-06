import { ArweaveWalletKit } from "../components/Provider";
import { Modal } from "../components/Modal/Modal";
import { Head } from "../components/Modal/Head";
import { Footer } from "../components/Modal/Footer";
import { Title, TitleWithParagraph } from "../components/Title";
import { Paragraph } from "../components/Paragraph";
import { Button } from "../components/Button";
import { Application } from "../components/Application";
import useModal from "../hooks/modal";
import { styled } from "@linaria/react";

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => {
  const modal = useModal(true);

  return (
    <ArweaveWalletKit>
      <Modal {...modal.bindings}>
        <Head onClose={modal.bindings.onClose}>
          <Title>Connect wallet</Title>
        </Head>
        <Apps>
          <Application
            name="Wander"
            description="Secure wallet management for Arweave"
            logo="https://arweave.net/ZafBy2bAp4kj-dFUVJm-EsupwgGhcDJPTpufsa7AYsI"
            theme="235, 224, 255"
          />
        </Apps>
        <Footer>
          <TitleWithParagraph>
            <Title small>New to Arweave?</Title>
            <Paragraph small>
              Click to learn more about the permaweb & wallets.
            </Paragraph>
          </TitleWithParagraph>
          <Button>MORE</Button>
        </Footer>
      </Modal>
    </ArweaveWalletKit>
  );
};

const Apps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
`;
