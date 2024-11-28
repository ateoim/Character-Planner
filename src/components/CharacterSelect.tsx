import React from "react";
import styled from "styled-components";
import { Character } from "../types/types";

interface Props {
  characters: Character[];
  selectedCharacter: Character | null;
  onSelect: (character: Character) => void;
  currentLevel: number;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      ${(props) => props.theme.accent}44,
      transparent 60%
    );
    border-radius: 14px;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.accent};
  background: rgba(0, 0, 0, 0.8);
  color: ${(props) => props.theme.accent};
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.5px;

  /* Custom arrow */
  appearance: none;
  background-image: ${(
    props
  ) => `linear-gradient(45deg, transparent 50%, ${props.theme.accent} 50%),
    linear-gradient(135deg, ${props.theme.accent} 50%, transparent 50%)`};
  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.accent}33;
  }
`;

const Option = styled.option<{ isLocked: boolean }>`
  background: rgba(0, 0, 0, 0.9);
  color: ${(props) => (props.isLocked ? "#666666" : props.theme.accent)};
  padding: 12px;
  font-weight: ${(props) => (props.isLocked ? "normal" : "bold")};
`;

const CharacterSelect: React.FC<Props> = ({
  characters,
  selectedCharacter,
  onSelect,
  currentLevel,
}) => {
  return (
    <SelectContainer>
      <Select
        value={selectedCharacter?.id || ""}
        onChange={(e) => {
          const character = characters.find((c) => c.id === e.target.value);
          if (character && character.levelRequired <= currentLevel) {
            onSelect(character);
          }
        }}
      >
        <option value="">Select a character</option>
        {characters.map((character) => {
          const isLocked = character.levelRequired > currentLevel;
          return (
            <Option
              key={character.id}
              value={character.id}
              isLocked={isLocked}
              disabled={isLocked}
            >
              {character.name}{" "}
              {isLocked ? `(Unlocks at Level ${character.levelRequired})` : ""}
            </Option>
          );
        })}
      </Select>
    </SelectContainer>
  );
};

export default CharacterSelect;
