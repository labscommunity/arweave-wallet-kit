import { ArConnectKit } from "../components/Provider";
import { Modal } from "../components/Modal/Modal";
import useConnection from "../hooks/connection";
import { useEffect, useState } from "react";
import useAddress from "../hooks/active_address"

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
  const address = useAddress();

  const [status, setStatus] = useState("Idle...");

  useEffect(() => {
    if (connection.connected) {
      setStatus("connected")
    }
  }, [connection])

  async function connect() {
    try {
      await connection.connect();
    } catch {
      setStatus("cancelled");
    }
  }

  async function disconnect() {
    try {
      await connection.disconnect();
    } catch {}
  }

  return (
    <>
      <button onClick={() => {
        if (connection.connected) {
          disconnect();
        } else {
          connect();
        }
      }}>{connection.connected ? "disconnect" : "connect"}</button>
      {status}
      <br />
      {address}
    </>
  );
}