import { AnimatePresence, motion, Variants } from "framer-motion";
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
  width: 25vw;
  background-color: rgb(${props => props.theme.background});
  border-radius: 30px;
  padding: 20px;
  z-index: 100000;
`;

interface Props {
  open: boolean;
  onClose: () => void;
}