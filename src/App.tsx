import React, { useState, useEffect } from "react";

import ChatInterface from "./components/ChatInterface";

import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

import { Character, Task } from "./types/types";

import { characters } from "./data/characters";

import { characterTasks } from "./data/characterTasks";

import CharacterSelect from "./components/CharacterSelect";

import TaskList from "./components/TaskList";

import EditTaskForm from "./components/EditTaskForm";

import { lighten, darken } from "polished";

import DynamicBackground from "./components/DynamicBackground";

import MoneyRain from "./components/MoneyRain";

import CharacterPortrait from "./components/CharacterPortrait";

import { initializeGoogleAPI } from "./services/googleCalendar";

import { Toaster } from "react-hot-toast";

import { ResponsiveWrapper } from "./components/ResponsiveWrapper";

import { PageTransition } from "./components/PageTransition";

// Define theme interface

interface Theme {
  primary: string;

  secondary: string;

  background: string;

  text: string;

  accent: string;
}

// Extend styled-components DefaultTheme

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

const GlobalStyle = createGlobalStyle`







  body {







    margin: 0;







    padding: 0;







    background: ${(props) => props.theme.background};







    color: ${(props) => props.theme.text};







    transition: all 0.3s ease;







    min-height: 100vh;







    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;







    -webkit-font-smoothing: antialiased;







  }







`;

const AppContainer = styled.div`
  max-width: 800px;

  margin: 0 auto;

  padding: 20px;

  @media (max-width: 840px) {
    padding: 16px;
  }
`;

const Header = styled.h1`
  color: ${(props) => props.theme.text};

  text-align: center;

  font-size: 2rem;

  font-weight: 600;

  margin: 2rem 0;

  letter-spacing: -0.5px;
`;

const TASKS_STORAGE_KEY = "character_planner_tasks";
const LEVEL_STORAGE_KEY = "character_planner_level";
const COMPLETED_TASKS_STORAGE_KEY = "character_planner_completed";

const App: React.FC = () => {
  console.log("App component rendering");

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // Convert string dates back to Date objects
      return parsedTasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
    }
    return [];
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [currentLevel, setCurrentLevel] = useState(() => {
    // Load level from localStorage
    const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
    return savedLevel ? parseInt(savedLevel) : 0;
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    // Load completed tasks count from localStorage
    const savedCount = localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY);
    return savedCount ? parseInt(savedCount) : 0;
  });

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Save level whenever it changes
  useEffect(() => {
    localStorage.setItem(LEVEL_STORAGE_KEY, currentLevel.toString());
  }, [currentLevel]);

  // Save completed tasks count whenever it changes
  useEffect(() => {
    localStorage.setItem(
      COMPLETED_TASKS_STORAGE_KEY,
      completedTasks.toString()
    );
  }, [completedTasks]);

  // Load character based on saved tasks if any exist
  useEffect(() => {
    if (tasks.length > 0 && !selectedCharacter) {
      const lastTask = tasks[tasks.length - 1];
      const character = characters.find((c) => c.id === lastTask.characterId);
      if (character && character.levelRequired <= currentLevel) {
        setSelectedCharacter(character);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Selected character changed:", selectedCharacter);

    if (selectedCharacter) {
      try {
        // Only set default tasks if there are no existing tasks for this character
        const existingCharacterTasks = tasks.filter(
          (task) => task.characterId === selectedCharacter.id
        );

        if (existingCharacterTasks.length === 0) {
          const characterSpecificTasks = characterTasks[
            selectedCharacter.id as keyof typeof characterTasks
          ].map((task, index) => ({
            id: `${selectedCharacter.id}-${index}`,

            title: task.title,

            description: task.description,

            completed: false,

            characterId: selectedCharacter.id,

            dueDate: new Date(new Date().setHours(9 + index, 0, 0, 0)),

            categoryId: task.categoryId,
          }));

          setTasks((prevTasks) => [...prevTasks, ...characterSpecificTasks]);
        }
      } catch (error) {
        console.error("Error setting tasks:", error);
      }
    }
  }, [selectedCharacter]);

  useEffect(() => {
    initializeGoogleAPI();
  }, []);

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const isCompleting = task && !task.completed;

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    if (isCompleting) {
      const newCompletedCount = completedTasks + 1;
      setCompletedTasks(newCompletedCount);

      if (newCompletedCount % 3 === 0) {
        const newLevel = Math.floor(newCompletedCount / 3);
        console.log(`Leveling up to ${newLevel}`);
        setCurrentLevel(newLevel);
      }
    } else {
      setCompletedTasks((prev) => Math.max(0, prev - 1));
      setCurrentLevel(Math.floor((completedTasks - 1) / 3));
    }
  };

  const handleCharacterSelect = (character: Character) => {
    if (character.levelRequired <= currentLevel) {
      setSelectedCharacter(character);
      // Don't reset tasks here anymore since we're persisting them
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
    }
  };

  const handleSaveEdit = (
    taskId: string,
    title: string,
    description: string,
    dueDate: Date
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title, description, dueDate } : task
      )
    );
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleAddTask = (title: string, description: string, dueDate: Date) => {
    if (selectedCharacter) {
      const newTask: Task = {
        id: `${selectedCharacter.id}-${Date.now()}`,

        title,

        description,

        completed: false,

        characterId: selectedCharacter.id,

        dueDate,

        categoryId: "general",
      };

      setTasks([...tasks, newTask]);
    }
  };

  const getTimeBasedTheme = (character: Character) => {
    const hour = new Date().getHours();

    // Morning theme
    if (hour >= 5 && hour < 12) {
      return {
        ...character.theme,
        background: lighten(0.1, character.theme.background),
        accent: lighten(0.1, character.theme.accent),
      };
    }

    // Night theme
    if (hour >= 20 || hour < 5) {
      return {
        ...character.theme,
        background: darken(0.1, character.theme.background),
        text: lighten(0.1, character.theme.text),
      };
    }

    return character.theme;
  };

  const theme = selectedCharacter
    ? getTimeBasedTheme(selectedCharacter)
    : characters[0].theme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageTransition>
        <ResponsiveWrapper>
          <Toaster position="top-center" />
          {selectedCharacter && (
            <DynamicBackground $character={selectedCharacter} />
          )}
          {selectedCharacter?.id === "richman" && <MoneyRain />}
          <AppContainer>
            <Header>Character Daily Planner</Header>

            <CharacterSelect
              characters={characters}
              onSelect={handleCharacterSelect}
              selectedCharacter={selectedCharacter}
              currentLevel={currentLevel}
            />

            {selectedCharacter && (
              <>
                <CharacterPortrait character={selectedCharacter} />
                <TaskList
                  tasks={tasks}
                  characterId={selectedCharacter.id}
                  onToggleTask={handleToggleTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />

                <ChatInterface
                  character={selectedCharacter}
                  onAddTask={handleAddTask}
                />

                {editingTask && (
                  <EditTaskForm
                    task={editingTask}
                    onEdit={handleSaveEdit}
                    onClose={() => setEditingTask(null)}
                  />
                )}
              </>
            )}
          </AppContainer>
        </ResponsiveWrapper>
      </PageTransition>
    </ThemeProvider>
  );
};

export default App;
