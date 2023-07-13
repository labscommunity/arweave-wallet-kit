import { DefaultTheme, withTheme } from "../theme";
import { styled } from "@linaria/react";

export const Paragraph = withTheme(styled.p<{
  small?: boolean;
  theme: DefaultTheme;
}>`
  font-size: ${(props) => (props.small ? ".7rem" : ".9rem")};
  color: rgb(${(props) => props.theme.secondaryText});
  margin: 0;
  font-weight: 600;
  transition: color 0.23s ease-in-out;
`);
