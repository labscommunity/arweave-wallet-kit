import { AnimatePresence, motion, Variants } from "framer-motion";
import { version } from "../../../package.json";
import type { PropsWithChildren } from "react";
import useMobile from "../../hooks/mobile";
import type { Radius } from "../Provider";
import styled from "styled-components";

export function Modal({ open, onClose, children }: PropsWithChildren<Props>) {
  const mobile = useMobile();

  return (
    <AnimatePresence>
      {open && (
        <BackgroundLayer key="bg" onClick={onClose}>
          <KitName>ArConnect Kit v{version}</KitName>
        </BackgroundLayer>
      )}
      {open && (
        <Wrapper key="modal" mobile={mobile}>
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
  height: 100vh;
  z-index: 90000;
  background-color: rgba(0, 0, 0, 0.4);
`;

const modalAnimation = (mobile = false): Variants => ({
  shown: {
    opacity: 1,
    translateX: "-50%",
    translateY: mobile ? "0" : "-50%",
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
    translateY: "200%",
    transition: {
      type: "spring",
      duration: 0.4
    }
  }
});

const radius: Record<Radius, number> = {
  default: 30,
  minimal: 12,
  none: 0
};

const Wrapper = styled(motion.div).attrs<{ mobile: boolean }>((props) => ({
  variants: modalAnimation(props.mobile),
  initial: "hidden",
  animate: "shown",
  exit: "hidden"
}))<{ mobile: boolean }>`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 28vw;
  background-color: rgb(${(props) => props.theme.background});
  border-radius: ${(props) => radius[props.theme.themeConfig.radius] + "px"};
  z-index: 100000;
  font-family: "Manrope", sans-serif;
  overflow: hidden;
  transition: background-color 0.23s ease-in-out;

  @media screen and (max-width: 1080px) {
    width: 50vw;
  }

  @media screen and (max-width: 720px) {
    width: 100vw;
    top: unset;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const KitName = styled.p`
  position: fixed;
  font-family: "Manrope", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  user-select: none;
  cursor: default;
  text-align: center;
  margin: 0;
  color: rgb(255, 255, 255, 0.5);
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);

  @media screen and (max-width: 720px) {
    bottom: unset;
    top: 10px;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
}
