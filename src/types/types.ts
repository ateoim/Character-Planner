export interface Character {
  id: string;
  name: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  description: string;
  avatar: string;
  streakCount: number;
  streakGoal: number;
  streakRewards: {
    milestone: number;
    reward: string;
  }[];
  levelRequired: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  characterId: string;
  dueDate: Date;
  categoryId: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  characterSpecificName?: Record<string, string>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (tasks: Task[], character: Character) => boolean;
  reward?: string;
}
