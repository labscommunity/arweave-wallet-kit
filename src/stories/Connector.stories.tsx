import { ArConnectKit } from "../components/Provider";
import { Modal } from "../components/Modal/Modal";
import useConnection from "../hooks/connection";
import { useState } from "react";

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => {
  return (
    <ArConnectKit
      config={{
        permissions: ["ACCESS_ADDRESS", "ACCESS_ALL_ADDRESSES", "SIGN_TRANSACTION"],
        ensurePermissions: true,
        appInfo: {
          name: "ArConnect Kit"
        }
      }}
    >
      <Button />
    </ArConnectKit>
  );
};

const Button = () => {
  const connection = useConnection();

  const [status, setStatus] = useState("Idle...");

  async function connect() {
    try {
      await connection.connect();
      setStatus("connected");
    } catch {
      setStatus("cancelled");
    }
  }

  return (
    <>
      <button onClick={connect}>connect</button>
      {status}
    </>
  );
}