import styled from "styled-components";
import { Character } from "../types/types";

const DynamicBackground = styled.div<{ $character: Character }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;

  // Crowley's mystical particles
  ${(props) =>
    props.$character.id === "crowley" &&
    `
    background: ${props.theme.background};
    background-image: radial-gradient(circle at center, 
      ${props.theme.accent}11 1px, 
      transparent 1px
    );
    background-size: 50px 50px;
    animation: floatingParticles 20s linear infinite;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 50% 50%, 
          ${props.theme.accent}11 1px, 
          transparent 1px);
      background-size: 50px 50px;
      animation: floatParticles 20s linear infinite;
    }

    @keyframes floatParticles {
      0% { background-position: 0 0; }
      100% { background-position: 50px 50px; }
    }
  `}

  // Musk's tech grid
  ${(props) =>
    props.$character.id === "musk" &&
    `
    background: linear-gradient(
      ${props.theme.background}dd,
      ${props.theme.background}dd
    ),
    linear-gradient(90deg, 
      ${props.theme.accent}11 1px, 
      transparent 1px
    ),
    linear-gradient(
      ${props.theme.accent}11 1px, 
      transparent 1px
    );
    background-size: 100% 100%, 20px 20px, 20px 20px;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(90deg, ${props.theme.accent}11 1px, transparent 1px),
        linear-gradient(${props.theme.accent}11 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridPulse 4s ease infinite;
    }

    @keyframes gridPulse {
      0% { opacity: 0.3; }
      50% { opacity: 0.7; }
      100% { opacity: 0.3; }
    }
  `}
`;

export default DynamicBackground;
