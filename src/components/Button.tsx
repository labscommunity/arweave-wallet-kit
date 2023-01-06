import styled from "styled-components"

export const Button = styled.button`
  display: flex;
  font-family: "Manrope", sans-serif;
  font-size: .9rem;
  font-weight: 600;
  color: rgb(${props => props.theme.displayTheme === "dark" ? "0, 0, 0" : "255, 255, 255"});
  background-color: rgb(${props => props.theme.displayTheme === "light" ? "0, 0, 0" : "255, 255, 255"});
  border-radius: 30px;
  padding: .3rem .8rem;
  text-align: center;
  border: none;
  outline: none;
  text-transform: uppercase;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  white-space: nowrap;
  transition: all .18s ease-in-out;

  &:hover:not(:active):not(:disabled) {
    transform: translate3d(0px, -1.4px, 0px);
    box-shadow: 0px 0px 2px rgba(${props => props.theme.displayTheme === "light" ? "0, 0, 0" : "255, 255, 255"}, 0.15), 0px 4px 7px rgba(${props => props.theme.displayTheme === "light" ? "0, 0, 0" : "255, 255, 255"}, 0.1);
  }

  &:disabled {
    opacity: .7;
    cursor: not-allowed;
  }

  svg {
    font-size: 1em;
    width: 1em;
    height: 1em;
  }
`;
