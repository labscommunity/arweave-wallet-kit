import { styled } from "@linaria/react";
import type { HTMLProps } from "react";

export const Loading = (props: HTMLProps<SVGElement>) => (
  <SvgWrapper
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...(props as any)}
  >
    <circle
      cx="24"
      cy="24"
      fill="none"
      r="20"
      strokeDasharray="80"
      strokeLinecap="round"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <circle
      cx="24"
      cy="24"
      fill="none"
      opacity="0.3"
      r="20"
      strokeLinecap="round"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
  </SvgWrapper>
);

const SvgWrapper = styled.svg`
  color: currentColor;
  font-size: 1em;
  width: 1em;
  height: 1em;
  animation: rotate 0.9s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
