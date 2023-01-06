import { ArConnectKit } from "../components/Provider";
import { Modal } from "../components/Modal";
import { Head } from "../components/Head";
import { Footer } from "../components/Footer"
import { Title, TitleWithParagraph } from "../components/Title"
import { Paragraph } from "../components/Paragraph"

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => (
  <ArConnectKit>
    <Modal open={true} onClose={() => {}}>
      <Head onClose={() => {}}>
        <Title>
          Connect wallet
        </Title>
      </Head>
      <br />
      <br />
      <br />
      <br />
      <Footer>
        <TitleWithParagraph>
          <Title small>
            New to Arweave?
          </Title>
          <Paragraph small>
            Click to learn more about the permaweb & wallets.
          </Paragraph>
        </TitleWithParagraph>
      </Footer>
    </Modal>
  </ArConnectKit>
);
