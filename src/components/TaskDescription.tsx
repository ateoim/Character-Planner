import styled from "styled-components";

export const TaskDescription = styled.div`
  // ... existing styles ...

  .highlight-word {
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    position: relative;

    &:hover::after {
      content: attr(data-lore);
      position: absolute;
      // ... tooltip styles ...
    }
  }
`;
