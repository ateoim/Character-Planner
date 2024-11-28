const CategoryIcon = styled.span<{ categoryId: string }>`
  font-size: 1.2em;
  margin-right: 10px;
  opacity: 0.8;
  ${(props) =>
    props.categoryId === "ritual" &&
    `
    animation: pulse 2s infinite;
  `}

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;
