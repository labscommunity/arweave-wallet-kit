import { PropsWithChildren, useEffect, useReducer } from "react";
import { STRATEGY_STORE, syncStrategies } from "../strategy";
import Context, { defaultState } from "../context";
import { ThemeProvider } from "styled-components";
import { ConnectModal } from "../modals/Connect";
import globalReducer from "../context/reducer";
import { DisplayTheme } from "../vite-env";
import { Config } from "../context/faces";
import { Helmet } from "react-helmet";

export function ArConnectKit({
  children,
  theme = defaultTheme,
  config = defaultConfig
}: PropsWithChildren<Props>) {
  const [state, dispatch] = useReducer(
    globalReducer,
    {
      ...defaultState,
      config: config
    }
  );

  // update config if it changes
  useEffect(() => {
    dispatch({
      type: "UPDATE_CONFIG",
      payload: config
    });
  }, [config]);

  // try to get an active strategy on mount
  useEffect(() => {
    (async () => {
      let activeStrategy: string | false = localStorage?.getItem(STRATEGY_STORE) || false;

      if (!activeStrategy) {
        activeStrategy = await syncStrategies(
          config.permissions,
          !!config.ensurePermissions
        );
      }

      return dispatch({
        type: "UPDATE_STRATEGY",
        payload: activeStrategy
      });
    })();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <ThemeProvider theme={{
        ...(theme.displayTheme === "light" ? lightTheme : darkTheme),
        displayTheme: theme.displayTheme || "light",
        theme: `${theme.colorTheme?.r}, ${theme.colorTheme?.g}, ${theme.colorTheme?.b}`
      }}>
        <>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
          </Helmet>
          <ConnectModal />
          {children}
        </>
      </ThemeProvider>
    </Context.Provider>
  );
}

const defaultTheme: ThemeConfig = {
  displayTheme: "light",
  colorTheme: {
    r: 0,
    g: 0,
    b: 0
  }
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
  primaryText: "255, 255, 255",
  background: "26, 27, 31",
  secondaryText: "161, 161, 161",
  light: "44, 45, 49"
};

interface Props {
  theme?: Partial<ThemeConfig>;
  config?: Config;
}

interface ThemeConfig {
  displayTheme: "dark" | "light";
  colorTheme: {
    r: number;
    g: number;
    b: number;
  };
}
