import { ArweaveWalletKit } from "../components/Provider";
import ConnectButton from "../components/ConnectButton";
import type { ComponentStory } from "@storybook/react";

export default {
  name: "ConnectButton",
  component: ConnectButton
};

const Template: ComponentStory<typeof ArweaveWalletKit> = (props) => (
  <ArweaveWalletKit {...props}>
    <ConnectButton accent={"rgb(0, 122, 255)"} />
  </ArweaveWalletKit>
);

export const Basic = Template.bind({});

Basic.args = {
  theme: {
    displayTheme: "light",
    accent: {
      r: 0,
      g: 0,
      b: 0
    },
    titleHighlight: {
      r: 0,
      g: 122,
      b: 255
    },
    radius: "default"
  },
  config: {
    permissions: ["ACCESS_ADDRESS", "ACCESS_ALL_ADDRESSES"],
    ensurePermissions: true,
    appInfo: {
      name: "Test App",
      logo: "https://arweave.net/tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE"
    },
    gatewayConfig: {
      host: "arweave.net",
      port: 443,
      protocol: "https"
    }
  }
};
