import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid ${(props) => props.theme.secondary}33;
  border-top-color: ${(props) => props.theme.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
