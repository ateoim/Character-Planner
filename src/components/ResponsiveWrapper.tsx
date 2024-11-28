import styled from "styled-components";

export const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 0.85em;
  }
`;
