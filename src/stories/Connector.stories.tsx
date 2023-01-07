import { ArConnectKit } from "../components/Provider";
import { Modal } from "../components/Modal/Modal";
import useConnection from "../hooks/connection";

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => {
  return (
    <ArConnectKit>
      <Button />
    </ArConnectKit>
  );
};

const Button = () => {
  const connection = useConnection();

  return (
    <button onClick={() => connection.connect()}>connect</button>
  );
}