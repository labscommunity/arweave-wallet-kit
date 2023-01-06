import styled from "styled-components"

export const Title = styled.h1<{ small?: boolean }>`
  font-family: "Manrope", sans-serif;
  font-size: ${props => props.small ? "1.05rem" : "1.2rem"};
  font-weight: 600;
  color: rgb(${props => props.theme.primaryText});
  margin: 0;
`;

export const TitleWithParagraph = styled.div`
  display: flex;
  flex-direction: column;
  gap: .1rem;
`;
