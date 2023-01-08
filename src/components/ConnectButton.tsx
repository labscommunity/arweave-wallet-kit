import { ChevronDownIcon, UserIcon } from "@iconicicons/react";
import useAddress from "../hooks/active_address";
import useConnection from "../hooks/connection";
import useProfileModal from "../hooks/profile";
import useBalance from "../hooks/balance";
import { formatAddress } from "../utils";
import type { Radius } from "./Provider";
import type { HTMLProps } from "react";
import styled from "styled-components";
import useAns from "../hooks/useAns";
import { Button } from "./Button";

export default function ConnectButton({
  accent,
  onClick,
  ...props
}: HTMLProps<HTMLButtonElement> & Props) {
  // connection
  const { connected, connect, disconnect } = useConnection();

  // active address
  const address = useAddress();

  // balance
  const balance = useBalance();

  // ans profile
  const ans = useAns();

  // profile modal
  const profileModal = useProfileModal();

  return (
    <Wrapper
      accent={accent}
      onClick={async (e) => {
        if (!connected) await connect();
        else profileModal.setOpen(true);

        if (onClick) return onClick(e);
      }}
      {...(props as any)}
    >
      {(connected && (
        <>
          <Balance>
            {balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) +
              " AR"}
          </Balance>
          <ProfileSection>
            {(ans?.avatar && <Avatar src={ans?.avatar} />) || (
              <AvatarPlaceholder>
                <AvatarIcon />
              </AvatarPlaceholder>
            )}
            {ans?.currentLabel || formatAddress(address || "", 5)}
            <ExpandIcon />
          </ProfileSection>
        </>
      )) || <ConnectText>Connect Wallet</ConnectText>}
    </Wrapper>
  );
}

const radius: Record<Radius, number> = {
  default: 18,
  minimal: 10,
  none: 0
};

const Wrapper = styled(Button)<{ accent?: string }>`
  border-radius: ${(props) => radius[props.theme.themeConfig.radius] + "px"};
  text-transform: none;
  padding: 0.3rem;
  background-color: ${(props) => props.accent || `rgb(${props.theme.theme})`};
`;

const ConnectText = styled.span`
  line-height: 2.6rem;
  padding: 0 0.9rem;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(${(props) => props.theme.background}, 0.2);
  height: 2.6rem;
  border-radius: ${(props) =>
    radius[props.theme.themeConfig.radius] - 3 + "px"};
  padding: 0 0.3rem 0 0.6rem;
  gap: 0.25rem;
`;

const Balance = styled.span`
  padding: 0 0.5rem;
`;

const ExpandIcon = styled(ChevronDownIcon)`
  font-size: 1.5rem !important;
`;

const avatarRadius: Record<Radius, string> = {
  default: "100%",
  minimal: "5px",
  none: "0px"
};

const Avatar = styled.img.attrs({
  draggable: false
})`
  user-select: none;
  border-radius: ${(props) => avatarRadius[props.theme.themeConfig.radius]};
  object-fit: cover;
  width: 1.7rem;
  height: 1.7rem;
  margin-right: 0.4rem;
`;

const AvatarIcon = styled(UserIcon)`
  font-size: 1rem !important;
  color: #fff;
`;

const AvatarPlaceholder = styled.span`
  position: relative;
  border-radius: ${(props) => avatarRadius[props.theme.themeConfig.radius]};
  width: 1.7rem;
  height: 1.7rem;
  margin-right: 0.4rem;
  background: linear-gradient(to right, #4776e6, #8e54e9);
  background-size: cover;

  ${AvatarIcon} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface Props {
  accent?: string;
}
