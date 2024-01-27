import { DefaultTheme, Radius, withTheme } from "../../theme";
import { version } from "../../../package.json";
import type { PropsWithChildren } from "react";
import useMobile from "../../hooks/mobile";
import { styled } from "@linaria/react";
import {
  AnimatePresence,
  ForwardRefComponent,
  HTMLMotionProps,
  motion,
  MotionProps,
  Variants
} from "framer-motion";

export function Modal({
  open,
  onClose,
  children,
  className,
  variants,
  noWatermark = false
}: PropsWithChildren<Props>) {
  const mobile = useMobile();

  return (
    <AnimatePresence>
      {open && (
        <ModalScreen key="modal-screen" className="modal-screen">
          <BackgroundLayer
            className="modal-background"
            variants={backgroundAnimation}
            initial="hidden"
            animate="shown"
            exit="hidden"
            transition={{
              ease: "easeInOut",
              duration: 0.23
            }}
            key="bg"
            onClick={onClose}
          >
            {!noWatermark && <KitName>Arweave Wallet Kit v{version}</KitName>}
          </BackgroundLayer>
          <ModalAligner key="modal-aligner" className="modal-aligner">
            <ModalAnimator
              key="modal-animator"
              className={"modal-animator " + (className ? " " + className : "")}
              variants={variants || modalAnimation(mobile)}
              initial="hidden"
              animate="shown"
              exit="hidden"
            >
              <ModalContents>{children}</ModalContents>
            </ModalAnimator>
          </ModalAligner>
        </ModalScreen>
      )}
    </AnimatePresence>
  );
}

const backgroundAnimation: Variants = {
  shown: { opacity: 1 },
  hidden: { opacity: 0 }
};

const BackgroundLayer = styled(motion.div)`
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

const modalAnimation = (mobile = false): Variants => {
  return {
    shown: {
      top: 0,
      opacity: 1,
      width: mobile ? "100vw" : "50vw",
      transition: {
        type: "spring",
        duration: 0.4,
        delayChildren: 0.2,
        staggerChildren: 0.05
      }
    },
    hidden: {
      top: "100%",
      width: mobile ? "100vw" : "50vw",
      opacity: 0.4, // TODO(crookse) What's the reason for stopping at 0.4? Asking because a pause in animation is seen.
      transition: {
        type: "spring",
        duration: 0.4
      }
    }
  };
};

const radius: Record<Radius, number> = {
  default: 30,
  minimal: 12,
  none: 0
};

const ModalScreen = styled.div`
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100000;
`;

const ModalAligner = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 720px) {
    align-items: flex-end;
  }
`;

const ModalAnimator = withTheme(styled(motion.div as any)<any>`
  position: relative;
  left: 0;
  top: 100%;
  z-index: 100000;
  font-family: ${(props) => props.theme.themeConfig.font.fontFamily}, sans-serif;
  overflow: hidden;
  transition-property: width;

  *::selection {
    background-color: rgba(0, 0, 0, 0.75);
    color: #fff;
  }

  *::-moz-selection {
    background-color: rgba(0, 0, 0, 0.75);
    color: #fff;
  }

  @media screen and (min-width: 1081px) {
    max-width: 28vw;
  }

  @media screen and (min-width: 721px) and (max-width: 1080px) {
    max-width: 50vw;
  }

  @media screen and (max-width: 720px) {
    max-width: 100vw;
  }
`) as ForwardRefComponent<HTMLDivElement, HTMLMotionProps<"div">>;

const ModalContents = withTheme(styled.div<{ theme: DefaultTheme }>`
  transition: background-color 0.23s ease-in-out;
  background-color: rgb(${(props) => props.theme.background});
  border-radius: ${(props) => radius[props.theme.themeConfig.radius] + "px"};
  width: 100%;

  @media screen and (max-width: 720px) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`);

const KitName = withTheme(styled.p<{ theme: DefaultTheme }>`
  position: fixed;
  font-family: ${(props) => props.theme.themeConfig.font.fontFamily}, sans-serif;
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
`);

interface Props extends MotionProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  noWatermark?: boolean;
}
