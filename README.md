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
      ensurePermissions: true
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
| `ensurePermissions` | `boolean` | `false` | Ensure that all required permissions are present. If false, it only checks if the app has any permissions. |
| `appInfo` | [`AppInfo`](https://github.com/arconnectio/ArConnect#app-infos) | `{}` | Information about your app (name/logo). |
| `gatewayConfig` | `GatewayConfig` | arweave.net gateway | Configuration for the Arweave gateway to use.