import { rgbToString } from "../utils";
import styled from "styled-components";

export const Title = styled.h1<{ small?: boolean; themed?: boolean }>`
  display: flex;
  font-family: "Manrope", sans-serif;
  font-size: ${(props) => (props.small ? "1.05rem" : "1.2rem")};
  font-weight: 600;
  color: rgb(
    ${props => {
      if (!props.themed) {
        return props.theme.primaryText;
      }

      return rgbToString(props.theme.themeConfig.titleHighlight);
    }}
  );
  cursor: ${(props) => (props.themed ? "pointer" : "text")};
  align-items: center;
  gap: 0.34rem;
  margin: 0;
  transition: color 0.23s ease-in-out;
`;

export const TitleWithParagraph = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;
