import React, { useState } from "react";
import styled from "styled-components";
import { Task, Achievement } from "../types/types";
import AddTaskForm from "./AddTaskForm";
import CharacterProgress from "./CharacterProgress";
import { taskCategories } from "../data/characterTasks";
import { characters } from "../data/characters";
import AchievementPopup from "./AchievementPopup";
import useAmbientSound from "../hooks/useAmbientSound";
import SyncButton from "./SyncButton";
import toast from "react-hot-toast";

// Define these styled components first
const TaskActions = styled.div`
  display: flex;
  gap: 10px;
`;

const TaskTime = styled.span`
  color: ${(props) => props.theme.accent};
  font-weight: bold;
  min-width: 80px;
`;

// Now we can reference them in TaskItem
const TaskItem = styled.div<{ completed: boolean }>`
  background: ${(props) => props.theme.background}99;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  border: 1px solid ${(props) => props.theme.secondary}22;
  transform: ${(props) => (props.completed ? "scale(0.98)" : "scale(1)")};
  opacity: ${(props) => (props.completed ? 0.8 : 1)};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 12px;

    ${TaskActions} {
      width: 100%;
      justify-content: space-around;
      padding-top: 10px;
      border-top: 1px solid ${(props) => props.theme.secondary}22;
    }

    ${TaskTime} {
      font-size: 0.9em;
    }
  }
`;

// Rest of your styled components...
const TaskListContainer = styled.div`
  margin-top: 2rem;
  background: ${(props) => props.theme.secondary}11;
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

const TaskHeader = styled.h2`
  color: ${(props) => props.theme.text};

  font-size: 1.5rem;

  font-weight: 600;

  margin-bottom: 1.5rem;

  text-align: center;

  letter-spacing: -0.5px;
`;

const TaskTitle = styled.span`
  color: ${(props) => props.theme.text};

  flex-grow: 1;

  margin: 0 15px;
`;

const ActionButton = styled.button`
  background: none;

  border: none;

  color: ${(props) => props.theme.accent};

  cursor: pointer;

  font-size: 1.2rem;

  padding: 5px;

  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.primary};

    transform: scale(1.1);
  }
`;

const AddTaskButton = styled.button`
  background: ${(props) => props.theme.accent};

  color: ${(props) => props.theme.background};

  border: none;

  border-radius: 14px;

  padding: 14px 24px;

  font-size: 1rem;

  font-weight: 500;

  cursor: pointer;

  margin-top: 1rem;

  width: 100%;

  transition: all 0.3s ease;

  box-shadow: 0 2px 8px ${(props) => props.theme.accent}33;

  &:hover {
    transform: translateY(-2px);

    box-shadow: 0 4px 12px ${(props) => props.theme.accent}66;
  }

  &:active {
    transform: translateY(0);
  }
`;

const CategoryIcon = styled.div<{ categoryId: string }>`
  color: ${(props) => props.theme.accent};

  font-size: 1.2rem;

  margin-right: 10px;
`;

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// Add visual feedback animations
const CompletionAnimation = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(
    circle at center,
    ${(props) => props.theme.accent}33 0%,
    transparent 70%
  );
  opacity: 0;
  animation: completion 0.6s ease-out;

  @keyframes completion {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
`;

interface Props {
  tasks: Task[];

  characterId: string;

  onToggleTask: (taskId: string) => void;

  onEditTask: (taskId: string) => void;

  onDeleteTask: (taskId: string) => void;

  onAddTask: (title: string, description: string, dueDate: Date) => void;
}

const TaskList: React.FC<Props> = ({
  tasks,

  characterId,

  onToggleTask,

  onEditTask,

  onDeleteTask,

  onAddTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const character = characters.find((c) => c.id === characterId)!;
  const { playTaskComplete } = useAmbientSound(character);

  const checkAchievements = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      // Check if this completion triggers any achievements
      if (completedTasks + 1 === character.streakGoal) {
        setAchievement({
          id: "streak-complete",
          title: "Streak Complete!",
          description: `Completed ${character.streakGoal} tasks!`,
          icon: "🏆",
          condition: () => true,
          reward: character.streakRewards[0]?.reward,
        });
      }
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      playTaskComplete();
    }
    checkAchievements(taskId);
    onToggleTask(taskId);
  };

  return (
    <TaskListContainer>
      <CharacterProgress
        character={character}
        completedTasks={completedTasks}
      />

      <TaskHeader>Daily Tasks</TaskHeader>

      {tasks.map((task) => (
        <TaskItem key={task.id} completed={task.completed}>
          <TaskTime>
            {new Date(task.dueDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </TaskTime>

          <CategoryIcon categoryId={task.categoryId}>
            {
              taskCategories[task.categoryId as keyof typeof taskCategories]
                ?.icon
            }
          </CategoryIcon>

          <TaskTitle>{task.title}</TaskTitle>

          <TaskActions>
            <ActionButton onClick={() => handleToggleTask(task.id)}>
              {task.completed ? "✅" : "⭕"}
            </ActionButton>
            <ActionButton onClick={() => onEditTask(task.id)}>✏️</ActionButton>
            <SyncButton
              task={task}
              onSync={() => {
                toast.success("Task synced to Google Calendar!", {
                  style: {
                    background: "#333",
                    color: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #444",
                  },
                });
              }}
            />
            <ActionButton onClick={() => onDeleteTask(task.id)}>
              🗑️
            </ActionButton>
          </TaskActions>
        </TaskItem>
      ))}

      <AddTaskButton onClick={() => setShowAddForm(true)}>
        + Add Activity
      </AddTaskButton>

      {showAddForm && (
        <AddTaskForm
          characterId={characterId}
          onAdd={onAddTask}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {achievement && (
        <AchievementPopup
          achievement={achievement}
          onClose={() => setAchievement(null)}
        />
      )}
    </TaskListContainer>
  );
};

export default TaskList;
