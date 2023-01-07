import Context, { defaultState, reducer as globalReducer } from "../context";
import { PropsWithChildren, useReducer } from "react";
import { ThemeProvider } from "styled-components";
import { ConnectModal } from "../modals/Connect";
import { DisplayTheme } from "../vite-env";
import { Helmet } from "react-helmet";

const defaultTheme: ThemeConfig = {
  displayTheme: "light",
  colorTheme: {
    r: 0,
    g: 0,
    b: 0
  }
};

const config: Config = {};

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

export function ArConnectKit({
  children,
  theme = defaultTheme,
  config = {}
}: PropsWithChildren<Props>) {
  const [state, dispatch] = useReducer(globalReducer, defaultState);

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

interface Props {
  theme?: Partial<ThemeConfig>;
  config?: Partial<Config>;
}

interface ThemeConfig {
  displayTheme: "dark" | "light";
  colorTheme: {
    r: number;
    g: number;
    b: number;
  };
}

interface Config {

}
