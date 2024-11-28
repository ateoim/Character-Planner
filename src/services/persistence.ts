interface StorageKeys {
  tasks: string;
  level: string;
  completedTasks: string;
  achievements: string;
  characterUnlocks: string;
  preferences: string;
  taskHistory: string;
}

const STORAGE_KEYS: StorageKeys = {
  tasks: "character_planner_tasks",
  level: "character_planner_level",
  completedTasks: "character_planner_completed",
  achievements: "character_planner_achievements",
  characterUnlocks: "character_planner_unlocks",
  preferences: "character_planner_preferences",
  taskHistory: "character_planner_history",
};

interface TaskHistoryEntry {
  taskId: string;
  title: string;
  characterId: string;
  completedAt: string;
}

interface UserPreferences {
  soundEnabled: boolean;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  lastSelectedCharacter: string;
}

interface UnlockedCharacter {
  id: string;
  unlockedAt: string;
}

interface Achievement {
  id: string;
  unlockedAt: string;
  characterId: string;
}

export const persistenceService = {
  // Tasks
  saveTasks: (tasks: Task[]) => {
    const tasksToSave = tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasksToSave));
  },

  loadTasks: (): Task[] => {
    const savedTasks = localStorage.getItem(STORAGE_KEYS.tasks);
    if (!savedTasks) return [];
    return JSON.parse(savedTasks).map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
    }));
  },

  // Task History
  addToTaskHistory: (task: Task) => {
    const history = persistenceService.loadTaskHistory();
    const newEntry: TaskHistoryEntry = {
      taskId: task.id,
      title: task.title,
      characterId: task.characterId,
      completedAt: new Date().toISOString(),
    };
    history.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.taskHistory, JSON.stringify(history));
  },

  loadTaskHistory: (): TaskHistoryEntry[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.taskHistory);
    return saved ? JSON.parse(saved) : [];
  },

  // Character Unlocks
  saveCharacterUnlock: (characterId: string) => {
    const unlocks = persistenceService.loadCharacterUnlocks();
    if (!unlocks.find((u) => u.id === characterId)) {
      unlocks.push({
        id: characterId,
        unlockedAt: new Date().toISOString(),
      });
      localStorage.setItem(
        STORAGE_KEYS.characterUnlocks,
        JSON.stringify(unlocks)
      );
    }
  },

  loadCharacterUnlocks: (): UnlockedCharacter[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.characterUnlocks);
    return saved ? JSON.parse(saved) : [];
  },

  // Achievements
  saveAchievement: (achievementId: string, characterId: string) => {
    const achievements = persistenceService.loadAchievements();
    if (!achievements.find((a) => a.id === achievementId)) {
      achievements.push({
        id: achievementId,
        characterId,
        unlockedAt: new Date().toISOString(),
      });
      localStorage.setItem(
        STORAGE_KEYS.achievements,
        JSON.stringify(achievements)
      );
    }
  },

  loadAchievements: (): Achievement[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.achievements);
    return saved ? JSON.parse(saved) : [];
  },

  // User Preferences
  savePreferences: (preferences: Partial<UserPreferences>) => {
    const currentPrefs = persistenceService.loadPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(
      STORAGE_KEYS.preferences,
      JSON.stringify(updatedPrefs)
    );
  },

  loadPreferences: (): UserPreferences => {
    const saved = localStorage.getItem(STORAGE_KEYS.preferences);
    const defaultPrefs: UserPreferences = {
      soundEnabled: true,
      theme: "dark",
      notificationsEnabled: true,
      lastSelectedCharacter: "",
    };
    return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
  },

  // Level and Progress
  saveLevel: (level: number) => {
    localStorage.setItem(STORAGE_KEYS.level, level.toString());
  },

  loadLevel: (): number => {
    const saved = localStorage.getItem(STORAGE_KEYS.level);
    return saved ? parseInt(saved) : 0;
  },

  saveCompletedTasks: (count: number) => {
    localStorage.setItem(STORAGE_KEYS.completedTasks, count.toString());
  },

  loadCompletedTasks: (): number => {
    const saved = localStorage.getItem(STORAGE_KEYS.completedTasks);
    return saved ? parseInt(saved) : 0;
  },

  // Clear all data
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};
