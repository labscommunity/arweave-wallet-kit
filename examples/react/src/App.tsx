import BrowserWalletStrategy from "../../../strategies/browser-wallet";
import { ArweaveWalletKit, ConnectButton } from "../../../frameworks/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";
import WebWalletStrategy from "@arweave-wallet-kit/webwallet-strategy";
//import OthentStrategy from "@arweave-wallet-kit/othent-strategy";

export default function App() {
  return (
    <ArweaveWalletKit
      theme={{
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
      }}
      config={{
        strategies: [
          new ArConnectStrategy(),
          new WebWalletStrategy(),
          // @ts-expect-error
          //new OthentStrategy(),
          new BrowserWalletStrategy()
        ],
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
      }}
    >
      <ConnectButton accent={"rgb(0, 122, 255)"} />
    </ArweaveWalletKit>
  );
}
