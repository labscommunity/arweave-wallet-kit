import { CopyIcon, LogOutIcon, UserIcon } from "@iconicicons/react";
import type { Radius } from "../components/Provider";
import { Paragraph } from "../components/Paragraph";
import { Modal } from "../components/Modal/Modal";
import useConnection from "../hooks/connection";
import { Head } from "../components/Modal/Head";
import { Button } from "../components/Button";
import useGlobalState from "../hooks/global";
import useGatewayURL from "../hooks/gateway";
import { useEffect, useState } from "react";
import { Title } from "../components/Title";
import useBalance from "../hooks/balance";
import { formatAddress } from "../utils";
import styled from "styled-components";
import useModal from "../hooks/modal";

export function ProfileModal() {
  // modal controlls and statuses
  const modalController = useModal();
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    modalController.setOpen(state?.activeModal === "profile");
  }, [state?.activeModal]);

  useEffect(() => {
    if (modalController.open) return;
    dispatch({ type: "CLOSE_MODAL" });
  }, [modalController.open, dispatch]);

  function onClose() {
    dispatch({ type: "CLOSE_MODAL" });
  }

  // load balance
  const balance = useBalance();

  // load ans profile
  const [ans, setAns] = useState<AnsProfile>();

  useEffect(() => {
    fetch(`https://ans-testnet.herokuapp.com/profile/${state.activeAddress}`)
      .then(async (res) => setAns(await res.json()))
      .catch();
  }, [state?.activeAddress]);

  // configured gateway
  const gateway = useGatewayURL();

  // disconnect
  const { disconnect } = useConnection();

  return (
    <Modal {...modalController.bindings} onClose={onClose}>
      <Head onClose={onClose}>
        <Title>Profile</Title>
      </Head>
      <ProfileData>
        <ProfilePicture
          profilePicture={ans?.avatar ? `${gateway}/${ans.avatar}` : undefined}
        >
          {!ans?.avatar && <ProfileIcon />}
        </ProfilePicture>
        <Title>
          {ans?.currentLabel
            ? `${ans.currentLabel}.ar`
            : formatAddress(state?.activeAddress || "", 8)}
          <CopyIcon
            onClick={() =>
              navigator.clipboard.writeText(state.activeAddress || "")
            }
          />
        </Title>
        <Paragraph>
          {balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          {" AR"}
        </Paragraph>
        <Button onClick={disconnect}>
          <LogOutIcon />
          Disconnect
        </Button>
      </ProfileData>
    </Modal>
  );
}

const btnRadius: Record<Radius, number> = {
  default: 18,
  minimal: 10,
  none: 0
};

const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 20px;

  ${Title}, ${Paragraph} {
    text-align: center;

    svg {
      font-size: 0.85em;
      width: 1em;
      height: 1em;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: all 0.125s ease-in-out;

      &:hover {
        opacity: 0.85;
      }

      &:active {
        transform: scale(0.9);
      }
    }
  }

  ${Button} {
    margin-top: 1.5rem;
    width: 100%;
    padding: 0.9rem 0;
    border-radius: ${props => btnRadius[props.theme.themeConfig.radius] + "px"};
    text-transform: none;
  }
`;

const pfpRadius: Record<Radius, string> = {
  default: "100%",
  minimal: "8px",
  none: "none"
};

const ProfilePicture = styled.div<{ profilePicture?: string }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: ${props => pfpRadius[props.theme.themeConfig.radius]};
  margin-bottom: 0.475rem;
  background-color: rgb(${(props) => props.theme.theme});
  background-size: cover;
  ${(props) =>
    props.profilePicture
      ? `background-image: url(${props.profilePicture});`
      : ""}
`;

const ProfileIcon = styled(UserIcon)`
  position: absolute;
  font-size: 45px;
  width: 1em;
  height: 1em;
  top: 50%;
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
`;

interface AnsProfile {
  user: string;
  currentLabel: string;
  ownedLabels?: {
    label: string;
    scarcity: string;
    acquisationBlock: number;
    mintedFor: number;
  }[];
  nickname?: string;
  address_color: string;
  bio?: string;
  avatar?: string;
  links?: {
    [key: string]: string;
  };
  subdomains?: any;
  freeSubdomains: number;
  timestamp: number;
}
