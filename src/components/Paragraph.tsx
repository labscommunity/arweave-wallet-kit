import styled from "styled-components"

export const Paragraph = styled.p<{ small?: boolean }>`
  font-size: ${props => props.small ? ".7rem" : ".9rem"};
  color: rgb(${props => props.theme.secondaryText});
  margin: 0;
  font-weight: 600;
  transition: color .23s ease-in-out;
`;
