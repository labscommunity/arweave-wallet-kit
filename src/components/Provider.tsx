import { ThemeProvider } from "styled-components";
import { PropsWithChildren } from "react";

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
  return (
    <ThemeProvider theme={{
      ...(theme.displayTheme === "light" ? lightTheme : darkTheme),
      theme: `${theme.colorTheme?.r}, ${theme.colorTheme?.g}, ${theme.colorTheme?.b}`
    }}>
      {children}
    </ThemeProvider>
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

interface DisplayTheme {
  background: string;
  primaryText: string;
  secondaryText: string;
  light: string;
}
