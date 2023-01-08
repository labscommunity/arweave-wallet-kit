import ConnectButton from "../components/ConnectButton";
import { ArConnectKit } from "../components/Provider";
import { rgbToString } from "../utils";

export default {
  name: "ConnectButton",
  component: ConnectButton
};

export const Basic = () => (
  <ArConnectKit>
    <ConnectButton
      accent={"rgb(0, 122, 255)"}
    />
  </ArConnectKit>
);
