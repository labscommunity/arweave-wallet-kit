import { DefaultTheme, withTheme } from "../../theme";
import type { PropsWithChildren } from "react";
import { CloseIcon } from "@iconicicons/react";
import { styled } from "@linaria/react";

export function Head({ children, onClose }: PropsWithChildren<Props>) {
  return (
    <HeadWrapper>
      {children}
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
    </HeadWrapper>
  );
}

const HeadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const CloseButton = withTheme(styled.div<{ theme: DefaultTheme }>`
  position: relative;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 100%;
  background-color: rgb(${(props) => props.theme.light});
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.23s ease-in-out, transform 0.125s ease,
    background-color 0.23s ease-in-out;

  &:hover {
    transform: scale(1.14);
  }

  &:active {
    transform: scale(0.92);
  }

  svg {
    font-size: 1.1rem;
    width: 1em;
    height: 1em;
    position: absolute;
    top: 50%;
    left: 50%;
    color: rgb(${(props) => props.theme.secondaryText});
    transform: translate(-50%, -50%);
  }
`);

interface Props {
  onClose: () => void;
}
