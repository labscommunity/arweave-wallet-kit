# ArConnect Kit

React Hooks and Components for better interaction with Arweave wallets. Modular, can support any Arweave-based wallet.

## Installation

```sh
yarn add @arconnect/kit
```

or

```sh
npm i @arconnect/kit
```

## Prerequisites

To use the library, you need to have `styled-components` installed. This library is not bundled with the ArConnect Kit, you'll need to include it in your project. Read more about this [here](https://styled-components.com/docs/faqs#i-am-a-library-author-should-i-bundle-styledcomponents-with-my-library).

```sh
yarn add styled-components
```

or

```sh
npm i styled-components
```

### SSR

`styled-components` needs special attention, if you wish to use ArConnect Kit correctly, with Server Side Rendering. You'll need to follow the guidlines to achieve this:

- With [Next.js](https://styled-components.com/docs/advanced#nextjs)
- With [Gatsby](https://styled-components.com/docs/advanced#gatsby)

## Setup

To use the library, you'll need to wrap your application with the Kit Provider.

```tsx
const App = () => {
  return (
    <ArConnectKit>
      <YourApp />
    </ArConnectKit>
  );
};
```

## Config

The ArConnect kit can be configured with information about your application and with a custom theme.

```tsx
...
  <ArConnectKit
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
  </ArConnectKit>
...
```

### App config

Using the `config` field of the `<ArConnectKit>` provider component, you can define a name, a logo or the required permissions for your app.

#### Available options

| Prop | Type | Default |   |
| ---- | ---- | ------- | - |
| `permissions` | [`PermissionType[]`](https://github.com/arconnectio/ArConnect#permissions) | `[]` | Permissions to connect with. |
| `ensurePermissions` | `boolean` | `false` | Ensure that all required permissions are present. If false, it only checks if the app has any permissions. |
| `appInfo` | [`AppInfo`](https://github.com/arconnectio/ArConnect#app-infos) | `{}` | Information about your app (name/logo). |
| `gatewayConfig` | `GatewayConfig` | arweave.net gateway | Configuration for the Arweave gateway to use.

### Custom theme

With the `theme` field, you can define a custom theme configuration for the ArConnect Kit modals and buttons.

#### Available options

| Prop | Type |   |
| ---- | ---- | - |
| `displayTheme` | `"dark" | "light"` | UI display theme to use |
| `accent` | `RGBObject` | RGB accent color for the UI |
| `radius` | `"default" | "minimal" | "none"` | Border radius level used throughout the Kit UI |

## Terminology of ArConnect Kit

ArConnect Kit supports several *strategies*. The word **strategy means an implementation of an Arweave Wallet** in the Kit. These strategies allow the user to communicate with all wallets the same way and with the same API.

## Hooks

Inside the [`<ArConnectKit>`](#setup), you can use all kinds of hooks that are reactive to the different [strategies](#terminology-of-arconnect-kit). Some of the hooks / api functions might not be supported by all wallets.


### `useConnection`

The core hook for connecting / disconnecting a [strategy](#terminology-of-arconnect-kit).

#### Usage

```ts
const {
  connected,
  connect,
  disconnect
} = useConnection();

// initiate connection
await connect();

// disconnect the connected strategy
await disconnect();

// is there a strategy connected?
connected ? "wallet connected" : "no connected wallet";
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

Permissions hook. Returns the permissions given to the app, known by ArConnect Kit.

#### Usage

```ts
const permissions = usePermissions();
```

### `useAddresses`

All addresses hook. Returns the addresses in the connected wallet, known by ArConnect Kit. Requires the `ACCESS_ALL_ADDRESSES` permission.

#### Usage

```ts
const addresses = useAddresses();
```

### `useWalletNames`

All addresses hook. Returns the addresses in the connected wallet, known by ArConnect Kit. Requires the `ACCESS_ALL_ADDRESSES` permission.

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

### `useApi`

API hook. Returns the active strategy's API as an interactable object. Can be used to sign/encrypt, etc.

#### Usage

```ts
const api = useApi();

// sign
await api.sign(transaction);

// encrypt
await api.encrypt(...)
```

Read more about the available APIs [here](https://github.com/arconnectio/ArConnect/#other-supported-functions).
