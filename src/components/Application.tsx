import type { MouseEventHandler } from "react";
import type { Radius } from "./Provider";
import { Paragraph } from "./Paragraph";
import styled, { useTheme } from "styled-components";
import { Button } from "./Button";
import { Title } from "./Title";

export function Application({
  logo,
  name,
  description,
  onClick,
  theme
}: Props) {
  const globalTheme = useTheme();

  return (
    <Wrapper
      onClick={(e) => {
        if (globalTheme.themeConfig.details === "rich" || !onClick) {
          return;
        }

        // @ts-expect-error
        onClick(e);
      }}
    >
      <AppInfo>
        <AppIcon
          colorTheme={theme}
          clickable
          onClick={(e) => {
            if (globalTheme.themeConfig.details === "minimal" || !onClick) {
              return;
            }
    
            // @ts-expect-error
            onClick(e);
          }}
        >
          <Logo src={logo} />
        </AppIcon>
        <AppNameAndDescription>
          <Title small>{name}</Title>
          {globalTheme.themeConfig.details === "rich" && (
            <Paragraph small>{description}</Paragraph>
          )}
        </AppNameAndDescription>
      </AppInfo>
      {globalTheme.themeConfig.details === "rich" && (
        <Button onClick={onClick}>Go</Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  ${props => props.theme.themeConfig.details === "minimal" ? "cursor: pointer;" : ""}
  transition: all .125s ease;

  &::after {
    content: "";
    position: absolute;
    background-color: rgba(${props => props.theme.primaryText} , .05);
    top: -6px;
    left: 14px;
    right: 14px;
    bottom: -6px;
    opacity: 0;
    border-radius: 16px;
    transition: all .125s ease;
  }

  &:active {
    transform: scale(${props => props.theme.themeConfig.details === "minimal" ? ".98" : "1"});
  }

  &:hover::after {
    opacity: ${props => props.theme.themeConfig.details === "minimal" ? "1" : "0"};
  }

  ${Title} {
    ${props => props.theme.themeConfig.details === "minimal" ? "cursor: pointer;" : ""}
  }
`;

const AppInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  gap: ${props => props.theme.themeConfig.details === "rich" ? "0.8rem" : "0.7rem"};
`;

export const Logo = styled.img.attrs({
  draggable: false
})`
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

export const AppIcon = styled.div<{ colorTheme?: string; clickable?: boolean }>`
  position: relative;
  width: ${props => props.theme.themeConfig.details === "rich" ? "3.8rem" : "2.2rem"};
  height: ${props => props.theme.themeConfig.details === "rich" ? "3.8rem" : "2.2rem"};
  border-radius: ${(props) => radius[props.theme.themeConfig.radius] / (props.theme.themeConfig.details === "minimal" ?  1.4 : 1) + "px"};
  background-color: rgb(
    ${(props) => props.colorTheme || props.theme.primaryText}
  );
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: transform 0.125s ease;

  ${Logo} {
    position: absolute;
    ${(props) => {
      if (props.theme.themeConfig.details === "rich") return "";

      return `width: 70%; height: 70%;`;
    }}
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:active {
    transform: scale(${(props) => (props.clickable ? ".95" : "1")});
  }
`;

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
