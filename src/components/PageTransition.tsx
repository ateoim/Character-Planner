import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageTransition = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;
