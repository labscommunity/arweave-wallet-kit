import { DefaultTheme, withTheme } from "../theme";
import type { MouseEventHandler } from "react";
import type { Radius } from "./Provider";
import { Paragraph } from "./Paragraph";
import { styled } from "@linaria/react";
import { Button } from "./Button";
import { Title } from "./Title";

export function Application({
  logo,
  name,
  description,
  onClick,
  theme
}: Props) {
  return (
    <Wrapper>
      <AppInfo>
        <AppIcon colorTheme={theme} clickable onClick={onClick as any}>
          <Logo src={logo} draggable={false} />
        </AppIcon>
        <AppNameAndDescription>
          <Title small>{name}</Title>
          <Paragraph small>{description}</Paragraph>
        </AppNameAndDescription>
      </AppInfo>
      <Button onClick={onClick}>Go</Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const AppInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const Logo = styled.img`
  width: 60%;
  height: 60%;
  user-select: none;
  object-fit: contain;
`;

const radius: Record<Radius, number> = {
  default: 15,
  minimal: 6,
  none: 0
};

export const AppIcon = withTheme(styled.div<{
  colorTheme?: string;
  clickable?: boolean;
  theme: DefaultTheme;
}>`
  position: relative;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: ${(props) => radius[props.theme.themeConfig.radius] + "px"};
  background-color: rgb(
    ${(props) => props.colorTheme || props.theme.primaryText}
  );
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: transform 0.125s ease;

  ${Logo} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:active {
    transform: scale(${(props) => (props.clickable ? ".95" : "1")});
  }
`);

const AppNameAndDescription = styled.div`
  flex-shrink: 1;
`;

interface Props {
  logo: string;
  name: string;
  description: string;
  theme?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
