"use client";

import { PropsWithChildren, useEffect, useMemo, useReducer } from "react";
import { darkTheme, lightTheme, ThemeProvider } from "../theme";
import { useSyncPermissions } from "../hooks/permissions";
import { useSyncAddress } from "../hooks/active_address";
import RestoreSession from "../modals/RestoreSession";
import Context, { defaultState } from "../context";
import { ConnectModal } from "../modals/Connect";
import { ProfileModal } from "../modals/Profile";
import type { Config } from "../context/faces";
import globalReducer from "../context/reducer";
import { rgbToString } from "../utils";
import { Helmet } from "react-helmet";

export function ArweaveWalletKit({
  children,
  theme = defaultTheme,
  config = defaultConfig
}: PropsWithChildren<Props>) {
  const [state, dispatch] = useReducer(globalReducer, {
    ...defaultState,
    config
  });

  // update config if it changes
  useEffect(() => {
    dispatch({
      type: "UPDATE_CONFIG",
      payload: config
    });
  }, [config]);

  // final theme config
  const themeConfig = useMemo<ThemeConfig>(
    () => ({
      ...defaultTheme,
      ...theme
    }),
    [theme]
  );

  return (
    <Context.Provider value={{ state, dispatch }}>
      <ThemeProvider
        theme={{
          ...(themeConfig.displayTheme === "light" ? lightTheme : darkTheme),
          displayTheme: themeConfig.displayTheme || "light",
          theme: rgbToString(themeConfig.accent),
          themeConfig
        }}
      >
        <AddressSync>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin=""
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          {children}
          <ConnectModal />
          <ProfileModal />
          <RestoreSession />
        </AddressSync>
      </ThemeProvider>
    </Context.Provider>
  );
}

const AddressSync = ({ children }: PropsWithChildren<{}>) => {
  useSyncPermissions();
  useSyncAddress();

  return <>{children}</>;
};

const defaultTheme: ThemeConfig = {
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
};

const defaultConfig: Config = {
  permissions: ["ACCESS_ADDRESS", "ACCESS_ALL_ADDRESSES"],
  ensurePermissions: false
};

interface Props {
  theme?: Partial<ThemeConfig>;
  config?: Config;
}

export interface ThemeConfig {
  displayTheme: "dark" | "light";
  accent: RGBObject;
  titleHighlight: RGBObject;
  radius: Radius;
}

export interface RGBObject {
  r: number;
  g: number;
  b: number;
}

export type Radius = "default" | "minimal" | "none";
