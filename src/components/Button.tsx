import { DefaultTheme, withTheme } from "../theme";
import type { Radius } from "./Provider";
import { styled } from "@linaria/react";

const radius: Record<Radius, number> = {
  default: 30,
  minimal: 6,
  none: 0
};

export const Button = withTheme(styled.button<{ theme: DefaultTheme }>`
  display: flex;
  font-family: "Manrope", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background-color: rgb(${(props) => props.theme.theme});
  border-radius: ${(props) => radius[props.theme.themeConfig.radius] + "px"};
  padding: 0.3rem 0.8rem;
  text-align: center;
  border: none;
  outline: none;
  text-transform: uppercase;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.18s ease-in-out;

  &:hover:not(:active):not(:disabled) {
    transform: translate3d(0px, -1.4px, 0px);
    box-shadow: ${(props) =>
      props.theme.displayTheme === "light"
        ? `0px 0px 2px rgba(${
            props.theme.displayTheme === "light" ? "0, 0, 0" : "255, 255, 255"
          }, .15), 0px 4px 7px rgba(${
            props.theme.displayTheme === "light" ? "0, 0, 0" : "255, 255, 255"
          }, .1)`
        : "none"};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    font-size: 1em;
    width: 1em;
    height: 1em;
  }
`);
