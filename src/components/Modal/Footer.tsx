import { PropsWithChildren } from "react";
import styled from "styled-components";

export function Footer({ children }: PropsWithChildren<{}>) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid rgb(${props => props.theme.light});
`;
