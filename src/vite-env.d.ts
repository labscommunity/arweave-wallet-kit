import "styled-components";

/// <reference types="vite/client" />

declare module "styled-components" {
  export interface DefaultTheme extends DisplayTheme {
    displayTheme: "dark" | "light";
    theme: string;
  }
}

export interface DisplayTheme {
  background: string;
  primaryText: string;
  secondaryText: string;
  light: string;
}
