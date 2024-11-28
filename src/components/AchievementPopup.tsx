import React from "react";
import styled from "styled-components";
import { Achievement } from "../types/types";

const PopupContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => props.theme.background};
  border: 2px solid ${(props) => props.theme.accent};
  border-radius: 12px;
  padding: 20px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  animation: slideDown 0.5s ease;

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: ${(props) => props.theme.accent};
  font-size: 1.2rem;
`;

const Description = styled.p`
  margin: 5px 0;
  color: ${(props) => props.theme.text};
`;

const Reward = styled.p`
  margin: 10px 0 0 0;
  color: ${(props) => props.theme.accent};
  font-weight: bold;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementPopup: React.FC<Props> = ({ achievement, onClose }) => (
  <PopupContainer>
    <CloseButton onClick={onClose}>×</CloseButton>
    <Title>
      {achievement.icon} {achievement.title}
    </Title>
    <Description>{achievement.description}</Description>
    {achievement.reward && <Reward>🎁 {achievement.reward}</Reward>}
  </PopupContainer>
);

export default AchievementPopup;
