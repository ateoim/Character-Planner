import React from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${(props) => props.theme.secondary}22;
  border-radius: 12px;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 8px;
  width: ${(props) => props.progress}%;
  background: ${(props) => props.theme.accent};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: ${(props) => props.theme.text};
`;

const CharacterProgress: React.FC<{
  completedTasks: number;
}> = ({ completedTasks }) => {
  const TASKS_PER_LEVEL = 3;
  const currentLevel = Math.floor(completedTasks / TASKS_PER_LEVEL);
  const tasksInCurrentLevel = completedTasks % TASKS_PER_LEVEL;
  const progress = (tasksInCurrentLevel / TASKS_PER_LEVEL) * 100;

  return (
    <ProgressContainer>
      <ProgressBar progress={progress} />
      <ProgressStats>
        <span>
          {tasksInCurrentLevel}/{TASKS_PER_LEVEL} tasks for next level
        </span>
        <span>Level {currentLevel}</span>
      </ProgressStats>
    </ProgressContainer>
  );
};

export default CharacterProgress;
