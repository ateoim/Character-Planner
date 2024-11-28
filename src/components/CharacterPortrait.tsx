import React from "react";
import styled from "styled-components";
import { Character } from "../types/types";

const PortraitContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${(props) => props.theme.accent};
  box-shadow: 0 0 20px ${(props) => props.theme.accent}66;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.background};

  &:hover {
    transform: scale(1.05) rotate(-2deg);
  }
`;

const TempEmoji = styled.div`
  font-size: 80px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

interface Props {
  character: Character;
}

const CharacterPortrait: React.FC<Props> = ({ character }) => {
  const getCharacterEmoji = (id: string) => {
    const emojiMap: { [key: string]: string } = {
      musk: "🚀", // Rocket for space/tech focus
      crowley: "🔮", // Crystal ball for mysticism
      johnson: "🧬", // DNA for biohacking
      thiel: "🧛‍♂️", // Vampire for his immortality pursuits
      osborne: "🦹‍♂️", // Supervillain for Green Goblin
      mcafee: "🏃‍♂️", // Running man for his escapades
      fischer: "♟️", // Chess piece
      hughes: "✈️", // Airplane for aviation
      epstein: "🏝️", // Island emoji
      richman: "💎", // Diamond for diamond hands
    };

    return emojiMap[id] || "👤";
  };

  return (
    <PortraitContainer>
      <TempEmoji>{getCharacterEmoji(character.id)}</TempEmoji>
    </PortraitContainer>
  );
};

export default CharacterPortrait;
