import styled from "styled-components";
import { MouseEventHandler } from "react";
import { Paragraph } from "./Paragraph";
import { Button } from "./Button";
import { Title } from "./Title";

export function Application({ logo, name, description, onClick, theme }: Props) {
  return (
    <Wrapper>
      <AppInfo>
        <AppIcon colorTheme={theme}>
          <Logo src={logo} />
        </AppIcon>
        <AppNameAndDescription>
          <Title small>
            {name}
          </Title>
          <Paragraph small>
            {description}
          </Paragraph>
        </AppNameAndDescription>
      </AppInfo>
      <Button onClick={onClick}>
        Go
      </Button>
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
  gap: .8rem;
`;

const Logo = styled.img.attrs({
  draggable: false
})`
  width: 60%;
  height: 60%;
  user-select: none;
  object-fit: contain;
`;

const AppIcon = styled.div<{ colorTheme?: string }>`
  position: relative;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 15px;
  background-color: rgb(${props => props.colorTheme || props.theme.primaryText});

  ${Logo} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const AppNameAndDescription = styled.div`
  max-width: 250px;
`;

interface Props {
  logo: string;
  name: string;
  description: string;
  theme?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}