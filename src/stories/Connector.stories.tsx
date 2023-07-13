import { ArweaveWalletKit } from "../components/Provider";
import { Modal } from "../components/Modal/Modal";
import useConnection from "../hooks/connection";
import { useEffect, useState } from "react";
import useAddress from "../hooks/active_address";
import useAddresses, { useWalletNames } from "../hooks/addresses";
import useProfileModal from "../hooks/profile";
import { useApi } from "../hooks/strategy";

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => {
  return (
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_ALL_ADDRESSES",
          "SIGN_TRANSACTION"
        ],
        ensurePermissions: true,
        appInfo: {
          name: "Arweave Wallet Kit"
        }
      }}
    >
      <Button />
    </ArweaveWalletKit>
  );
};

const Button = () => {
  const connection = useConnection();
  const address = useAddress();

  const [status, setStatus] = useState("Idle...");

  useEffect(() => {
    setStatus(connection.connected ? "connected" : "disconnected");
  }, [connection.connected]);

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

  const addresses = useAddresses();
  const walletNames = useWalletNames();

  const profileModal = useProfileModal();

  const api = useApi();

  useEffect(() => {
    if (!api) return;
    if (api.id === "othent") {
      console.log("f");
      api.userDetails().then((res) => console.log(res));
    }
    console.log(api.sign);
  }, [api]);

  return (
    <>
      {connection.connected && (
        <button onClick={() => profileModal.setOpen(true)}>profile</button>
      )}
      <button
        onClick={() => {
          if (connection.connected) {
            disconnect();
          } else {
            connect();
          }
        }}
      >
        {connection.connected ? "disconnect" : "connect"}
      </button>
      {status}
      <br />
      {address}
      <br />
      <h1>Addresses</h1>
      {addresses.map((addr, i) => (
        <p key={i}>{addr}</p>
      ))}
      <h1>Wallet names</h1>
      {Object.keys(walletNames).map((addr, i) => (
        <p key={i}>
          {addr}: {walletNames[addr]}
        </p>
      ))}
    </>
  );
};
