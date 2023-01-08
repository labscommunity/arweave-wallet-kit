import { PropsWithChildren, useEffect, useMemo, useReducer } from "react";
import { useSyncPermissions } from "../hooks/permissions";
import { useSyncAddress } from "../hooks/active_address";
import { useSyncStrategy } from "../hooks/strategy";
import Context, { defaultState } from "../context";
import { ThemeProvider } from "styled-components";
import { ConnectModal } from "../modals/Connect";
import { ProfileModal } from "../modals/Profile";
import type { DisplayTheme } from "../vite-env";
import type { Config } from "../context/faces";
import globalReducer from "../context/reducer";
import { rgbToString } from "../utils";
import { Helmet } from "react-helmet";

export function ArConnectKit({
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

  useSyncStrategy(state?.config, dispatch);

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

const lightTheme: DisplayTheme = {
  primaryText: "0, 0, 0",
  background: "255, 255, 255",
  secondaryText: "146, 146, 147",
  light: "242, 242, 247"
};

const darkTheme: DisplayTheme = {
  primaryText: "240, 240, 240",
  background: "26, 27, 31",
  secondaryText: "161, 161, 161",
  light: "44, 45, 49"
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
