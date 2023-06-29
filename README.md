# Arweave Wallet Kit

React Hooks and Components for better interaction with Arweave wallets. Modular, can support any Arweave-based wallet.

> The Arweave Wallet Kit is in BETA. Please report bugs at the issues tab.

## Supported wallets

- [ArConnect](https://arconnect.io)
- [Arweave.app](https://arweave.app)
- Any extension-based Arweave wallet, that injects it's ArConnect-like API into `window.arweaveWallet`

## Installation

```sh
yarn add arweave-wallet-kit
```

or

```sh
npm i arweave-wallet-kit
```

## Setup

To use the library, you'll need to wrap your application with the Kit Provider.

```tsx
const App = () => {
  return (
    <ArweaveWalletKit>
      <YourApp />
    </ArweaveWalletKit>
  );
};
```

## Config

The Arweave Wallet Kit can be configured with information about your application and with a custom theme.

```tsx
...
  <ArweaveWalletKit
    config={{
      permissions: ["ACCESS_ADDRESS"],
      ensurePermissions: true,
      ...
    }}
    theme={{
      accent: { r: 255, g: 0, b: 0 },
      ...
    }}
  >
    <YourApp />
  </ArweaveWalletKit>
...
```

### App config

Using the `config` field of the `<ArweaveWalletKit>` provider component, you can define a name, a logo or the required permissions for your app.

#### Available options

| Prop                | Type                                                                                  | Default             |                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `permissions`       | [`PermissionType[]`](https://docs.arconnect.io/api/connect#permissions)               | `[]`                | Permissions to connect with.                                                                               |
| `ensurePermissions` | `boolean`                                                                             |  `false`            | Ensure that all required permissions are present. If false, it only checks if the app has any permissions. |
| `appInfo`           | [`AppInfo`](https://docs.arconnect.io/api/connect#additional-application-information) | `{}`                | Information about your app (name/logo).                                                                    |
| `gatewayConfig`     | `GatewayConfig`                                                                       | arweave.net gateway | Configuration for the Arweave gateway to use.                                                              |

### Custom theme

With the `theme` field, you can define a custom theme configuration for the Arweave Wallet Kit modals and buttons.

#### Available options

| Prop             | Type                               |                                                                        |
| ---------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `displayTheme`   | `"dark"`, `"light"`                | UI display theme to use                                                |
| `accent`         | `RGBObject`                        | RGB accent color for the UI                                            |
| `titleHighlight` | `RGBObject`                        | RGB accent color for the subscreen titles (like the connection screen) |
| `radius`         | `"default"`, `"minimal"`, `"none"` | Border radius level used throughout the Kit UI                         |

## Terminology of Arweave Wallet Kit

Arweave Wallet Kit supports several _strategies_. The word **strategy means an implementation of an Arweave Wallet** in the Kit. These strategies allow the user to communicate with all wallets the same way and with the same API.

## Connect Button

To quickly integrate the Arweave Wallet Kit, you can use the `<ConnectButton>` component. It is a highly customizable button that supports the [ANS](https://ar.page) protocol to display information about the connected wallet.

### Usage

```tsx
<ConnectButton
  accent="rgb(255, 0, 0)"
  profileModal={false}
  showBalance={true}
  ...
/>
```

### Config

You can configure the Connect Button through it's props.

| Props                | Type      |                                                                                         |
| -------------------- | --------- | --------------------------------------------------------------------------------------- |
| `accent`             | `string`  |  A theme color for the button                                                           |
| `showBalance`        | `boolean` | Show user balance when connected                                                        |
| `showProfilePicture` | `boolean` | Show user profile picture when connected                                                |
| `useAns`             | `boolean` | Use ANS to grab profile information                                                     |
| `profileModal`       | `boolean` | Show profile modal on click (if disabled, clicking the button will disconnect the user) |

## Hooks

Inside the [`<ArweaveWalletKit>`](#setup), you can use all kinds of hooks that are reactive to the different [strategies](#terminology-of-arweave-wallet-kit). Some of the hooks / api functions might not be supported by all wallets.

### `useConnection`

The core hook for connecting / disconnecting a [strategy](#terminology-of-arweave-wallet-kit).

#### Usage

```ts
const { connected, connect, disconnect } = useConnection();

// initiate connection
await connect();

// disconnect the connected strategy
await disconnect();

// is there a strategy connected?
connected ? "wallet connected" : "no connected wallet";
```

### `useApi`

API hook. Returns the active strategy's API as an interactable object. Can be used to sign/encrypt, etc.

**Some API functions might not be supported depending on the [strategy](#terminology-of-arweave-wallet-kit) the user chose. For example, Othent does not support the `signature()` function.** Make sure to verify beforehand.

#### Usage

```ts
const api = useApi();

// sign
await api.sign(transaction);

// encrypt
await api.encrypt(...)
```

### `useProfileModal`

Toggle / display a modal with profile information and a disconnect button.

```ts
const profileModal = useProfileModal();

profileModal.setOpen(true);
```

### `useActiveAddress`

Active address hook. Requires the `ACCESS_ADDRESS` and the `ACCESS_ALL_ADDRESSES` permission.

#### Usage

```ts
const address = useActiveAddress();
```

### `usePublicKey`

Active address hook. Requires the `ACCESS_PUBLIC_KEY` permission.

#### Usage

```ts
const publicKey = usePublicKey();
```

### `usePermissions`

Permissions hook. Returns the permissions given to the app, known by Arweave Wallet Kit.

#### Usage

```ts
const permissions = usePermissions();
```

### `useAddresses`

All addresses hook. Returns the addresses in the connected wallet, known by Arweave Wallet Kit. Requires the `ACCESS_ALL_ADDRESSES` permission.

#### Usage

```ts
const addresses = useAddresses();
```

### `useWalletNames`

All addresses hook. Returns the addresses in the connected wallet, known by Arweave Wallet Kit. Requires the `ACCESS_ALL_ADDRESSES` permission.

#### Usage

```ts
const walletNames = useWalletNames();
```

### `useStrategy`

Active strategy hook. Returns the currently used strategy's ID.

#### Usage

```ts
const strategy = useStrategy();
```
