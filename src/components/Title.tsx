import styled from "styled-components"

export const Title = styled.h1<{ small?: boolean; themed?: boolean; }>`
  display: flex;
  font-family: "Manrope", sans-serif;
  font-size: ${props => props.small ? "1.05rem" : "1.2rem"};
  font-weight: 600;
  color: rgb(${props => props.themed ? "0, 122, 255" : props.theme.primaryText});
  cursor: ${props => props.themed ? "pointer" : "text"};
  align-items: center;
  gap: .34rem;
  margin: 0;
  transition: color .23s ease-in-out;
`;

export const TitleWithParagraph = styled.div`
  display: flex;
  flex-direction: column;
  gap: .1rem;
`;
