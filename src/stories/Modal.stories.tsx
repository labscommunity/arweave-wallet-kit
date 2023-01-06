import { Modal } from "../components/Modal";
import { ArConnectKit } from "../components/Provider"

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => (
  <ArConnectKit>
    <Modal open={true} onClose={() => {}}>
      <h1>Test</h1>
      <br />
      <br />
      <br />
      <br />
    </Modal>
  </ArConnectKit>
);
