import { CloseIcon } from "@iconicicons/react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

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

const CloseButton = styled.div`
  position: relative;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 100%;
  background-color: rgb(${props => props.theme.light});
  cursor: pointer;
  transition: opacity .23s ease-in-out;

  &:hover {
    opacity: .8;
  }

  &:active {
    transform: scale(.92);
  }

  svg {
    font-size: 1.1rem;
    width: 1em;
    height: 1em;
    position: absolute;
    top: 50%;
    left: 50%;
    color: rgb(${props => props.theme.secondaryText});
    transform: translate(-50%, -50%);
  }
`;

interface Props {
  onClose: () => void;
}
