import { AnimatePresence, motion, Variants } from "framer-motion";
import { CloseIcon } from "@iconicicons/react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

export function Modal({ open, onClose, children }: PropsWithChildren<Props>) {
  return (
    <AnimatePresence>
      {open && <BackgroundLayer key="bg" onClick={onClose} />}
      {open && (
        <Wrapper key="modal">
          {children}
        </Wrapper>
      )}
    </AnimatePresence>
  );
}

const backgroundAnimation: Variants = {
  shown: { opacity: 1 },
  hidden: { opacity: 0 }
};

const BackgroundLayer = styled(motion.div).attrs({
  variants: backgroundAnimation,
  initial: "hidden",
  animate: "shown",
  exit: "hidden",
  transition: {
    ease: "easeInOut",
    duration: 0.23
  }
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vw;
  z-index: 90000;
  background-color: rgba(0, 0, 0, .4);
`;

const modalAnimation: Variants = {
  shown: {
    opacity: 1,
    translateX: "-50%",
    translateY: "-50%",
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05
    }
  },
  hidden: {
    opacity: 0.4,
    translateX: "-50%",
    translateY: "100%",
    transition: {
      type: "spring",
      duration: 0.4
    }
  }
};

const Wrapper = styled(motion.div).attrs({
  variants: modalAnimation,
  initial: "hidden",
  animate: "shown",
  exit: "hidden"
})`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 28vw;
  background-color: rgb(${props => props.theme.background});
  border-radius: 30px;
  z-index: 100000;
  font-family: "Manrope", sans-serif;

  @media screen and (max-width: 1080px) {
    width: 50vw;
  }

  @media screen and (max-width: 720px) {
    width: 90vw;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
}

Modal.Head = ({ children, onClose }: PropsWithChildren<HeadProps>) => (
  <HeadWrapper>
    {children}
    <CloseButton onClick={onClose}>
      <CloseIcon />
    </CloseButton>
  </HeadWrapper>
);

const HeadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  h1 {
    font-family: "Manrope", sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: rgb(${props => props.theme.primaryText});
    margin: 0;
  }
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

interface HeadProps {
  onClose: () => void;
}