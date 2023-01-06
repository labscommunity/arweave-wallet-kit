import { ArConnectKit } from "../components/Provider";
import { Modal } from "../components/Modal";

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => (
  <ArConnectKit>
    <Modal open={true} onClose={() => {}}>
      <Modal.Head onClose={() => {}}>
        <h1>
          Connect wallet
        </h1>
      </Modal.Head>
      <br />
      <br />
      <br />
      <br />
    </Modal>
  </ArConnectKit>
);
